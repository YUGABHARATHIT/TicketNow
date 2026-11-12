import uuid
import razorpay
from django.db import transaction
from django.conf import settings
from django.contrib.auth.models import User

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from .models import Movie, Theatre, Show, Booking, UserProfile
from .serializers import (
    MovieSerializer,
    TheatreSerializer,
    ShowSerializer,
    BookingSerializer,
    UserProfileSerializer,
)


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.filter(is_active=True)
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class TheatreViewSet(viewsets.ModelViewSet):
    queryset = Theatre.objects.filter(is_active=True)
    serializer_class = TheatreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.filter(
        is_active=True,
        movie__is_active=True,
        theatre__is_active=True,
    ).select_related("movie", "theatre")
    serializer_class = ShowSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Booking.objects.select_related(
            "user", "show__movie", "show__theatre"
        ).order_by("-created_at")

@api_view(["POST"])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Account created successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user

    profile, created = UserProfile.objects.get_or_create(
        user=user
    )

    if request.method == "PATCH":
        serializer = UserProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully",
                "user": serializer.data
            })

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = UserProfileSerializer(profile)

    return Response({
        "id": user.id,
        "username": user.username,
        "name": user.first_name or user.username,
        "email": user.email,
        "phone": serializer.data["phone"],
        "profile_image": None,
    })

@api_view(["POST"])
def google_login(request):
    credential = request.data.get("credential")

    if not credential:
        return Response(
            {"error": "Google credential is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Verify Google's ID token
        google_user = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )

        email = google_user.get("email")
        email_verified = google_user.get("email_verified", False)

        if not email or not email_verified:
            return Response(
                {"error": "Google email is not verified"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Find existing account by verified email
        user = User.objects.filter(email__iexact=email).first()

        if not user:
            username = email

            if User.objects.filter(username=username).exists():
                username = f"{email}_{uuid.uuid4().hex[:8]}"

            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=google_user.get("given_name", ""),
                last_name=google_user.get("family_name", ""),
            )

        # Activate verified Google accounts
        if not user.is_active:
            user.is_active = True
            user.save(update_fields=["is_active"])

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Google login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "name": user.first_name or google_user.get("name", ""),
                "email": user.email,
                "picture": google_user.get("picture"),
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

    except ValueError:
        return Response(
            {"error": "Invalid Google credential"},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_payment_order(request):
    show_id = request.data.get("show_id")
    seats = request.data.get("seats")

    if not show_id or not isinstance(seats, list) or not seats:
        return Response(
            {"error": "Show ID and seats are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if any(not isinstance(seat, str) or not seat.strip() for seat in seats):
        return Response(
            {"error": "Invalid seat selection"},
            status=status.HTTP_400_BAD_REQUEST
        )

    seats = [seat.strip() for seat in seats]

    if len(seats) != len(set(seats)):
        return Response(
            {"error": "Duplicate seats are not allowed"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        show = Show.objects.get(
            id=show_id,
            is_active=True,
            movie__is_active=True,
            theatre__is_active=True
        )
    except Show.DoesNotExist:
        return Response(
            {"error": "Show not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check seats already confirmed for this show
    confirmed_bookings = Booking.objects.filter(
        show=show,
        status=Booking.Status.CONFIRMED,
        payment_status=Booking.PaymentStatus.PAID
    )

    for booking in confirmed_bookings:
        if set(seats) & set(booking.seats):
            return Response(
                {"error": "One or more selected seats are already booked"},
                status=status.HTTP_409_CONFLICT
            )

    total_amount = show.ticket_price * len(seats)
    amount_in_paise = int(total_amount * 100)

    booking_code = uuid.uuid4().hex[:12].upper()

    try:
        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET
            )
        )

        order = client.order.create({
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": booking_code,
        })

        booking = Booking.objects.create(
            user=request.user,
            show=show,
            booking_code=booking_code,
            seats=seats,
            total_amount=total_amount,
            status=Booking.Status.PENDING,
            payment_status=Booking.PaymentStatus.UNPAID,
            razorpay_order_id=order["id"]
        )

        return Response({
            "message": "Payment order created",
            "booking_id": booking.id,
            "booking_code": booking.booking_code,
            "razorpay_order_id": order["id"],
            "razorpay_key_id": settings.RAZORPAY_KEY_ID,
            "amount": amount_in_paise,
            "currency": "INR",
        }, status=status.HTTP_201_CREATED)

    except Exception:
        return Response(
            {"error": "Unable to create payment order"},
            status=status.HTTP_502_BAD_GATEWAY
        )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    booking_id = request.data.get("booking_id")
    payment_id = request.data.get("razorpay_payment_id")
    order_id = request.data.get("razorpay_order_id")
    signature = request.data.get("razorpay_signature")

    if not all([booking_id, payment_id, order_id, signature]):
        return Response(
            {"error": "Payment details are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        with transaction.atomic():
            booking = Booking.objects.select_for_update().get(
                id=booking_id,
                user=request.user
            )

            if booking.razorpay_order_id != order_id:
                return Response(
                    {"error": "Order does not match booking"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if booking.payment_status == Booking.PaymentStatus.PAID:
                return Response({"message": "Payment already verified"})

            client = razorpay.Client(
                auth=(
                    settings.RAZORPAY_KEY_ID,
                    settings.RAZORPAY_KEY_SECRET
                )
            )

            client.utility.verify_payment_signature({
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature,
            })

            booking.razorpay_payment_id = payment_id
            booking.payment_status = Booking.PaymentStatus.PAID
            booking.status = Booking.Status.CONFIRMED
            booking.save()

        return Response({
            "message": "Payment verified successfully",
            "booking_id": booking.id,
            "booking_code": booking.booking_code,
            "status": "CONFIRMED"
        })

    except Booking.DoesNotExist:
        return Response(
            {"error": "Booking not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    except razorpay.errors.SignatureVerificationError:
        return Response(
            {"error": "Invalid payment signature"},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception:
        return Response(
            {"error": "Payment verification failed"},
            status=status.HTTP_400_BAD_REQUEST
        )