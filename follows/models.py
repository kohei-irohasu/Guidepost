import uuid
from django.db import models

from config import settings

# Create your models here.
class UserFollow(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='following',
        null=True
    )
    followee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='followers',
        null=True
    )
    
    class Meta:
        unique_together = ['follower', 'followee']