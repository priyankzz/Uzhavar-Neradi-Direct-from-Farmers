"""
Order views.
Copy to: backend/orders/views.py
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Order, DeliveryAssignment, DeliveryTracking
from .serializers import OrderSerializer, CreateOrderSerializer, DeliveryAssignmentSerializer, DeliveryTrackingSerializer
from users.permissions import IsCustomer, IsFarmer, IsDeliveryPartner

class OrderListView(generics.ListAPIView):
    """List orders based on user role"""
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'CUSTOMER':
            return Order.objects.filter(customer=user)
        elif user.role == 'FARMER':
            return Order.objects.filter(farmer=user)
        elif user.role == 'DELIVERY':
            return Order.objects.filter(delivery_partner=user)
        elif user.role == 'ADMIN':
            return Order.objects.all()
        return Order.objects.none()

class OrderDetailView(generics.RetrieveAPIView):
    """Get order details"""
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'CUSTOMER':
            return Order.objects.filter(customer=user)
        elif user.role == 'FARMER':
            return Order.objects.filter(farmer=user)
        elif user.role == 'DELIVERY':
            return Order.objects.filter(delivery_partner=user)
        elif user.role == 'ADMIN':
            return Order.objects.all()
        return Order.objects.none()

class CreateOrderView(generics.CreateAPIView):
    """Create new order"""
    serializer_class = CreateOrderSerializer
    permission_classes = [IsCustomer]
    
    def perform_create(self, serializer):
        serializer.save()

class UpdateOrderStatusView(APIView):
    """Update order status (Farmer only)"""
    permission_classes = [IsFarmer]
    
    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, farmer=request.user)
            new_status = request.data.get('status')
            
            if new_status in dict(Order.ORDER_STATUS).keys():
                order.status = new_status
                
                # Update timestamp based on status
                if new_status == 'CONFIRMED':
                    order.confirmed_at = timezone.now()
                elif new_status == 'ASSIGNED':
                    order.assigned_at = timezone.now()
                elif new_status == 'PICKED_UP':
                    order.picked_up_at = timezone.now()
                elif new_status == 'OUT_FOR_DELIVERY':
                    order.out_for_delivery_at = timezone.now()
                elif new_status == 'DELIVERED':
                    order.delivered_at = timezone.now()
                    order.payment_status = 'COMPLETED' if order.payment_method == 'COD' else order.payment_status
                elif new_status == 'CANCELLED':
                    order.cancelled_at = timezone.now()
                
                order.save()
                return Response(OrderSerializer(order).data)
            
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

class AssignDeliveryView(APIView):
    """Assign delivery partner to order (Farmer only)"""
    permission_classes = [IsFarmer]
    
    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, farmer=request.user)
            delivery_partner_id = request.data.get('delivery_partner_id')
            
            # Create delivery assignment
            assignment = DeliveryAssignment.objects.create(
                order=order,
                delivery_partner_id=delivery_partner_id,
                assigned_by=request.user,
                estimated_delivery_time=request.data.get('estimated_delivery_time')
            )
            
            order.delivery_partner_id = delivery_partner_id
            order.status = 'ASSIGNED'
            order.assigned_at = timezone.now()
            order.save()
            
            return Response(DeliveryAssignmentSerializer(assignment).data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

class DeliveryAssignmentsView(generics.ListAPIView):
    """Get delivery assignments (Delivery Partner)"""
    serializer_class = DeliveryAssignmentSerializer
    permission_classes = [IsDeliveryPartner]
    
    def get_queryset(self):
        return DeliveryAssignment.objects.filter(
            delivery_partner=self.request.user,
            status='PENDING'
        )

class UpdateDeliveryStatusView(APIView):
    """Update delivery status (Delivery Partner)"""
    permission_classes = [IsDeliveryPartner]
    
    def post(self, request, assignment_id):
        try:
            assignment = DeliveryAssignment.objects.get(
                id=assignment_id,
                delivery_partner=request.user
            )
            
            new_status = request.data.get('status')
            
            if new_status == 'ACCEPTED':
                assignment.status = 'ACCEPTED'
                assignment.accepted_at = timezone.now()
            elif new_status == 'REJECTED':
                assignment.status = 'REJECTED'
                assignment.rejected_at = timezone.now()
                assignment.rejection_reason = request.data.get('reason', '')
            elif new_status in ['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED']:
                # Update order status
                order = assignment.order
                order.status = new_status
                
                if new_status == 'PICKED_UP':
                    order.picked_up_at = timezone.now()
                elif new_status == 'OUT_FOR_DELIVERY':
                    order.out_for_delivery_at = timezone.now()
                elif new_status == 'DELIVERED':
                    order.delivered_at = timezone.now()
                    order.status = 'DELIVERED'
                
                order.save()
            
            assignment.save()
            
            # Create tracking update
            DeliveryTracking.objects.create(
                delivery_assignment=assignment,
                status=new_status,
                location_lat=request.data.get('latitude'),
                location_lng=request.data.get('longitude'),
                notes=request.data.get('notes', '')
            )
            
            return Response({'message': 'Status updated successfully'})
        except DeliveryAssignment.DoesNotExist:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)

class TrackOrderView(APIView):
    """Track order (Customer)"""
    permission_classes = [IsCustomer]
    
    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, customer=request.user)
            tracking_data = {
                'order': OrderSerializer(order).data,
                'status_history': []
            }
            
            if order.delivery_assignment:
                tracking = DeliveryTracking.objects.filter(
                    delivery_assignment=order.delivery_assignment
                ).order_by('timestamp')
                
                for t in tracking:
                    tracking_data['status_history'].append({
                        'status': t.status,
                        'location': {'lat': t.location_lat, 'lng': t.location_lng},
                        'notes': t.notes,
                        'timestamp': t.timestamp
                    })
            
            # Hide sensitive data if delivered
            if order.status == 'DELIVERED' and request.user.role != 'DELIVERY':
                if 'delivery_partner' in tracking_data['order']:
                    tracking_data['order']['delivery_partner'] = None
            
            return Response(tracking_data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)