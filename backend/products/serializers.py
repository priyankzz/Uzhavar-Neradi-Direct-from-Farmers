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
        fields = '__all__'
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