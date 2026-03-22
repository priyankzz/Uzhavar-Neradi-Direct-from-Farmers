from rest_framework import serializers
from .models import DeliveryAssignment

class DeliveryAssignmentSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    customer = serializers.CharField(source='order.customer.username', read_only=True)
    delivery_partner_name = serializers.CharField(source='delivery_partner.username', read_only=True)

    class Meta:
        model = DeliveryAssignment
        fields = '__all__'