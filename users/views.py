from .serializers import (
    UserCreateSerializer, LoginSerializer, PublicUserSerializer, UserSerializer, UserUpdateSerializer
)
from django.contrib.auth import login, get_user_model
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token

from .models import Users
from .permissions import IsUserOrReadOnly

# ユーザー作成用のView
class UserCreateView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response({
                'user': UserCreateSerializer(user).data,
                'message': 'ユーザー登録完了しました!'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ログイン用のAPIView
class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({'message': 'ログインが成功しました！',
                             'token': token.key,
                             'username': user.username},
                            status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ログアウト用のView
class LogoutAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        request.auth.destroy()
        return Response(status=status.HTTP_200_OK)

# ユーザー情報取得用のAPIView
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        email = request.user.email
        try:
            user = get_user_model().objects.get(email=email)
        except Users.DoesNotExist:
            return Response({'message': 'ユーザーが見つかりませんでした。'}, status=status.HTTP_404_NOT_FOUND)    
        
        if request.user != user:
            serializer = PublicUserSerializer(user)
        else:
            serializer = UserSerializer(user)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

# ユーザー情報更新用のView
class UserUpdateView(generics.UpdateAPIView):
    queryset = Users.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsUserOrReadOnly]

# ユーザー削除用のView
class UserDeleteView(generics.DestroyAPIView):
    queryset = Users.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    