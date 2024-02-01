from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, generics
from django.core.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Story
from accounts.models import User
from .serializers import StorySerializer

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Set the user of the created story to the current user
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        # Check if the user making the request is the owner of the story 
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("You do not have permission to modify this story.")
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You do not have permission to modify this story.")
        instance.delete()
    