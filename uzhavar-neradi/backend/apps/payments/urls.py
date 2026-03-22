from django.urls import path
from .views import AdminPaymentList, AdminPaymentConfirmCOD

urlpatterns = [
    path('admin/payments/', AdminPaymentList.as_view(), name='admin-payment-list'),
    path('admin/payments/<int:pk>/confirm/', AdminPaymentConfirmCOD.as_view(), name='admin-payment-confirm'),
]