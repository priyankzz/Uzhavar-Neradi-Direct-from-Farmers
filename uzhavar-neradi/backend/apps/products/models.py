from django.db import models
from apps.users.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    name_ta = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'farmer'})
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200)
    name_ta = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    description_ta = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    is_preorder = models.BooleanField(default=False)
    preorder_available_until = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='products/')
    delivery_options = models.JSONField(default=dict)  # e.g., {"pickup": true, "drop": true, "delivery": true}
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    approved_at = models.DateTimeField(null=True, blank=True)
    preorder_max_quantity = models.PositiveIntegerField(null=True, blank=True, help_text="Maximum quantity allowed for pre‑order. Leave blank for no limit.")
    
    

    def __str__(self):
        return self.name