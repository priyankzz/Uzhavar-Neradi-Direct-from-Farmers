"""
Admin Panel URLs.
Copy to: backend/admin_panel/urls.py
"""

from django.urls import path
from . import views

urlpatterns = [
    # Dashboard
    path('dashboard/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
    
    # User Management
    path('users/', views.UserManagementView.as_view(), name='user-management'),
    path('users/<int:user_id>/', views.UserDetailView.as_view(), name='user-detail'),
    path('users/<int:user_id>/verify/', views.VerifyUserView.as_view(), name='verify-user'),
    path('users/<int:user_id>/toggle-status/', views.ToggleUserStatusView.as_view(), name='toggle-user-status'),
    
    # Verification Requests
    path('verifications/', views.VerificationRequestsView.as_view(), name='verification-requests'),
    path('verifications/<int:verification_id>/', views.VerificationDetailView.as_view(), name='verification-detail'),
    path('verifications/<int:verification_id>/approve/', views.ApproveVerificationView.as_view(), name='approve-verification'),
    path('verifications/<int:verification_id>/reject/', views.RejectVerificationView.as_view(), name='reject-verification'),
    
    # Platform Settings
    path('settings/', views.PlatformSettingsView.as_view(), name='platform-settings'),
    path('settings/logo/', views.LogoManagementView.as_view(), name='logo-management'),
    path('settings/general/', views.GeneralSettingsView.as_view(), name='general-settings'),
    
    # Middleman Monitoring
    path('middleman/flags/', views.MiddlemanFlagsView.as_view(), name='middleman-flags'),
    path('middleman/flags/<int:flag_id>/', views.MiddlemanFlagDetailView.as_view(), name='middleman-flag-detail'),
    path('middleman/flags/<int:flag_id>/resolve/', views.ResolveMiddlemanFlagView.as_view(), name='resolve-middleman-flag'),
    path('middleman/suspicious/', views.SuspiciousActivityView.as_view(), name='suspicious-activity'),
    
    # Dispute Management
    path('disputes/', views.DisputeListView.as_view(), name='dispute-list'),
    path('disputes/<int:dispute_id>/', views.DisputeDetailView.as_view(), name='dispute-detail'),
    path('disputes/<int:dispute_id>/resolve/', views.ResolveDisputeView.as_view(), name='resolve-dispute'),
    
    # Reports & Analytics
    path('reports/users/', views.UserReportView.as_view(), name='user-report'),
    path('reports/orders/', views.OrderReportView.as_view(), name='order-report'),
    path('reports/revenue/', views.RevenueReportView.as_view(), name='revenue-report'),
    path('reports/farmers/', views.FarmerPerformanceView.as_view(), name='farmer-performance'),
    
    # Content Management
    path('categories/', views.CategoryManagementView.as_view(), name='category-management'),
    path('categories/<int:category_id>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('festivals/', views.FestivalManagementView.as_view(), name='festival-management'),
]