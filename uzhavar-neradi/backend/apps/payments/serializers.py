from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    customer = serializers.CharField(source='order.customer.username', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'