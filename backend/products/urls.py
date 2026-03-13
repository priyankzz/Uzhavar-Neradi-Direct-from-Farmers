"""
Product URLs.
Copy to: backend/products/urls.py
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')

urlpatterns = [
    # ViewSet routes (includes list, create, retrieve, update, delete)
    path('', include(router.urls)),
    
    # Category endpoints
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    
    # Farmer-specific products
    path('farmer/<int:farmer_id>/', views.FarmerProductsView.as_view(), name='farmer-products'),
    
    # Product reviews
    path('<int:product_id>/reviews/', views.ProductReviewListView.as_view(), name='product-reviews'),
    
    # Legacy endpoints (kept for backward compatibility)
    path('create/', views.ProductCreateView.as_view(), name='product-create'),
    path('<int:pk>/update/', views.ProductUpdateView.as_view(), name='product-update'),
    path('<int:pk>/delete/', views.ProductDeleteView.as_view(), name='product-delete'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
]