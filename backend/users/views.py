"""
User views for API.
Copy to: backend/users/views.py
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from .models import FarmerProfile, CustomerProfile, DeliveryPartnerProfile
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    OTPVerifySerializer, FarmerProfileSerializer,
    CustomerProfileSerializer, DeliveryPartnerProfileSerializer
)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """User Registration with Email OTP"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        
        # Send OTP via email (only if not superuser)
        if not user.is_superuser and user.email_otp:
            subject = 'Uzhavar Neradi - Email Verification OTP'
            message = f'''
Hello {user.username},

Thank you for registering with Uzhavar Neradi!

Your OTP for email verification is: {user.email_otp}

This OTP is valid for 10 minutes.

If you didn't request this, please ignore this email.

Thanks,
Uzhavar Neradi Team
            '''
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [user.email]
            
            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)
                print(f"✅ OTP email sent successfully to {user.email}")
            except Exception as e:
                print(f"❌ Failed to send email to {user.email}")
                print(f"⚠️ OTP is: {user.email_otp} (use this for verification)")
                print(f"Error: {str(e)}")

class LoginView(APIView):
    """User Login - Fixed for superusers"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            
            # Serialize user data
            user_data = UserSerializer(user).data
            
            return Response({
                'user': user_data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'message': 'Login successful'
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
            
            # Send welcome email after verification
            if not user.is_superuser:
                subject = 'Welcome to Uzhavar Neradi!'
                message = f'''
Hello {user.username},

Welcome to Uzhavar Neradi! Your email has been successfully verified.

You can now:
• Browse fresh produce directly from farmers
• Place orders and track deliveries
• Connect with local farmers

Thank you for joining our community!

Thanks,
Uzhavar Neradi Team
                '''
                from_email = settings.DEFAULT_FROM_EMAIL
                recipient_list = [user.email]
                
                try:
                    send_mail(subject, message, from_email, recipient_list, fail_silently=False)
                    print(f"✅ Welcome email sent to {user.email}")
                except Exception as e:
                    print(f"❌ Failed to send welcome email: {e}")
            
            return Response({
                'message': 'Email verified successfully',
                'user': UserSerializer(user).data,
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
            
            if user.is_superuser:
                return Response({'error': 'Superuser does not need OTP verification'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            if user.is_verified:
                return Response({'error': 'Email already verified'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Generate new OTP
            otp = user.generate_otp()
            
            # Send OTP via email
            subject = 'Uzhavar Neradi - New OTP for Verification'
            message = f'''
Hello {user.username},

Your new OTP for email verification is: {otp}

This OTP is valid for 10 minutes.

If you didn't request this, please ignore this email.

Thanks,
Uzhavar Neradi Team
            '''
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [user.email]
            
            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)
                print(f"✅ New OTP email sent successfully to {user.email}")
                return Response({'message': 'OTP resent successfully. Please check your email.'})
            except Exception as e:
                print(f"❌ Failed to send email to {user.email}")
                print(f"⚠️ New OTP is: {otp} (use this for verification)")
                print(f"Error: {str(e)}")
                return Response({
                    'message': 'OTP generated successfully',
                    'otp': otp,  # Only for development - remove in production
                    'warning': 'Email sending failed, but OTP is shown for testing'
                })
            
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