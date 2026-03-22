from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from .models import User, OTP
from .serializers import (
    UserRegistrationSerializer, OTPVerifySerializer,
    LoginSerializer, UserDetailSerializer, 
    FarmerProfileUpdateSerializer, UserProfileUpdateSerializer
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)  # ← add this
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        #serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Generate and send OTP
        otp = OTP.objects.create(user=user)
        otp.send_via_email()
        return Response({'message': 'OTP sent to email. Please verify.'}, status=status.HTTP_201_CREATED)

class VerifyOTPView(generics.GenericAPIView):
    serializer_class = OTPVerifySerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        try:
            user = User.objects.get(email=email)
            otp = user.otps.filter(is_used=False).latest('created_at')
            if otp.code == code and otp.is_valid():
                otp.is_used = True
                otp.save()
                user.is_active = True
                user.save()
                return Response({'message': 'Email verified. Waiting for admin approval.'})
            else:
                return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(request, username=email, password=password)
        if user and user.is_active:
            if not user.is_approved:
                return Response({'error': 'Your account is not approved by admin yet. Please wait.'},
                                status=status.HTTP_403_FORBIDDEN)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserDetailSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

from rest_framework import generics, permissions
from .models import User
from .serializers import UserDetailSerializer

class AllUsersView(generics.ListAPIView):
    """
    List all users (admin only)
    """
    permission_classes = [permissions.IsAdminUser]
    serializer_class = UserDetailSerializer
    queryset = User.objects.all().order_by('-date_joined')
    filterset_fields = ['role', 'is_approved', 'is_active']

class UserDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a specific user (admin only)
    """
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer

class UpdateFarmerUPIView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FarmerProfileUpdateSerializer

    def get_object(self):
        user = self.request.user
        if user.role != 'farmer':
            self.permission_denied(self.request, message="Only farmers can update UPI ID")
        return user

class UserProfileUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileUpdateSerializer

    def get_object(self):
        return self.request.user
    def update(self, request, *args, **kwargs):
        print("Received data:", request.data)
        return super().update(request, *args, **kwargs)