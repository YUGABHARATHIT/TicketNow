from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from .models import Movie, Theatre, Show, Booking
from .serializers import (
    MovieSerializer,
    TheatreSerializer,
    ShowSerializer,
    BookingSerializer,
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
