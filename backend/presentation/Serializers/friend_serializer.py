from rest_framework import serializers
from presentation.models import Friend


class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ['type', 'owner', 'items']
