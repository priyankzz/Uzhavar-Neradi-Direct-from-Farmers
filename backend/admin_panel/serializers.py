"""
Admin Panel Serializers.
Copy to: backend/admin_panel/serializers.py
"""
from products.models import Category
from analytics.models import FestivalCalendar
from .models import Announcement
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    PlatformSettings, PlatformLogo, MiddlemanFlag,
    Dispute, DisputeMessage, AuditLog, Announcement
)
from users.models import FarmerProfile, CustomerProfile, DeliveryPartnerProfile
from users.serializers import UserSerializer

User = get_user_model()

class PlatformSettingsSerializer(serializers.ModelSerializer):
    """Platform Settings Serializer"""
    class Meta:
        model = PlatformSettings
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class PlatformLogoSerializer(serializers.ModelSerializer):
    """Platform Logo Serializer"""
    logo_url = serializers.SerializerMethodField()
    favicon_url = serializers.SerializerMethodField()
    
    class Meta:
        model = PlatformLogo
        fields = ['id', 'logo', 'favicon', 'logo_url', 'favicon_url', 'is_active', 'uploaded_at']
        read_only_fields = ['uploaded_at']
    
    def get_logo_url(self, obj):
        if obj.logo:
            return obj.logo.url
        return None
    
    def get_favicon_url(self, obj):
        if obj.favicon:
            return obj.favicon.url
        return None

class VerificationRequestSerializer(serializers.Serializer):
    """Serializer for verification requests"""
    id = serializers.IntegerField()
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.CharField()
    documents = serializers.ListField(child=serializers.DictField())
    submitted_at = serializers.DateTimeField()
    status = serializers.CharField()

class FarmerVerificationSerializer(serializers.ModelSerializer):
    """Farmer Verification Serializer"""
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = FarmerProfile
        fields = ['id', 'user_details', 'farm_name', 'farm_address', 'farm_size',
                  'farming_type', 'aadhaar_number', 'aadhaar_doc', 'land_doc',
                  'verification_status', 'rejection_reason', 'created_at']
        read_only_fields = ['created_at']

class MiddlemanFlagSerializer(serializers.ModelSerializer):
    """Middleman Flag Serializer"""
    user_email = serializers.ReadOnlyField(source='user.email')
    username = serializers.ReadOnlyField(source='user.username')
    investigated_by_name = serializers.ReadOnlyField(source='investigated_by.username', default=None)
    
    class Meta:
        model = MiddlemanFlag
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class DisputeSerializer(serializers.ModelSerializer):
    """Dispute Serializer"""
    raised_by_name = serializers.ReadOnlyField(source='raised_by.username')
    against_user_name = serializers.ReadOnlyField(source='against_user.username', default=None)
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.username', default=None)
    resolved_by_name = serializers.ReadOnlyField(source='resolved_by.username', default=None)
    order_number = serializers.ReadOnlyField(source='order.order_number', default=None)
    
    class Meta:
        model = Dispute
        fields = '__all__'
        read_only_fields = ['dispute_id', 'created_at', 'updated_at', 'resolved_at']

class DisputeMessageSerializer(serializers.ModelSerializer):
    """Dispute Message Serializer"""
    sender_name = serializers.ReadOnlyField(source='sender.username')
    
    class Meta:
        model = DisputeMessage
        fields = '__all__'
        read_only_fields = ['created_at']

class AuditLogSerializer(serializers.ModelSerializer):
    """Audit Log Serializer"""
    user_name = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ['timestamp']

class AnnouncementSerializer(serializers.ModelSerializer):
    """Announcement Serializer"""
    created_by_name = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = Announcement
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class AdminDashboardSerializer(serializers.Serializer):
    """Admin Dashboard Summary"""
    total_users = serializers.IntegerField()
    pending_verifications = serializers.IntegerField()
    active_disputes = serializers.IntegerField()
    pending_flags = serializers.IntegerField()
    today_orders = serializers.IntegerField()
    today_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_revenue_month = serializers.DecimalField(max_digits=12, decimal_places=2)
    user_growth = serializers.ListField(child=serializers.DictField())
    recent_activities = serializers.ListField(child=serializers.DictField())

class CategoryAdminSerializer(serializers.ModelSerializer):
    """Category serializer for admin"""
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name_en', 'name_ta', 'description', 'icon', 'is_active', 'product_count', 'created_at']
    
    def get_product_count(self, obj):
        return obj.products.count()

class FestivalAdminSerializer(serializers.ModelSerializer):
    """Festival serializer for admin"""
    affected_categories_details = serializers.SerializerMethodField()
    
    class Meta:
        model = FestivalCalendar
        fields = '__all__'
    
    def get_affected_categories_details(self, obj):
        return [{'id': cat.id, 'name': cat.name_en} for cat in obj.affected_categories.all()]

class AnnouncementAdminSerializer(serializers.ModelSerializer):
    """Announcement serializer for admin"""
    created_by_name = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = Announcement
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class AuditLogAdminSerializer(serializers.ModelSerializer):
    """Audit log serializer for admin"""
    user_name = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = AuditLog
        fields = '__all__'