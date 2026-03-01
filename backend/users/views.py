from django.shortcuts import render

# Create your views here.
"""
User views for API.
Copy to: backend/users/views.py
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import FarmerProfile, CustomerProfile, DeliveryPartnerProfile
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    OTPVerifySerializer, FarmerProfileSerializer,
    CustomerProfileSerializer, DeliveryPartnerProfileSerializer
)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """User Registration"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    """User Login"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OTPVerifyView(APIView):
    """Verify OTP"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Email verified successfully',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    """Resend OTP"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            otp = user.generate_otp()
            print(f"New OTP: {otp}")  # In production, send email
            return Response({'message': 'OTP resent successfully'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get/Update User Profile"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class CreateFarmerProfileView(generics.CreateAPIView):
    """Create Farmer Profile"""
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GetFarmerProfileView(generics.RetrieveAPIView):
    """Get Farmer Profile"""
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return FarmerProfile.objects.get(user=self.request.user)

class CreateCustomerProfileView(generics.CreateAPIView):
    """Create Customer Profile"""
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GetCustomerProfileView(generics.RetrieveAPIView):
    """Get Customer Profile"""
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return CustomerProfile.objects.get(user=self.request.user)

class CreateDeliveryProfileView(generics.CreateAPIView):
    """Create Delivery Partner Profile"""
    serializer_class = DeliveryPartnerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GetDeliveryProfileView(generics.RetrieveAPIView):
    """Get Delivery Partner Profile"""
    serializer_class = DeliveryPartnerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return DeliveryPartnerProfile.objects.get(user=self.request.user)