"""
Product models.
Copy to: backend/products/models.py
"""

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Category(models.Model):
    """Product Category"""
    name_ta = models.CharField(max_length=100)  # Tamil name
    name_en = models.CharField(max_length=100)  # English name
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name_en

class Product(models.Model):
    """Product Model"""
    UNIT_CHOICES = [
        ('KG', 'Kilogram'),
        ('GRAM', 'Gram'),
        ('DOZEN', 'Dozen'),
        ('PIECE', 'Piece'),
        ('BAG', 'Bag'),
        ('LITRE', 'Litre'),
    ]
    
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products', limit_choices_to={'role': 'FARMER'})
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    
    # Multilingual fields
    name_ta = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200)
    description_ta = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    
    # Pricing and quantity
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES)
    available_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    
    # Product details
    harvest_date = models.DateField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    is_organic = models.BooleanField(default=False)
    images = models.JSONField(default=list)  # Store multiple image URLs
    
    # Preorder settings
    preorder_available = models.BooleanField(default=True)
    preorder_cutoff_hours = models.IntegerField(default=24, help_text="Hours before delivery cutoff")
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name_en} - {self.farmer.username}"
    
    @property
    def current_price(self):
        """Get current price (can be overridden for discounts)"""
        return self.price_per_unit
    
    @property
    def is_available(self):
        """Check if product is available for order"""
        return self.is_active and self.available_quantity > 0

class ProductReview(models.Model):
    """Product Reviews by Customers"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'CUSTOMER'})
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['product', 'customer']
    
    def __str__(self):
        return f"{self.product.name_en} - {self.rating} stars"