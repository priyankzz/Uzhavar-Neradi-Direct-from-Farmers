"""
Order serializers.
Copy to: backend/orders/serializers.py
"""

from rest_framework import serializers
from .models import Order, OrderItem, DeliveryAssignment, DeliveryTracking
from products.serializers import ProductSerializer
from users.serializers import UserSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    """Order Item Serializer"""
    product_name = serializers.ReadOnlyField(source='product.name_en')
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price_per_unit', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    """Order Serializer"""
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.ReadOnlyField(source='customer.username')
    farmer_name = serializers.ReadOnlyField(source='farmer.username')
    delivery_partner_name = serializers.ReadOnlyField(source='delivery_partner.username', default=None)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['order_number', 'created_at', 'updated_at', 'confirmed_at', 
                           'assigned_at', 'picked_up_at', 'out_for_delivery_at', 
                           'delivered_at', 'cancelled_at']

class CreateOrderSerializer(serializers.ModelSerializer):
    """Serializer for creating orders"""
    items = serializers.ListField(write_only=True)
    
    class Meta:
        model = Order
        fields = ['order_type', 'payment_method', 'delivery_address', 
                 'delivery_latitude', 'delivery_longitude', 
                 'delivery_instructions', 'scheduled_date', 'items']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        validated_data['customer'] = self.context['request'].user
        
        # Calculate totals
        subtotal = 0
        farmer = None
        
        for item in items_data:
            product = item['product']
            subtotal += product.price_per_unit * item['quantity']
            
            # Get farmer from first product
            if not farmer:
                farmer = product.farmer
        
        validated_data['subtotal'] = subtotal
        validated_data['farmer'] = farmer
        
        # ✅ FIX: Get actual delivery fee from farmer's profile
        try:
            from users.models import FarmerProfile
            farmer_profile = FarmerProfile.objects.get(user=farmer)
            delivery_fee = farmer_profile.delivery_fee
        except FarmerProfile.DoesNotExist:
            # Fallback to default if profile doesn't exist
            delivery_fee = 50.00
            print(f"⚠️ Warning: Farmer {farmer.id} has no profile, using default delivery fee")
        
        validated_data['delivery_fee'] = delivery_fee
        validated_data['tax'] = subtotal * 0.05  # 5% tax
        validated_data['total_amount'] = validated_data['subtotal'] + validated_data['delivery_fee'] + validated_data['tax']
        
        order = Order.objects.create(**validated_data)
        
        # Create order items
        for item in items_data:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price_per_unit=item['product'].price_per_unit
            )
        
        return order
    
    """Serializer for creating orders"""
    items = serializers.ListField(write_only=True)
    
    class Meta:
        model = Order
        fields = ['order_type', 'payment_method', 'delivery_address', 
                 'delivery_latitude', 'delivery_longitude', 
                 'delivery_instructions', 'scheduled_date', 'items']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        validated_data['customer'] = self.context['request'].user
        
        # Calculate totals (simplified)
        subtotal = 0
        for item in items_data:
            product = item['product']
            subtotal += product.price_per_unit * item['quantity']
        
        validated_data['subtotal'] = subtotal
        validated_data['delivery_fee'] = 50  # Fixed fee for now
        validated_data['tax'] = subtotal * 0.05  # 5% tax
        validated_data['total_amount'] = validated_data['subtotal'] + validated_data['delivery_fee'] + validated_data['tax']
        
        # Get farmer from first product (assuming all items from same farmer)
        validated_data['farmer'] = items_data[0]['product'].farmer
        
        order = Order.objects.create(**validated_data)
        
        # Create order items
        for item in items_data:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price_per_unit=item['product'].price_per_unit
            )
        
        return order

class DeliveryAssignmentSerializer(serializers.ModelSerializer):
    """Delivery Assignment Serializer"""
    order_details = OrderSerializer(source='order', read_only=True)
    delivery_partner_name = serializers.ReadOnlyField(source='delivery_partner.username')
    
    class Meta:
        model = DeliveryAssignment
        fields = '__all__'

class DeliveryTrackingSerializer(serializers.ModelSerializer):
    """Delivery Tracking Serializer"""
    class Meta:
        model = DeliveryTracking
        fields = '__all__'