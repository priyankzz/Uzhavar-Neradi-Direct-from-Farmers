"""
User models for all roles.
Copy to: backend/users/models.py
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
import random

class User(AbstractUser):
    """Custom User Model"""
    class Role(models.TextChoices):
        FARMER = 'FARMER', 'Farmer'
        CUSTOMER = 'CUSTOMER', 'Customer'
        DELIVERY = 'DELIVERY', 'Delivery Partner'
        ADMIN = 'ADMIN', 'Admin'

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    phone = models.CharField(max_length=15, blank=True)
    is_verified = models.BooleanField(default=False)
    email_otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    profile_pic = models.ImageField(upload_to='profiles/', blank=True, null=True)
    preferred_language = models.CharField(max_length=10, default='ta')
    
    def generate_otp(self):
        """Generate 6 digit OTP"""
        self.email_otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        self.otp_created_at = timezone.now()
        self.save()
        return self.email_otp
    
    def verify_otp(self, otp):
        """Verify OTP (valid for 10 minutes)"""
        if self.email_otp == otp and self.otp_created_at:
            expiry = self.otp_created_at + timezone.timedelta(minutes=10)
            if timezone.now() <= expiry:
                self.is_verified = True
                self.email_otp = None
                self.otp_created_at = None
                self.save()
                return True
        return False
    
    def __str__(self):
        return f"{self.username} - {self.role}"

# Signal to sync superuser with custom fields
@receiver(post_save, sender=User)
def sync_superuser(sender, instance, created, **kwargs):
    """Automatically set superuser as ADMIN and verified"""
    if instance.is_superuser:
        # Only update if needed to avoid recursion
        if instance.role != 'ADMIN' or not instance.is_verified:
            User.objects.filter(pk=instance.pk).update(
                role='ADMIN', 
                is_verified=True
            )

class FarmerProfile(models.Model):
    """Farmer Profile Model with Payment Info"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    farm_name = models.CharField(max_length=200)
    farm_address = models.TextField()
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    farm_size = models.FloatField(help_text="Size in acres")
    farming_type = models.CharField(max_length=100, choices=[
        ('ORGANIC', 'Organic'),
        ('CONVENTIONAL', 'Conventional'),
        ('MIXED', 'Mixed')
    ])
    
    # Verification documents
    aadhaar_number = models.CharField(max_length=12)
    aadhaar_doc = models.FileField(upload_to='documents/aadhaar/')
    land_doc = models.FileField(upload_to='documents/land/')
    
    # Payment Information - Added after verification
    accepts_online_payment = models.BooleanField(default=False)
    upi_id = models.CharField(max_length=100, blank=True, null=True)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    account_number = models.CharField(max_length=50, blank=True, null=True)
    ifsc_code = models.CharField(max_length=20, blank=True, null=True)
    account_holder_name = models.CharField(max_length=200, blank=True, null=True)
    qr_code_image = models.ImageField(upload_to='farmer_qr_codes/', blank=True, null=True)
    accepts_cod = models.BooleanField(default=True)
    
    # Payment info verification status
    payment_info_verified = models.BooleanField(default=False)
    payment_info_verified_at = models.DateTimeField(blank=True, null=True)
    
    # Verification status
    is_verified = models.BooleanField(default=False)
    verification_status = models.CharField(max_length=20, default='PENDING', choices=[
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected')
    ])
    rejection_reason = models.TextField(blank=True, null=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='verified_farmers')
    verified_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Add these new fields
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    free_delivery_min_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    delivery_available = models.BooleanField(default=True)
    pickup_available = models.BooleanField(default=True)
    farm_pickup_address = models.TextField(blank=True)
    estimated_delivery_days = models.IntegerField(default=1)

    # Delivery settings for customers
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    free_delivery_min_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    delivery_available = models.BooleanField(default=True)
    pickup_available = models.BooleanField(default=True)
    farm_pickup_address = models.TextField(blank=True)
    estimated_delivery_days = models.IntegerField(default=1)
    
    # ✅ NEW: Delivery partner commission (percentage)
    delivery_partner_commission_percent = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=10.00,
        help_text="Percentage of delivery fee paid to delivery partner"
    )
    
    def __str__(self):
        return f"{self.farm_name} - {self.user.email}"
    
    @property
    def has_payment_info(self):
        """Check if farmer has payment information set up"""
        return bool(self.upi_id or (self.account_number and self.ifsc_code))
    
class CustomerProfile(models.Model):
    """Customer Profile Model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    default_address = models.TextField()
    address_latitude = models.FloatField(blank=True, null=True)
    address_longitude = models.FloatField(blank=True, null=True)
    phone = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, blank=True)
    
    # Statistics
    total_orders = models.IntegerField(default=0)
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Customer: {self.user.email}"

class DeliveryPartnerProfile(models.Model):
    """Delivery Partner Profile Model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='delivery_profile')
    vehicle_type = models.CharField(max_length=50, choices=[
        ('BIKE', 'Motorcycle'),
        ('SCOOTER', 'Scooter'),
        ('CAR', 'Car'),
        ('VAN', 'Van'),
        ('TRUCK', 'Truck')
    ])
    vehicle_number = models.CharField(max_length=20)
    license_number = models.CharField(max_length=50)
    license_doc = models.FileField(upload_to='documents/licenses/')
    
    # Service area
    service_area = models.TextField(help_text="Areas you serve")
    
    # Availability
    is_available = models.BooleanField(default=True)
    current_latitude = models.FloatField(blank=True, null=True)
    current_longitude = models.FloatField(blank=True, null=True)
    last_location_update = models.DateTimeField(blank=True, null=True)
    
    # Statistics
    total_deliveries = models.IntegerField(default=0)
    rating = models.FloatField(default=0)
    
    # Verification
    is_verified = models.BooleanField(default=False)
    verification_status = models.CharField(max_length=20, default='PENDING')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Delivery: {self.user.email} - {self.vehicle_type}"
    

class Notification(models.Model):
    """User Notifications Model"""
    NOTIFICATION_TYPES = [
        ('WELCOME', 'Welcome'),
        ('OTP', 'OTP Verification'),
        ('VERIFICATION', 'Verification'),
        ('PROFILE', 'Profile Update'),
        ('ORDER', 'Order Update'),
        ('PAYMENT', 'Payment'),
        ('DELIVERY', 'Delivery'),
        ('PROMO', 'Promotional'),
        ('ALERT', 'Alert'),
        ('REMINDER', 'Reminder'),
        ('ADMIN_ALERT', 'Admin Alert'),
        ('SYSTEM', 'System')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
        ]
    
    def save(self, *args, **kwargs):
        if self.is_read and not self.read_at:
            self.read_at = timezone.now()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"

class UserActivity(models.Model):
    """Track user activities for audit"""
    ACTIVITY_TYPES = [
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('PROFILE_VIEW', 'Profile View'),
        ('PROFILE_UPDATE', 'Profile Update'),
        ('ORDER_VIEW', 'Order View'),
        ('ORDER_CREATE', 'Order Create'),
        ('PAYMENT', 'Payment'),
        ('SEARCH', 'Search'),
        ('EXPORT', 'Export'),
        ('ADMIN_ACTION', 'Admin Action')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['activity_type', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type} at {self.created_at}"