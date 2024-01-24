import uuid
from django.db import models

# Create your models here.
class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True, default="tag")
    
    def __str__(self):
        return self.name