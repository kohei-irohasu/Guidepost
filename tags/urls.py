from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.SimpleRouter()
router.register('tags', views.TagViewSet)

urlpatterns = [
    path('', include(router.urls)),
]