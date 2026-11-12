from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView
from django.urls import path
from .views import (
    MovieViewSet,
    TheatreViewSet,
    ShowViewSet,
    BookingViewSet,
    register_user,
    current_user,
    google_login,
    create_payment_order,
    verify_payment,
)

router = DefaultRouter()

router.register("movies", MovieViewSet, basename="movie")
router.register("theatres", TheatreViewSet, basename="theatre")
router.register("shows", ShowViewSet, basename="show")
router.register("bookings", BookingViewSet, basename="booking")

urlpatterns = [
    *router.urls,
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("register/", register_user, name="register"),
    path("profile/", current_user, name="current_user"),
    path("google-login/", google_login, name="google_login"),
    path(
    "create-payment-order/",
    create_payment_order,
    name="create_payment_order",
    
),
path(
    "verify-payment/",
    verify_payment,
    name="verify_payment"
),
]