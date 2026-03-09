"""
Product serializers.
Copy to: backend/products/serializers.py
"""

from rest_framework import serializers
from .models import Category, Product, ProductReview
from users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    """Category Serializer"""
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    """Product Serializer"""
    farmer_name = serializers.ReadOnlyField(source='farmer.username')
    farmer_farm = serializers.ReadOnlyField(source='farmer.farmer_profile.farm_name', default='')
    category_name = serializers.ReadOnlyField(source='category.name_en')
    review_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'farmer', 'farmer_name', 'farmer_farm',
            'category', 'category_name',
            'name_en', 'name_ta', 'description_en', 'description_ta',
            'price_per_unit', 'unit', 'available_quantity', 'min_order_quantity',
            'is_organic', 'images', 'harvest_date', 'expiry_date',
            'preorder_available', 'preorder_cutoff_hours',
            'is_active', 'is_featured',
            'created_at', 'updated_at',
            'review_count', 'average_rating',
            # Delivery fields
            'delivery_available',
            'delivery_zones',
            'delivery_fee',
            'free_delivery_min_amount',
            'pickup_available',
            'farm_pickup_address',
            'estimated_delivery_days',
            'delivery_partner_required',
            'delivery_partner_commission',
             # Payment fields
            'accepts_online_payment',
            'upi_id',
            'bank_account_details',
            'qr_code_image',
            'accepts_cod',
             
            # Delivery fields
            'delivery_available',
            'pickup_available',
            'farm_pickup_address',
            'pickup_instructions',
        ]
        read_only_fields = ['created_at', 'updated_at', 'farmer']
    
    def get_review_count(self, obj):
        return obj.reviews.count()
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return sum(r.rating for r in reviews) / len(reviews)
        return 0

class ProductReviewSerializer(serializers.ModelSerializer):
    """Product Review Serializer"""
    customer_name = serializers.ReadOnlyField(source='customer.username')
    
    class Meta:
        model = ProductReview
        fields = '__all__'
        read_only_fields = ['customer', 'created_at']