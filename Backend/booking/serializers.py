
from rest_framework import serializers
from .models import Movie, Theatre, Show, Booking


class MovieSerializer(serializers.ModelSerializer):
    poster_url = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = "__all__"

    def get_poster_url(self, obj):
        request = self.context.get("request")
        if obj.poster:
            url = obj.poster.url
            return request.build_absolute_uri(url) if request else url
        return None


class TheatreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theatre
        fields = "__all__"


class ShowSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(
        source="movie.title", read_only=True
    )
    theatre_name = serializers.CharField(
        source="theatre.name", read_only=True
    )
    city = serializers.CharField(
        source="theatre.city", read_only=True
    )

    class Meta:
        model = Show
        fields = "__all__"


class BookingSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(
        source="show.movie.title", read_only=True
    )
    theatre_name = serializers.CharField(
        source="show.theatre.name", read_only=True
    )
    show_date = serializers.DateField(
        source="show.show_date", read_only=True
    )
    show_time = serializers.TimeField(
        source="show.show_time", read_only=True
    )

    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = (
            "user", "booking_code", "total_amount",
            "status", "payment_status",
        )
