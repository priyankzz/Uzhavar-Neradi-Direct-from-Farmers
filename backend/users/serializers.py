"""
User serializers for API.
Copy to: backend/users/serializers.py
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, FarmerProfile, CustomerProfile, DeliveryPartnerProfile

class UserSerializer(serializers.ModelSerializer):
    """Basic User Serializer"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'is_verified', 
                  'preferred_language', 'profile_pic', 'date_joined']
        read_only_fields = ['id', 'is_verified', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    """Registration Serializer"""
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'role', 'phone']
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', User.Role.CUSTOMER),
            phone=validated_data.get('phone', '')
        )
        # Generate and send OTP
        otp = user.generate_otp()
        # In production, send email here
        print(f"OTP for {user.email}: {otp}")
        return user

class LoginSerializer(serializers.Serializer):
    """Login Serializer"""
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                if not user.is_verified:
                    raise serializers.ValidationError("Email not verified")
                data['user'] = user
            else:
                raise serializers.ValidationError("Invalid credentials")
        else:
            raise serializers.ValidationError("Must include email and password")
        
        return data

class OTPVerifySerializer(serializers.Serializer):
    """OTP Verification Serializer"""
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    
    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
            if not user.verify_otp(data['otp']):
                raise serializers.ValidationError("Invalid or expired OTP")
            data['user'] = user
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return data

class FarmerProfileSerializer(serializers.ModelSerializer):
    """Farmer Profile Serializer"""
    user_email = serializers.ReadOnlyField(source='user.email')
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = FarmerProfile
        fields = '__all__'
        read_only_fields = ['is_verified', 'verification_status', 'verified_by', 'verified_at']

class CustomerProfileSerializer(serializers.ModelSerializer):
    """Customer Profile Serializer"""
    class Meta:
        model = CustomerProfile
        fields = '__all__'
        read_only_fields = ['total_orders', 'total_spent']

class DeliveryPartnerProfileSerializer(serializers.ModelSerializer):
    """Delivery Partner Profile Serializer"""
    class Meta:
        model = DeliveryPartnerProfile
        fields = '__all__'
        read_only_fields = ['total_deliveries', 'rating', 'is_verified', 'verification_status']