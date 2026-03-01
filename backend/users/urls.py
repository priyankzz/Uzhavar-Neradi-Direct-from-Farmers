"""
User URLs.
Copy to: backend/users/urls.py
"""

from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('verify-otp/', views.OTPVerifyView.as_view(), name='verify-otp'),
    path('resend-otp/', views.ResendOTPView.as_view(), name='resend-otp'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    
    # Farmer profiles
    path('farmer/create/', views.CreateFarmerProfileView.as_view(), name='create-farmer'),
    path('farmer/profile/', views.GetFarmerProfileView.as_view(), name='farmer-profile'),
    
    # Customer profiles
    path('customer/create/', views.CreateCustomerProfileView.as_view(), name='create-customer'),
    path('customer/profile/', views.GetCustomerProfileView.as_view(), name='customer-profile'),
    
    # Delivery profiles
    path('delivery/create/', views.CreateDeliveryProfileView.as_view(), name='create-delivery'),
    path('delivery/profile/', views.GetDeliveryProfileView.as_view(), name='delivery-profile'),
]