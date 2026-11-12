from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Movie, Theatre, Show, Booking, UserProfile


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

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = ["id", "first_name", "username", "email", "password"]
        read_only_fields = ["username"]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "This email is already registered."
            )
        return value

    def create(self, validated_data):
        email = validated_data["email"].strip().lower()

        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=validated_data["first_name"].strip(),
            password=validated_data["password"],
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        source="user.first_name",
        required=False
    )
    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    class Meta:
        model = UserProfile
        fields = ["name", "email", "phone"]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        if "first_name" in user_data:
            instance.user.first_name = user_data["first_name"]
            instance.user.save(update_fields=["first_name"])

        return super().update(instance, validated_data)