"""
Product URLs.
Copy to: backend/products/urls.py
"""

from django.urls import path
from . import views

urlpatterns = [
    # Categories
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    
    # Products
    path('', views.ProductListView.as_view(), name='product-list'),
    path('create/', views.ProductCreateView.as_view(), name='product-create'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('<int:pk>/update/', views.ProductUpdateView.as_view(), name='product-update'),
    path('<int:pk>/delete/', views.ProductDeleteView.as_view(), name='product-delete'),
    path('farmer/<int:farmer_id>/', views.FarmerProductsView.as_view(), name='farmer-products'),
    
    # Reviews
    path('<int:product_id>/reviews/', views.ProductReviewListView.as_view(), name='product-reviews'),
]