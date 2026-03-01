"""
Order URLs.
Copy to: backend/orders/urls.py
"""

from django.urls import path
from . import views

urlpatterns = [
    # Orders
    path('', views.OrderListView.as_view(), name='order-list'),
    path('create/', views.CreateOrderView.as_view(), name='order-create'),
    path('<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('<int:order_id>/update-status/', views.UpdateOrderStatusView.as_view(), name='update-order-status'),
    path('<int:order_id>/assign-delivery/', views.AssignDeliveryView.as_view(), name='assign-delivery'),
    path('<int:order_id>/track/', views.TrackOrderView.as_view(), name='track-order'),
    
    # Delivery
    path('delivery/assignments/', views.DeliveryAssignmentsView.as_view(), name='delivery-assignments'),
    path('delivery/<int:assignment_id>/update-status/', views.UpdateDeliveryStatusView.as_view(), name='update-delivery-status'),
]