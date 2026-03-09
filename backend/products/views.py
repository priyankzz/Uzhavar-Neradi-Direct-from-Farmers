"""
Product views.
Copy to: backend/products/views.py
"""

from rest_framework import viewsets, generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.db.models import Q
from .models import Category, Product, ProductReview
from .serializers import CategorySerializer, ProductSerializer, ProductReviewSerializer
from users.permissions import IsFarmer, IsCustomer

class CategoryListView(generics.ListAPIView):
    """List all categories"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product model - handles all CRUD operations
    - GET /api/products/ - List all products
    - POST /api/products/ - Create new product
    - GET /api/products/{id}/ - Retrieve product
    - PUT /api/products/{id}/ - Update product
    - PATCH /api/products/{id}/ - Partial update
    - DELETE /api/products/{id}/ - Delete product
    - GET /api/products/?farmer=me - Filter by current farmer
    """
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name_en', 'name_ta', 'description_en', 'description_ta']
    ordering_fields = ['price_per_unit', 'created_at', 'harvest_date']
    
    def get_permissions(self):
        """
        Custom permissions based on action:
        - List/Retrieve: Anyone
        - Create/Update/Delete: Farmer only
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsFarmer()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        """Filter products based on query parameters"""
        print("="*50)
        print("GET QUERYSET CALLED")
        print(f"User authenticated: {self.request.user.is_authenticated}")
        print(f"User ID: {self.request.user.id if self.request.user.is_authenticated else 'Not logged in'}")
        
        # Base queryset - only active products for non-owners
        if self.action == 'list' and self.request.query_params.get('farmer') != 'me':
            queryset = Product.objects.filter(is_active=True)
        else:
            # For owner views or specific queries, include inactive
            queryset = Product.objects.all()
            
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
    
    def perform_create(self, serializer):
        """Create new product - always active"""
        print("🔥 Creating new product with is_active=True")
        product = serializer.save(farmer=self.request.user, is_active=True)
        print(f"✅ Product created: ID={product.id}, Name={product.name_en}, Active={product.is_active}")
        return product
    
    def perform_update(self, serializer):
        """Update product - preserve all fields"""
        print(f"🔄 Updating product ID: {self.get_object().id}")
        product = serializer.save()
        print(f"✅ Product updated: {product.name_en}, Active: {product.is_active}")
        return product
    
    def perform_destroy(self, instance):
        """Delete product"""
        print(f"🗑️ Deleting product: {instance.name_en} (ID: {instance.id})")
        instance.delete()
        print("✅ Product deleted successfully")
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def my_products(self, request):
        """Get products for the current farmer (alias for ?farmer=me)"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        queryset = Product.objects.filter(farmer=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ProductDetailView(generics.RetrieveAPIView):
    """Legacy support: Get single product details"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class ProductCreateView(generics.CreateAPIView):
    """Legacy support: Create new product (Farmer only)"""
    serializer_class = ProductSerializer
    permission_classes = [IsFarmer]
    
    def perform_create(self, serializer):
        print("🔥 Creating new product with is_active=True")
        product = serializer.save(farmer=self.request.user, is_active=True)
        print(f"✅ Product created: ID={product.id}, Name={product.name_en}, Active={product.is_active}")
        return product

class ProductUpdateView(generics.UpdateAPIView):
    """Legacy support: Update product (Farmer only)"""
    serializer_class = ProductSerializer
    permission_classes = [IsFarmer]
    
    def get_queryset(self):
        return Product.objects.filter(farmer=self.request.user)
    
    def perform_update(self, serializer):
        print(f"🔄 Updating product ID: {self.get_object().id}")
        product = serializer.save()
        print(f"✅ Product updated: {product.name_en}, Active: {product.is_active}")

class ProductDeleteView(generics.DestroyAPIView):
    """Legacy support: Delete product (Farmer only)"""
    permission_classes = [IsFarmer]
    
    def get_queryset(self):
        return Product.objects.filter(farmer=self.request.user)
    
    def perform_destroy(self, instance):
        print(f"🗑️ Deleting product: {instance.name_en} (ID: {instance.id})")
        instance.delete()
        print("✅ Product deleted successfully")

class FarmerProductsView(generics.ListAPIView):
    """Get products for a specific farmer"""
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        farmer_id = self.kwargs['farmer_id']
        print(f"📋 Fetching products for farmer ID: {farmer_id}")
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
        print(f"⭐ New review for product: {product.name_en}")
        serializer.save(customer=self.request.user, product=product)