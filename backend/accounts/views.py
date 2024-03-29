from rest_framework import status, views, generics
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
from dj_rest_auth.registration.views import RegisterView

from .serializers import (
    LoginSerializer, UserSerializer, 
    PublicUserSerializer, LogoutSerializer,
    RegistrationSerializer, UserUpdateSerializer,
    UserDeleteSerializer,
)

User = get_user_model()

# dj_rest_authの新規登録をカスタマイズ
class customRegistrationView(RegisterView):
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            return Response({'error': 'email address is alredy in use.'}, status=status.HTTP_400_BAD_REQUEST)

# ログイン用
class LoginView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        validated_data = serializer.validated_data
        
        access_token = validated_data.get('access_token')
        refresh_token = validated_data.get('refresh_token')
        user = validated_data.get('user')
        
        # print(access_token)
        
        response_data = {'message': 'Login successful'}
        
        response = Response(response_data)
        response.set_cookie('access_token', access_token, httponly=True)
        response.set_cookie('refresh_token', refresh_token, httponly=True)
        # response.set_cookie('access_token', access_token, httponly=True, samesite='None', secure=True)
        # response.set_cookie('refresh_token', refresh_token, httponly=True, samesite='None', secure=True)
        
        return response
# ログアウト用
class LogoutView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        refresh = serializer.validated_data['refresh']
        try:
            RefreshToken(refresh).blacklist()
            return Response({'detail': 'Succesfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': 'Invalid refresh token.'}, status=status.HTTP_400_BAD_REQUEST)

# ユーザーの新規作成用
class RegistrationView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'User successfully registered.'}, status=status.HTTP_201_CREATED)
        
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ユーザー情報取得用
class UserProfileView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        email = request.user.email
        try:
            user = get_user_model().objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'ユーザーが見つかりませんでした。'}, status=status.HTTP_404_NOT_FOUND)    
        
        if request.user != user:
            serializer = PublicUserSerializer(user)
        else:
            serializer = UserSerializer(user)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    
# ユーザー情報更新用
class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user 

# ユーザー削除用
class UserDeleteView(generics.DestroyAPIView):
    serializer_class = UserDeleteSerializer
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        password = serializer.validated_data['password']
        if request.user.check_password(password):
            self.perform_destroy(request.user)
            return Response({'detail': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'Incorrect password. User not deleted.'}, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self):
        return self.request.user 
    