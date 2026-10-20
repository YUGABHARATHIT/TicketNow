
from django.conf import settings
from django.db import models


class Movie(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    language = models.CharField(max_length=50, default="Tamil")
    genre = models.CharField(max_length=100, blank=True)
    duration_minutes = models.PositiveIntegerField(default=150)
    release_date = models.DateField(null=True, blank=True)
    poster = models.ImageField(
        upload_to="movies/",
        blank=True,
        null=True,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Theatre(models.Model):
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    address = models.TextField(blank=True)
    total_seats = models.PositiveIntegerField(default=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.city}"


class Show(models.Model):
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="shows",
    )
    theatre = models.ForeignKey(
        Theatre,
        on_delete=models.CASCADE,
        related_name="shows",
    )
    show_date = models.DateField()
    show_time = models.TimeField()
    ticket_price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=180,
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["show_date", "show_time"]

    def __str__(self):
        return f"{self.movie.title} - {self.theatre.name}"


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"

    class PaymentStatus(models.TextChoices):
        UNPAID = "UNPAID", "Unpaid"
        PAID = "PAID", "Paid"
        FAILED = "FAILED", "Failed"
        REFUNDED = "REFUNDED", "Refunded"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="ticket_bookings",
    )
    show = models.ForeignKey(
        Show,
        on_delete=models.PROTECT,
        related_name="bookings",
    )
    booking_code = models.CharField(max_length=20, unique=True)
    seats = models.JSONField(default=list)
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.UNPAID,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.booking_code
class CastCrew(models.Model):
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="cast_crew",
    )
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=100)
    image = models.ImageField(
        upload_to="cast_crew/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.name} - {self.movie.title}"