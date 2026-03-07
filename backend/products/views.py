"""
Product views.
Copy to: backend/products/views.py
"""

from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Category, Product, ProductReview
from .serializers import CategorySerializer, ProductSerializer, ProductReviewSerializer
from users.permissions import IsFarmer, IsCustomer

class CategoryListView(generics.ListAPIView):
    """List all categories"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductListView(generics.ListAPIView):
    """List all products with filtering"""
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name_en', 'name_ta', 'description_en', 'description_ta']
    ordering_fields = ['price_per_unit', 'created_at', 'harvest_date']
    
    def get_queryset(self):
        print("="*50)
        print("GET QUERYSET CALLED")
        print(f"User authenticated: {self.request.user.is_authenticated}")
        print(f"User ID: {self.request.user.id if self.request.user.is_authenticated else 'Not logged in'}")
        
        queryset = Product.objects.filter(is_active=True)
        print(f"Initial queryset count: {queryset.count()}")
        
        # Filter by category
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
            print(f"Filtered by category {category_id}: {queryset.count()}")
        
        # Filter by farmer - handle 'me' special case
        farmer_param = self.request.query_params.get('farmer')
        print(f"Farmer param: {farmer_param}")
        
        if farmer_param:
            if farmer_param == 'me' and self.request.user.is_authenticated:
                print(f"Filtering by current user ID: {self.request.user.id}")
                queryset = queryset.filter(farmer_id=self.request.user.id)
            else:
                try:
                    farmer_id = int(farmer_param)
                    print(f"Filtering by farmer ID: {farmer_id}")
                    queryset = queryset.filter(farmer_id=farmer_id)
                except ValueError:
                    print(f"Invalid farmer ID: {farmer_param}")
                    pass
        
        # Filter by organic
        is_organic = self.request.query_params.get('organic')
        if is_organic and is_organic.lower() == 'true':
            queryset = queryset.filter(is_organic=True)
            print(f"Filtered by organic: {queryset.count()}")
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price_per_unit__gte=min_price)
            print(f"Filtered by min price {min_price}: {queryset.count()}")
        if max_price:
            queryset = queryset.filter(price_per_unit__lte=max_price)
            print(f"Filtered by max price {max_price}: {queryset.count()}")
        
        print(f"Final queryset count: {queryset.count()}")
        print("="*50)
        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    """Get single product details"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class ProductCreateView(generics.CreateAPIView):
    """Create new product (Farmer only)"""
    serializer_class = ProductSerializer
    permission_classes = [IsFarmer]
    
    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

class ProductUpdateView(generics.UpdateAPIView):
    """Update product (Farmer only)"""
    serializer_class = ProductSerializer
    permission_classes = [IsFarmer]
    
    def get_queryset(self):
        return Product.objects.filter(farmer=self.request.user)

class ProductDeleteView(generics.DestroyAPIView):
    """Delete product (Farmer only)"""
    permission_classes = [IsFarmer]
    
    def get_queryset(self):
        return Product.objects.filter(farmer=self.request.user)

class FarmerProductsView(generics.ListAPIView):
    """Get products for a specific farmer"""
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        farmer_id = self.kwargs['farmer_id']
        return Product.objects.filter(farmer_id=farmer_id, is_active=True)

class ProductReviewListView(generics.ListCreateAPIView):
    """List and create reviews for a product"""
    serializer_class = ProductReviewSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsCustomer()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return ProductReview.objects.filter(product_id=product_id)
    
    def perform_create(self, serializer):
        product = Product.objects.get(id=self.kwargs['product_id'])
        serializer.save(customer=self.request.user, product=product)