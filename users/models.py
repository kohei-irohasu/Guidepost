# import uuid
# from django.db import models
# from django.contrib.auth.models import (
#     BaseUserManager, AbstractBaseUser, PermissionsMixin
# )

# class UserManager(BaseUserManager):
#     def create_user(self, username, email, password=None):
#         if not email:
#             raise ValueError('Enter Email')
#         user = self.model(
#             username=username,
#             email=email
#         )
#         user.set_password(password)
#         user.save(using=self._db)
#         return user
        

# class Users(AbstractBaseUser, PermissionsMixin):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     username = models.CharField(max_length=150)
#     email = models.EmailField(max_length=255, unique=True)
#     profile = models.TextField(blank=True)
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
    
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['username']
    
#     objects = UserManager()    