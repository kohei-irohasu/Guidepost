import uuid
from django.db import models

from config import settings
from tags.models import Tag

class Story(models.Model):
    """キャリアストーリーのモデル"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    text = models.TextField()
    private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='stories',
        on_delete=models.CASCADE
    )
    tags = models.ManyToManyField(
        Tag, 
        related_name='related_stories'
    ) 
    
    class Meta:
        ordering = ['-created_at']
        