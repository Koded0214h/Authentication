from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Book

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)  # make optional

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        email = validated_data.get('email', '')  # use empty string if missing
        user = User(username=validated_data['username'], email=email)
        user.set_password(validated_data['password'])
        user.save()
        return user


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

    