from .models import CastCrew
from django.contrib import admin
from .models import Movie, Theatre, Show, Booking


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("title", "language", "duration_minutes", "is_active")
    search_fields = ("title", "language")
    list_filter = ("language", "is_active")


@admin.register(Theatre)
class TheatreAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "total_seats", "is_active")
    search_fields = ("name", "city")
    list_filter = ("city", "is_active")


@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    list_display = (
        "movie", "theatre", "show_date",
        "show_time", "ticket_price", "is_active"
    )
    list_filter = ("show_date", "is_active")
    search_fields = ("movie__title", "theatre__name")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "booking_code", "user", "show",
        "total_amount", "status", "payment_status"
    )
    search_fields = ("booking_code", "user__username")
    list_filter = ("status", "payment_status")
    
@admin.register(CastCrew)
class CastCrewAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "movie")
    list_filter = ("role", "movie")
    search_fields = ("name", "movie__title")