from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.SimpleRouter()
router.register('', views.StoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]