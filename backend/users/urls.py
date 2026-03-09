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
    
    # Farmer profiles - Using enhanced views
    path('farmer/create/', views.EnhancedCreateFarmerProfileView.as_view(), name='create-farmer'),
    path('farmer/profile/', views.EnhancedGetFarmerProfileView.as_view(), name='farmer-profile'),
    path('farmer/status/', views.FarmerProfileStatusView.as_view(), name='farmer-status'),
    
    # Customer profiles - Keep original for now
    path('customer/create/', views.CreateCustomerProfileView.as_view(), name='create-customer'),
    path('customer/profile/', views.GetCustomerProfileView.as_view(), name='customer-profile'),
    
    # Delivery profiles - Keep original for now
    path('delivery/create/', views.CreateDeliveryProfileView.as_view(), name='create-delivery'),
    path('delivery/profile/', views.GetDeliveryProfileView.as_view(), name='delivery-profile'),
    path('farmer/delivery-info/<int:farmer_id>/', views.PublicFarmerDeliveryInfoView.as_view(), name='farmer-delivery-info'),
    # Notification endpoints
    path('notifications/', views.NotificationListView.as_view(), name='notifications'),
    path('notifications/count/', views.NotificationCountView.as_view(), name='notification-count'),
    path('notifications/<int:notification_id>/read/', views.MarkNotificationReadView.as_view(), name='mark-notification-read'),
    path('notifications/read-all/', views.MarkAllNotificationsReadView.as_view(), name='mark-all-read'),
    
    # Public endpoints
    path('farmer/delivery-info/<int:farmer_id>/', views.PublicFarmerDeliveryInfoView.as_view(), name='farmer-delivery-info'),
]