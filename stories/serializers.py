from rest_framework import serializers
from .models import Story

class StorySerializer(serializers.ModelSerializer):
    """キャリアストーリー用のシリアライザ"""
    class Meta:
        model = Story
        fields = ['id', 'title', 'text', 'private', 'user', 'tags']