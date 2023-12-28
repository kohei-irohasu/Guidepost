from rest_framework import serializers
from .models import Tag

class TagSerializer(serializers.ModelSerializer):
    """タグ用のシリアライザ"""
    class Meta:
        model = Tag
        fields = ['id', 'name']