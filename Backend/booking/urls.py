from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView
from django.urls import path
from .views import (
    MovieViewSet,
    TheatreViewSet,
    ShowViewSet,
    BookingViewSet,
)

router = DefaultRouter()

router.register("movies", MovieViewSet, basename="movie")
router.register("theatres", TheatreViewSet, basename="theatre")
router.register("shows", ShowViewSet, basename="show")
router.register("bookings", BookingViewSet, basename="booking")

urlpatterns = [
    *router.urls,
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
]