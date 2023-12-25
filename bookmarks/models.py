import uuid
from django.db import models

from config import settings
from stories.models import Story

# Create your models here.
class Bookmark(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name = 'bookmark'
    )
    story = models.ForeignKey(Story, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ['user', 'story']