from django.urls import path
from .views import (
    PendingUsersView, ApproveUserView,
    SalesReportView, TopProductsView,
    RejectUserView,
    SettingListCreate, SettingRetrieveUpdateDestroy, DashboardStatsView
)

urlpatterns = [
    path('pending-users/', PendingUsersView.as_view(), name='pending-users'),
    path('approve-user/<int:pk>/', ApproveUserView.as_view(), name='approve-user'),
    path('reports/sales/', SalesReportView.as_view(), name='sales-report'),
    path('reports/top-products/', TopProductsView.as_view(), name='top-products'),
    path('settings/', SettingListCreate.as_view(), name='setting-list'),
    path('settings/<int:pk>/', SettingRetrieveUpdateDestroy.as_view(), name='setting-detail'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('reject-user/<int:user_id>/', RejectUserView.as_view(), name='reject-user'),
    
    
]