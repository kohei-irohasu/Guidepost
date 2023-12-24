from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserCreateView.as_view(), name='register'),
    path('delete/', views.UserDeleteView.as_view(), name='delete'),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('detail/', views.UserDetailView.as_view(), name='detail'),
    path('detail/update/<int:pk>/', views.UserUpdateView.as_view(), name='update'),
]