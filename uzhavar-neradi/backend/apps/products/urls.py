from django.urls import path
from .views import (
    AdminProductList, AdminProductDetail, AdminProductApprove,
    CategoryListCreate, CategoryRetrieveUpdateDestroy,
    FarmerProductListCreateView,FarmerProductDetailView  ,
    CustomerProductListView
)

urlpatterns = [
    path('admin/products/', AdminProductList.as_view(), name='admin-product-list'),
    path('admin/products/<int:pk>/', AdminProductDetail.as_view(), name='admin-product-detail'),
    path('admin/products/<int:pk>/approve/', AdminProductApprove.as_view(), name='admin-product-approve'),
    path('admin/categories/', CategoryListCreate.as_view(), name='category-list'),
    path('admin/categories/<int:pk>/', CategoryRetrieveUpdateDestroy.as_view(), name='category-detail'),
    path('farmer/products/', FarmerProductListCreateView.as_view(), name='farmer-product-list-create'),
    path('farmer/products/<int:pk>/', FarmerProductDetailView.as_view(), name='farmer-product-detail'),
    path('customer/products/', CustomerProductListView.as_view(), name='customer-product-list'),
]