from rest_framework import serializers
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Story
from tags.models import Tag

class StorySerializer(serializers.ModelSerializer):
    """キャリアストーリー用のシリアライザ"""
    user = serializers.ReadOnlyField(source='user.email')
    tags = serializers.SlugRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        slug_field='name',
        required=False
    )
    tags_write = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )
        
    class Meta:
        model = Story
        fields = ['id', 'title', 'text', 'privacy', 'user', 'tags', 'tags_write', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags_write', [])
        story = Story.objects.create(**validated_data)
        for tag_name in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            story.tags.add(tag)
        return story
    
    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags_write', [])
        instance.tags.clear()
        for tag_name in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            instance.tags.add(tag)
        return super().update(instance, validated_data)

