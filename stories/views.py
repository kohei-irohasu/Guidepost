from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Story
from .serializers import StorySerializer

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    
    def perform_create(self, serializer):
        # Set the user of the created story to the current user
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        # Check if the user making the request is the owner of the story 
        if serializer.instance.user != self.request.user:
            raise PermissionError('You do not have permission to update this story.')
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionError('You do not have permission to delete this story.')
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)