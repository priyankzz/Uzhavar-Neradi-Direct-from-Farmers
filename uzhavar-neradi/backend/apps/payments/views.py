from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer

class AdminPaymentList(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all().order_by('-payment_date')

class AdminPaymentConfirmCOD(generics.UpdateAPIView):
    permission_classes = [permissions.IsAdminUser]
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def patch(self, request, *args, **kwargs):
        payment = self.get_object()
        if payment.method == 'cod' and payment.status == 'pending':
            payment.status = 'success'
            payment.save()
            # Also update order's payment_status
            order = payment.order
            order.payment_status = 'paid'
            order.save()
            return Response({'status': 'payment confirmed'})
        return Response({'error': 'Cannot confirm this payment'}, status=status.HTTP_400_BAD_REQUEST)