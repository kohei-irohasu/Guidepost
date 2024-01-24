from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth import get_user_model

User = get_user_model()

# ログイン用
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = User.objects.filter(email=email).first()
            
            if user and user.check_password(password):
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                
                return {'access_token': access_token, 'refresh_token': refresh_token, 'user': user}
                
            else:
                raise serializers.ValidationError('Invalid credentials. Please try again.')
        else:
            raise serializers.ValidationError('Both email and password are required.')

# ログアウト用
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

# ユーザーの新規作成用
class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['uuid', 'email', 'nick_name', 'profile', 'password', 'password_confirm']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password': '確認パスワードと一致しません'})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(
            nick_name=validated_data['nick_name'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
                
        return user

# ユーザー情報取得用
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['uuid', 'email', 'nick_name', 'profile']
        read_only_fields = ('email',)
        
# 一般公開用
class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('nick_name', 'profile')

# ユーザーの情報の更新用
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'nick_name', 'profile']

# ユーザー削除用
class UserDeleteSerializer(serializers.Serializer):
    password = serializers.CharField(style={'input_type': 'password'})