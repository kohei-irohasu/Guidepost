from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
import re

Users = get_user_model()

# 新規登録用のシリアライザ
class UserCreateSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Users
        fields = ('username', 'id', 'email', 'password', 'password_confirm',)
        
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password': '確認パスワードと一致しません'})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = Users.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        
        return user
    
# ログイン用のシリアライザ
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                msg = '提供された認証情報ではログインできません。'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'emailとpasswordを入れてください。'
            raise serializers.ValidationError(msg, code='authorizaiton')
        
        attrs['user'] = user
        return attrs

# ユーザー情報取得用のシリアライザ
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'username', 'email', 'profile')

# 一般公開用
class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('username', 'profile')
        
# ユーザー情報編集用のシリアライザ
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('username', 'email', 'profile')
        
        def update(self, instance, validated_data):
            instance.username = validated_data.get('username', instance.username)
            instance.email = validated_data.get('email', instance.email)
            instance.profile = validated_data.get('profile', instance.profile)
            instance.save()
            return instance