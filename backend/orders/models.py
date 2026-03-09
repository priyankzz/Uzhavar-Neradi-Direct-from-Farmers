"""
Order models.
Copy to: backend/orders/models.py
"""

from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product
import uuid

User = get_user_model()

class Order(models.Model):
    """Order Model"""
    ORDER_TYPES = [
        ('PREORDER', 'Preorder'),
        ('NORMAL', 'Normal Order'),
    ]
    
    ORDER_STATUS = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('ASSIGNED', 'Assigned to Delivery'),
        ('PICKED_UP', 'Picked Up'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
        ('REJECTED', 'Rejected'),
    ]
    
    PAYMENT_METHODS = [
        ('RAZORPAY', 'Razorpay'),
        ('COD', 'Cash on Delivery'),
    ]
    
    PAYMENT_STATUS = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    ]
    
    # Core fields
    order_number = models.CharField(max_length=20, unique=True, editable=False)
    customer = models.ForeignKey(User, on_delete=models.PROTECT, related_name='orders', limit_choices_to={'role': 'CUSTOMER'})
    farmer = models.ForeignKey(User, on_delete=models.PROTECT, related_name='seller_orders', limit_choices_to={'role': 'FARMER'})
    delivery_partner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='delivery_orders', limit_choices_to={'role': 'DELIVERY'})
    
    # Order details
    order_type = models.CharField(max_length=20, choices=ORDER_TYPES, default='NORMAL')
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='PENDING')
    
    # Financial
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='PENDING')
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=200, blank=True, null=True)
    
    # Delivery
    delivery_address = models.TextField()
    delivery_latitude = models.FloatField(blank=True, null=True)
    delivery_longitude = models.FloatField(blank=True, null=True)
    delivery_instructions = models.TextField(blank=True)
    scheduled_date = models.DateField(blank=True, null=True)  # For preorders
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)
    assigned_at = models.DateTimeField(blank=True, null=True)
    picked_up_at = models.DateTimeField(blank=True, null=True)
    out_for_delivery_at = models.DateTimeField(blank=True, null=True)
    delivered_at = models.DateTimeField(blank=True, null=True)
    cancelled_at = models.DateTimeField(blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.order_number} - {self.customer.username}"

class OrderItem(models.Model):
    """Individual items in an order"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.price_per_unit
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.product.name_en} x {self.quantity}"

class DeliveryAssignment(models.Model):
    """Delivery assignment tracking"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('COMPLETED', 'Completed'),
    ]
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='delivery_assignment')
    delivery_partner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments', limit_choices_to={'role': 'DELIVERY'})
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_deliveries')
    
    # ✅ Commission fields
    commission_percent = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    assigned_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(blank=True, null=True)
    rejected_at = models.DateTimeField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    
    estimated_delivery_time = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.order.order_number} - {self.delivery_partner.username}"
    
    """Delivery assignment tracking"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('COMPLETED', 'Completed'),
    ]
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='delivery_assignment')
    delivery_partner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments', limit_choices_to={'role': 'DELIVERY'})
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_deliveries')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    assigned_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(blank=True, null=True)
    rejected_at = models.DateTimeField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    
    estimated_delivery_time = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.order.order_number} - {self.delivery_partner.username}"

class DeliveryTracking(models.Model):
    """Real-time delivery tracking"""
    delivery_assignment = models.ForeignKey(DeliveryAssignment, on_delete=models.CASCADE, related_name='tracking_updates')
    status = models.CharField(max_length=50)  # Current status
    location_lat = models.FloatField(blank=True, null=True)
    location_lng = models.FloatField(blank=True, null=True)
    notes = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.delivery_assignment.order.order_number} - {self.status}"