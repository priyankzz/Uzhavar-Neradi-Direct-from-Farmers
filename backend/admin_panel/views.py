"""
Admin Panel Views.
Copy to: backend/admin_panel/views.py
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta, datetime
import json

from products.models import Category
from analytics.models import FestivalCalendar
from .models import Announcement

from .models import (
    PlatformSettings, PlatformLogo, MiddlemanFlag,
    Dispute, DisputeMessage, AuditLog, Announcement
)
from .serializers import (
    PlatformSettingsSerializer, PlatformLogoSerializer,
    FarmerVerificationSerializer, MiddlemanFlagSerializer,
    DisputeSerializer, DisputeMessageSerializer,
    AuditLogSerializer, AnnouncementSerializer,
    AdminDashboardSerializer
)
from users.models import FarmerProfile, CustomerProfile, DeliveryPartnerProfile
from users.permissions import IsAdmin
from orders.models import Order
from products.models import Product, Category

User = get_user_model()

class AdminDashboardView(APIView):
    """Admin Dashboard Overview - Fixed permanent user counts"""
    permission_classes = [IsAdmin]

    def get(self, request):
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)

        # -----------------------------
        # Basic stats - permanent fix
        # -----------------------------
        total_users = User.objects.filter(is_verified=True).count()
        total_farmers = User.objects.filter(role='FARMER', is_verified=True).count()
        total_customers = User.objects.filter(role='CUSTOMER', is_verified=True).count()
        total_delivery = User.objects.filter(role='DELIVERY', is_verified=True).count()

        pending_verifications = FarmerProfile.objects.filter(verification_status='PENDING').count()
        active_disputes = Dispute.objects.filter(status__in=['OPEN', 'IN_PROGRESS']).count()
        pending_flags = MiddlemanFlag.objects.filter(status='PENDING').count()

        # -----------------------------
        # Today's orders
        # -----------------------------
        today_orders = Order.objects.filter(created_at__date=today).count()
        today_revenue = Order.objects.filter(
            created_at__date=today,
            status='DELIVERED'
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0

        # -----------------------------
        # Monthly revenue
        # -----------------------------
        month_start = today.replace(day=1)
        total_revenue_month = Order.objects.filter(
            created_at__date__gte=month_start,
            status='DELIVERED'
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0

        # -----------------------------
        # User growth (last 30 days)
        # -----------------------------
        user_growth = []
        for i in range(30):
            date = thirty_days_ago + timedelta(days=i)
            count = User.objects.filter(date_joined__date=date).count()
            user_growth.append({
                'date': date,
                'count': count
            })

        # -----------------------------
        # Recent activities
        # -----------------------------
        recent_activities = []

        # Recent registrations
        recent_users = User.objects.order_by('-date_joined')[:5]
        for user in recent_users:
            recent_activities.append({
                'type': 'new_user',
                'description': f"New {user.get_role_display()} registered: {user.username}",
                'timestamp': user.date_joined,
                'user': user.username
            })

        # Recent orders
        recent_orders = Order.objects.order_by('-created_at')[:5]
        for order in recent_orders:
            recent_activities.append({
                'type': 'new_order',
                'description': f"New order #{order.order_number} - ₹{order.total_amount}",
                'timestamp': order.created_at,
                'order_id': order.id
            })

        # Sort recent activities
        recent_activities.sort(key=lambda x: x['timestamp'], reverse=True)
        recent_activities = recent_activities[:10]

        # -----------------------------
        # Dashboard data
        # -----------------------------
        dashboard_data = {
            'totalUsers': total_users,              # camelCase for frontend
            'totalFarmers': total_farmers,
            'totalCustomers': total_customers,
            'totalDelivery': total_delivery,
            'pendingVerifications': pending_verifications,
            'activeDisputes': active_disputes,
            'pendingFlags': pending_flags,
            'todayOrders': today_orders,
            'todayRevenue': today_revenue,
            'totalRevenueMonth': total_revenue_month,
            'userGrowth': user_growth,
            'recentActivities': recent_activities
        }

        serializer = AdminDashboardSerializer(dashboard_data)
        return Response(serializer.data)


class UserManagementView(APIView):
    """List all users with filters"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        role = request.query_params.get('role')
        verified = request.query_params.get('verified')
        search = request.query_params.get('search')
        
        users = User.objects.filter(is_verified=True)
        
        if role:
            users = users.filter(role=role)
        if verified:
            users = users.filter(is_verified=verified.lower() == 'true')
        if search:
            users = users.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search)
            )
        
        # Add profile data
        user_data = []
        for user in users[:50]:  # Limit to 50 for performance
            data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'is_verified': user.is_verified,
                'is_active': user.is_active,
                'date_joined': user.date_joined,
                'last_login': user.last_login,
            }
            
            # Add role-specific data
            if user.role == 'FARMER' and hasattr(user, 'farmer_profile'):
                data['farm_name'] = user.farmer_profile.farm_name
                data['verification_status'] = user.farmer_profile.verification_status
            elif user.role == 'CUSTOMER' and hasattr(user, 'customer_profile'):
                data['total_orders'] = user.customer_profile.total_orders
            elif user.role == 'DELIVERY' and hasattr(user, 'delivery_profile'):
                data['is_available'] = user.delivery_profile.is_available
                data['total_deliveries'] = user.delivery_profile.total_deliveries
            
            user_data.append(data)
        
        return Response(user_data)


class UserDetailView(APIView):
    """Get detailed user information"""
    permission_classes = [IsAdmin]
    
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            
            data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'phone': user.phone,
                'is_verified': user.is_verified,
                'is_active': user.is_active,
                'date_joined': user.date_joined,
                'last_login': user.last_login,
                'preferred_language': user.preferred_language,
            }
            
            # Get profile data
            if user.role == 'FARMER' and hasattr(user, 'farmer_profile'):
                profile = user.farmer_profile
                data['profile'] = {
                    'farm_name': profile.farm_name,
                    'farm_address': profile.farm_address,
                    'farm_size': profile.farm_size,
                    'farming_type': profile.farming_type,
                    'verification_status': profile.verification_status,
                    'documents': {
                        'aadhaar': profile.aadhaar_doc.url if profile.aadhaar_doc else None,
                        'land': profile.land_doc.url if profile.land_doc else None,
                    }
                }
                
                # Get farmer stats
                data['stats'] = {
                    'total_products': Product.objects.filter(farmer=user).count(),
                    'total_orders': Order.objects.filter(farmer=user).count(),
                    'total_revenue': Order.objects.filter(
                        farmer=user, 
                        status='DELIVERED'
                    ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
                }
                
            elif user.role == 'CUSTOMER' and hasattr(user, 'customer_profile'):
                profile = user.customer_profile
                data['profile'] = {
                    'default_address': profile.default_address,
                    'phone': profile.phone,
                    'alternate_phone': profile.alternate_phone,
                }
                
                # Get customer stats
                data['stats'] = {
                    'total_orders': Order.objects.filter(customer=user).count(),
                    'total_spent': Order.objects.filter(
                        customer=user,
                        status='DELIVERED'
                    ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
                }
                
            elif user.role == 'DELIVERY' and hasattr(user, 'delivery_profile'):
                profile = user.delivery_profile
                data['profile'] = {
                    'vehicle_type': profile.vehicle_type,
                    'vehicle_number': profile.vehicle_number,
                    'service_area': profile.service_area,
                    'is_available': profile.is_available,
                    'total_deliveries': profile.total_deliveries,
                    'rating': profile.rating,
                }
            
            return Response(data)
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class VerifyUserView(APIView):
    """Verify or reject user"""
    permission_classes = [IsAdmin]
    
    def post(self, request, user_id):
        try:
            action = request.data.get('action')
            rejection_reason = request.data.get('rejection_reason', '')
            
            if action not in ['approve', 'reject']:
                return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.get(id=user_id)
            
            if user.role == 'FARMER' and hasattr(user, 'farmer_profile'):
                profile = user.farmer_profile
                
                if action == 'approve':
                    profile.verification_status = 'APPROVED'
                    profile.is_verified = True
                    profile.verified_by = request.user
                    profile.verified_at = timezone.now()
                    profile.rejection_reason = ''
                    
                    # Log action
                    AuditLog.objects.create(
                        user=request.user,
                        action_type='VERIFY',
                        content_type='FarmerProfile',
                        object_id=profile.id,
                        object_repr=profile.farm_name,
                        changes={'action': 'approved'}
                    )
                    
                else:  # reject
                    profile.verification_status = 'REJECTED'
                    profile.is_verified = False
                    profile.rejection_reason = rejection_reason
                    
                    AuditLog.objects.create(
                        user=request.user,
                        action_type='REJECT',
                        content_type='FarmerProfile',
                        object_id=profile.id,
                        object_repr=profile.farm_name,
                        changes={'reason': rejection_reason}
                    )
                
                profile.save()
                
                return Response({'message': f'User {action}d successfully'})
            
            return Response({'error': 'User is not a farmer'}, status=status.HTTP_400_BAD_REQUEST)
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class ToggleUserStatusView(APIView):
    """Activate/Deactivate user"""
    permission_classes = [IsAdmin]
    
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.is_active = not user.is_active
            user.save()
            
            AuditLog.objects.create(
                user=request.user,
                action_type='BAN' if not user.is_active else 'UNBAN',
                content_type='User',
                object_id=user.id,
                object_repr=user.username,
                changes={'is_active': user.is_active}
            )
            
            status_text = 'activated' if user.is_active else 'deactivated'
            return Response({'message': f'User {status_text} successfully'})
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class VerificationRequestsView(APIView):
    """List all pending verification requests"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        pending_users = User.objects.filter(is_verified=False)
        
        data = []
        for farmer in pending_farmers:
            data.append({
                'id': farmer.id,
                'user_id': farmer.user.id,
                'username': farmer.user.username,
                'email': farmer.user.email,
                'farm_name': farmer.farm_name,
                'farm_address': farmer.farm_address,
                'farm_size': farmer.farm_size,
                'farming_type': farmer.farming_type,
                'submitted_at': farmer.created_at,
                'documents': [
                    {'type': 'Aadhaar', 'url': farmer.aadhaar_doc.url if farmer.aadhaar_doc else None},
                    {'type': 'Land Proof', 'url': farmer.land_doc.url if farmer.land_doc else None}
                ]
            })
        
        return Response(data)


class VerificationDetailView(APIView):
    """Get detailed verification request"""
    permission_classes = [IsAdmin]
    
    def get(self, request, verification_id):
        try:
            farmer = FarmerProfile.objects.select_related('user').get(id=verification_id)
            
            data = {
                'id': farmer.id,
                'user_id': farmer.user.id,
                'username': farmer.user.username,
                'email': farmer.user.email,
                'phone': farmer.user.phone,
                'farm_name': farmer.farm_name,
                'farm_address': farmer.farm_address,
                'farm_size': farmer.farm_size,
                'farming_type': farmer.farming_type,
                'aadhaar_number': farmer.aadhaar_number,
                'documents': {
                    'aadhaar': farmer.aadhaar_doc.url if farmer.aadhaar_doc else None,
                    'land': farmer.land_doc.url if farmer.land_doc else None,
                },
                'verification_status': farmer.verification_status,
                'submitted_at': farmer.created_at,
                'rejection_reason': farmer.rejection_reason
            }
            
            return Response(data)
            
        except FarmerProfile.DoesNotExist:
            return Response({'error': 'Verification request not found'}, status=status.HTTP_404_NOT_FOUND)


class ApproveVerificationView(APIView):
    """Approve verification request"""
    permission_classes = [IsAdmin]
    
    def post(self, request, verification_id):
        try:
            farmer = FarmerProfile.objects.get(id=verification_id)
            
            farmer.verification_status = 'APPROVED'
            farmer.is_verified = True
            farmer.verified_by = request.user
            farmer.verified_at = timezone.now()
            farmer.rejection_reason = ''
            farmer.save()
            
            # Also update user verification status
            user = farmer.user
            user.is_verified = True
            user.save()
            
            # Log action
            AuditLog.objects.create(
                user=request.user,
                action_type='VERIFY',
                content_type='FarmerProfile',
                object_id=farmer.id,
                object_repr=farmer.farm_name,
                changes={'action': 'approved'}
            )
            
            return Response({'message': 'Verification approved successfully'})
            
        except FarmerProfile.DoesNotExist:
            return Response({'error': 'Verification request not found'}, status=status.HTTP_404_NOT_FOUND)


class RejectVerificationView(APIView):
    """Reject verification request"""
    permission_classes = [IsAdmin]
    
    def post(self, request, verification_id):
        try:
            reason = request.data.get('reason', '')
            
            farmer = FarmerProfile.objects.get(id=verification_id)
            
            farmer.verification_status = 'REJECTED'
            farmer.is_verified = False
            farmer.rejection_reason = reason
            farmer.save()
            
            # Log action
            AuditLog.objects.create(
                user=request.user,
                action_type='REJECT',
                content_type='FarmerProfile',
                object_id=farmer.id,
                object_repr=farmer.farm_name,
                changes={'reason': reason}
            )
            
            return Response({'message': 'Verification rejected'})
            
        except FarmerProfile.DoesNotExist:
            return Response({'error': 'Verification request not found'}, status=status.HTTP_404_NOT_FOUND)


class LogoManagementView(APIView):
    """Upload/Update platform logo"""
    permission_classes = [IsAdmin]
    
    def post(self, request):
        # Deactivate current logo
        PlatformLogo.objects.filter(is_active=True).update(is_active=False)
        
        # Create new logo
        serializer = PlatformLogoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(uploaded_by=request.user, is_active=True)
            
            AuditLog.objects.create(
                user=request.user,
                action_type='UPDATE',
                content_type='PlatformLogo',
                object_repr='Platform Logo',
                changes={'action': 'uploaded new logo'}
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        logo = PlatformLogo.objects.filter(is_active=True).first()
        if logo:
            serializer = PlatformLogoSerializer(logo)
            return Response(serializer.data)
        return Response({'message': 'No logo uploaded'})


class PlatformSettingsView(APIView):
    """Manage platform settings"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        settings = PlatformSettings.objects.all()
        serializer = PlatformSettingsSerializer(settings, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        key = request.data.get('key')
        value = request.data.get('value')
        
        setting, created = PlatformSettings.objects.update_or_create(
            key=key,
            defaults={
                'value': value,
                'updated_by': request.user
            }
        )
        
        serializer = PlatformSettingsSerializer(setting)
        return Response(serializer.data)


class GeneralSettingsView(APIView):
    """Get/Update general settings"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        # Get or create default settings
        defaults = {
            'site_name': 'Uzhavar Neradi',
            'support_email': 'support@uzhavarneradi.com',
            'support_phone': '+91 1234567890',
            'delivery_fee': '50',
            'tax_rate': '5',
            'min_order_amount': '100',
            'max_preorder_days': '30',
            'enable_cod': 'true',
            'enable_razorpay': 'true',
            'maintenance_mode': 'false',
        }
        
        settings = {}
        for key, default_value in defaults.items():
            try:
                setting = PlatformSettings.objects.get(key=key)
                settings[key] = setting.value
            except PlatformSettings.DoesNotExist:
                settings[key] = default_value
        
        return Response(settings)
    
    def post(self, request):
        for key, value in request.data.items():
            PlatformSettings.objects.update_or_create(
                key=key,
                defaults={
                    'value': value,
                    'updated_by': request.user
                }
            )
        
        AuditLog.objects.create(
            user=request.user,
            action_type='UPDATE',
            content_type='PlatformSettings',
            object_repr='General Settings',
            changes=request.data
        )
        
        return Response({'message': 'Settings updated successfully'})


class MiddlemanFlagsView(APIView):
    """List all middleman flags"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        status_filter = request.query_params.get('status', 'PENDING')
        
        flags = MiddlemanFlag.objects.filter(status=status_filter).order_by('-created_at')
        serializer = MiddlemanFlagSerializer(flags, many=True)
        return Response(serializer.data)


class MiddlemanFlagDetailView(APIView):
    """Get detailed flag information"""
    permission_classes = [IsAdmin]
    
    def get(self, request, flag_id):
        try:
            flag = MiddlemanFlag.objects.select_related('user', 'investigated_by').get(id=flag_id)
            serializer = MiddlemanFlagSerializer(flag)
            
            # Add related orders
            data = serializer.data
            if flag.related_orders.exists():
                orders = []
                for order in flag.related_orders.all()[:10]:
                    orders.append({
                        'id': order.id,
                        'order_number': order.order_number,
                        'total_amount': order.total_amount,
                        'created_at': order.created_at
                    })
                data['related_orders'] = orders
            
            return Response(data)
            
        except MiddlemanFlag.DoesNotExist:
            return Response({'error': 'Flag not found'}, status=status.HTTP_404_NOT_FOUND)


class ResolveMiddlemanFlagView(APIView):
    """Resolve a middleman flag"""
    permission_classes = [IsAdmin]
    
    def post(self, request, flag_id):
        try:
            flag = MiddlemanFlag.objects.get(id=flag_id)
            
            action = request.data.get('action')
            notes = request.data.get('notes', '')
            
            if action == 'confirm':
                flag.status = 'CONFIRMED'
                # Optionally take action against user
                user = flag.user
                user.is_active = False
                user.save()
            elif action == 'false_alarm':
                flag.status = 'FALSE_ALARM'
            else:
                flag.status = 'RESOLVED'
            
            flag.investigated_by = request.user
            flag.investigated_at = timezone.now()
            flag.resolution_notes = notes
            flag.save()
            
            AuditLog.objects.create(
                user=request.user,
                action_type='UPDATE',
                content_type='MiddlemanFlag',
                object_id=flag.id,
                changes={'action': action, 'notes': notes}
            )
            
            return Response({'message': 'Flag resolved successfully'})
            
        except MiddlemanFlag.DoesNotExist:
            return Response({'error': 'Flag not found'}, status=status.HTTP_404_NOT_FOUND)


class SuspiciousActivityView(APIView):
    """View suspicious activities"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        # Get users with multiple flags
        users_with_flags = User.objects.annotate(
            flag_count=Count('middleman_flags')
        ).filter(flag_count__gt=0).order_by('-flag_count')[:20]
        
        data = []
        for user in users_with_flags:
            flags = MiddlemanFlag.objects.filter(user=user).order_by('-created_at')
            data.append({
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'flag_count': flags.count(),
                'recent_flags': [
                    {
                        'type': flag.get_flag_type_display(),
                        'status': flag.status,
                        'created_at': flag.created_at
                    }
                    for flag in flags[:3]
                ]
            })
        
        return Response(data)


class DisputeListView(APIView):
    """List all disputes"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        status_filter = request.query_params.get('status', 'OPEN')
        
        disputes = Dispute.objects.filter(status=status_filter).order_by('-created_at')
        serializer = DisputeSerializer(disputes, many=True)
        return Response(serializer.data)


class DisputeDetailView(APIView):
    """Get dispute details with messages"""
    permission_classes = [IsAdmin]
    
    def get(self, request, dispute_id):
        try:
            dispute = Dispute.objects.get(id=dispute_id)
            messages = DisputeMessage.objects.filter(dispute=dispute).order_by('created_at')
            
            data = DisputeSerializer(dispute).data
            data['messages'] = DisputeMessageSerializer(messages, many=True).data
            
            return Response(data)
            
        except Dispute.DoesNotExist:
            return Response({'error': 'Dispute not found'}, status=status.HTTP_404_NOT_FOUND)


class ResolveDisputeView(APIView):
    """Resolve a dispute"""
    permission_classes = [IsAdmin]
    
    def post(self, request, dispute_id):
        try:
            dispute = Dispute.objects.get(id=dispute_id)
            
            resolution = request.data.get('resolution')
            action = request.data.get('action')  # refund, warning, etc.
            
            dispute.status = 'RESOLVED'
            dispute.resolution = resolution
            dispute.resolved_by = request.user
            dispute.resolved_at = timezone.now()
            dispute.save()
            
            # Add resolution message
            DisputeMessage.objects.create(
                dispute=dispute,
                sender=request.user,
                message=f"Dispute resolved. Resolution: {resolution}. Action taken: {action}",
                is_staff_only=False
            )
            
            AuditLog.objects.create(
                user=request.user,
                action_type='UPDATE',
                content_type='Dispute',
                object_id=dispute.id,
                changes={'action': action, 'resolution': resolution}
            )
            
            return Response({'message': 'Dispute resolved successfully'})
            
        except Dispute.DoesNotExist:
            return Response({'error': 'Dispute not found'}, status=status.HTTP_404_NOT_FOUND)


class UserReportView(APIView):
    """Generate user report"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        period = request.query_params.get('period', 'month')
        
        today = timezone.now().date()
        
        if period == 'week':
            start_date = today - timedelta(days=7)
        elif period == 'month':
            start_date = today - timedelta(days=30)
        elif period == 'year':
            start_date = today - timedelta(days=365)
        else:
            start_date = today - timedelta(days=30)
        
        # User registration by role
        farmers = User.objects.filter(role='FARMER', date_joined__date__gte=start_date).count()
        customers = User.objects.filter(role='CUSTOMER', date_joined__date__gte=start_date).count()
        delivery = User.objects.filter(role='DELIVERY', date_joined__date__gte=start_date).count()
        
        # Verification stats
        verified_farmers = FarmerProfile.objects.filter(
            verification_status='APPROVED',
            verified_at__date__gte=start_date
        ).count()
        
        report = {
            'period': period,
            'start_date': start_date,
            'end_date': today,
            'new_users': {
                'total': farmers + customers + delivery,
                'farmers': farmers,
                'customers': customers,
                'delivery': delivery
            },
            'verifications': {
                'approved': verified_farmers,
                'pending': FarmerProfile.objects.filter(verification_status='PENDING').count()
            },
            'daily_breakdown': []
        }
        
        # Daily breakdown
        current = start_date
        while current <= today:
            daily_users = User.objects.filter(date_joined__date=current).count()
            report['daily_breakdown'].append({
                'date': current,
                'new_users': daily_users
            })
            current += timedelta(days=1)
        
        return Response(report)


class OrderReportView(APIView):
    """Generate order report"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        period = request.query_params.get('period', 'month')
        
        today = timezone.now().date()
        
        if period == 'week':
            start_date = today - timedelta(days=7)
        elif period == 'month':
            start_date = today - timedelta(days=30)
        elif period == 'year':
            start_date = today - timedelta(days=365)
        else:
            start_date = today - timedelta(days=30)
        
        orders = Order.objects.filter(created_at__date__gte=start_date)
        
        report = {
            'period': period,
            'start_date': start_date,
            'end_date': today,
            'total_orders': orders.count(),
            'completed_orders': orders.filter(status='DELIVERED').count(),
            'cancelled_orders': orders.filter(status='CANCELLED').count(),
            'preorders': orders.filter(order_type='PREORDER').count(),
            'normal_orders': orders.filter(order_type='NORMAL').count(),
            'daily_breakdown': []
        }
        
        # Daily breakdown
        current = start_date
        while current <= today:
            daily_orders = orders.filter(created_at__date=current)
            report['daily_breakdown'].append({
                'date': current,
                'orders': daily_orders.count(),
                'revenue': float(daily_orders.filter(status='DELIVERED').aggregate(Sum('total_amount'))['total_amount__sum'] or 0)
            })
            current += timedelta(days=1)
        
        return Response(report)


class RevenueReportView(APIView):
    """Generate revenue report"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        period = request.query_params.get('period', 'month')
        
        today = timezone.now().date()
        
        if period == 'week':
            start_date = today - timedelta(days=7)
        elif period == 'month':
            start_date = today - timedelta(days=30)
        elif period == 'year':
            start_date = today - timedelta(days=365)
        else:
            start_date = today - timedelta(days=30)
        
        delivered_orders = Order.objects.filter(
            status='DELIVERED',
            delivered_at__date__gte=start_date
        )
        
        total_revenue = delivered_orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Revenue by payment method
        razorpay_revenue = delivered_orders.filter(payment_method='RAZORPAY').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        cod_revenue = delivered_orders.filter(payment_method='COD').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        report = {
            'period': period,
            'start_date': start_date,
            'end_date': today,
            'total_revenue': total_revenue,
            'by_payment': {
                'razorpay': razorpay_revenue,
                'cod': cod_revenue
            },
            'daily_breakdown': []
        }
        
        # Daily breakdown
        current = start_date
        while current <= today:
            daily_revenue = delivered_orders.filter(delivered_at__date=current).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
            report['daily_breakdown'].append({
                'date': current,
                'revenue': float(daily_revenue)
            })
            current += timedelta(days=1)
        
        return Response(report)


class FarmerPerformanceView(APIView):
    """View farmer performance metrics"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        # Top farmers by revenue
        farmers = User.objects.filter(role='FARMER', is_active=True)
        
        farmer_data = []
        for farmer in farmers[:20]:  # Top 20
            delivered_orders = Order.objects.filter(
                farmer=farmer,
                status='DELIVERED'
            )
            
            total_revenue = delivered_orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
            total_orders = delivered_orders.count()
            total_products = Product.objects.filter(farmer=farmer, is_active=True).count()
            
            farmer_data.append({
                'id': farmer.id,
                'name': farmer.username,
                'farm_name': farmer.farmer_profile.farm_name if hasattr(farmer, 'farmer_profile') else 'N/A',
                'total_revenue': total_revenue,
                'total_orders': total_orders,
                'total_products': total_products,
                'avg_order_value': total_revenue / total_orders if total_orders > 0 else 0
            })
        
        # Sort by revenue
        farmer_data.sort(key=lambda x: x['total_revenue'], reverse=True)
        
        return Response(farmer_data)


class CategoryManagementView(APIView):
    """Manage product categories"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        categories = Category.objects.all()
        data = []
        for category in categories:
            data.append({
                'id': category.id,
                'name_en': category.name_en,
                'name_ta': category.name_ta,
                'product_count': Product.objects.filter(category=category).count(),
                'is_active': category.is_active
            })
        return Response(data)
    
    def post(self, request):
        # Create new category
        from products.serializers import CategorySerializer
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            AuditLog.objects.create(
                user=request.user,
                action_type='CREATE',
                content_type='Category',
                object_repr=serializer.data['name_en'],
                changes=request.data
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailView(APIView):
    """Get/Update category details"""
    permission_classes = [IsAdmin]
    
    def get(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
            from products.serializers import CategorySerializer
            serializer = CategorySerializer(category)
            return Response(serializer.data)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
            from products.serializers import CategorySerializer
            serializer = CategorySerializer(category, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                
                AuditLog.objects.create(
                    user=request.user,
                    action_type='UPDATE',
                    content_type='Category',
                    object_id=category.id,
                    object_repr=category.name_en,
                    changes=request.data
                )
                
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)


class FestivalManagementView(APIView):
    """Manage festival calendar"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        from analytics.models import FestivalCalendar
        from analytics.serializers import FestivalCalendarSerializer
        
        year = request.query_params.get('year', timezone.now().year)
        festivals = FestivalCalendar.objects.filter(date__year=year).order_by('date')
        serializer = FestivalCalendarSerializer(festivals, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        from analytics.models import FestivalCalendar
        from analytics.serializers import FestivalCalendarSerializer
        
        serializer = FestivalCalendarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            AuditLog.objects.create(
                user=request.user,
                action_type='CREATE',
                content_type='FestivalCalendar',
                object_repr=serializer.data['name'],
                changes=request.data
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AnnouncementView(APIView):
    """Manage platform announcements"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        announcements = Announcement.objects.all().order_by('-publish_from')
        serializer = AnnouncementSerializer(announcements, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = AnnouncementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuditLogView(APIView):
    """View audit logs"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 100))
        action_type = request.query_params.get('action_type')
        
        logs = AuditLog.objects.all().order_by('-timestamp')
        
        if action_type:
            logs = logs.filter(action_type=action_type)
        
        serializer = AuditLogSerializer(logs[:limit], many=True)
        return Response(serializer.data)
    
class CategoryManagementView(APIView):
    """Manage product categories"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        categories = Category.objects.all()
        data = []
        for category in categories:
            data.append({
                'id': category.id,
                'name_en': category.name_en,
                'name_ta': category.name_ta,
                'description': category.description,
                'icon': category.icon.url if category.icon else None,
                'product_count': Product.objects.filter(category=category).count(),
                'is_active': category.is_active
            })
        return Response(data)
    
    def post(self, request):
        from products.serializers import CategorySerializer
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            AuditLog.objects.create(
                user=request.user,
                action_type='CREATE',
                content_type='Category',
                object_repr=serializer.data['name_en'],
                changes=request.data
            )
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class CategoryDetailView(APIView):
    """Get/Update/Delete category"""
    permission_classes = [IsAdmin]
    
    def get(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
            from products.serializers import CategorySerializer
            serializer = CategorySerializer(category)
            return Response(serializer.data)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=404)
    
    def put(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
            from products.serializers import CategorySerializer
            serializer = CategorySerializer(category, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                AuditLog.objects.create(
                    user=request.user,
                    action_type='UPDATE',
                    content_type='Category',
                    object_id=category.id,
                    object_repr=category.name_en,
                    changes=request.data
                )
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=404)
    
    def delete(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
            category.delete()
            AuditLog.objects.create(
                user=request.user,
                action_type='DELETE',
                content_type='Category',
                object_repr=category.name_en
            )
            return Response({'message': 'Category deleted'}, status=204)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=404)

class FestivalManagementView(APIView):
    """Manage festivals"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        from analytics.models import FestivalCalendar
        from analytics.serializers import FestivalCalendarSerializer
        
        year = request.query_params.get('year', timezone.now().year)
        festivals = FestivalCalendar.objects.filter(date__year=year).order_by('date')
        serializer = FestivalCalendarSerializer(festivals, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        from analytics.models import FestivalCalendar
        from analytics.serializers import FestivalCalendarSerializer
        
        serializer = FestivalCalendarSerializer(data=request.data)
        if serializer.is_valid():
            festival = serializer.save()
            
            # Add affected categories
            if 'affected_categories' in request.data:
                festival.affected_categories.set(request.data['affected_categories'])
            
            AuditLog.objects.create(
                user=request.user,
                action_type='CREATE',
                content_type='FestivalCalendar',
                object_repr=serializer.data['name'],
                changes=request.data
            )
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class FestivalDetailView(APIView):
    """Get/Update/Delete festival"""
    permission_classes = [IsAdmin]
    
    def get(self, request, festival_id):
        try:
            from analytics.models import FestivalCalendar
            from analytics.serializers import FestivalCalendarSerializer
            festival = FestivalCalendar.objects.get(id=festival_id)
            serializer = FestivalCalendarSerializer(festival)
            return Response(serializer.data)
        except FestivalCalendar.DoesNotExist:
            return Response({'error': 'Festival not found'}, status=404)
    
    def put(self, request, festival_id):
        try:
            from analytics.models import FestivalCalendar
            from analytics.serializers import FestivalCalendarSerializer
            festival = FestivalCalendar.objects.get(id=festival_id)
            serializer = FestivalCalendarSerializer(festival, data=request.data, partial=True)
            if serializer.is_valid():
                festival = serializer.save()
                if 'affected_categories' in request.data:
                    festival.affected_categories.set(request.data['affected_categories'])
                
                AuditLog.objects.create(
                    user=request.user,
                    action_type='UPDATE',
                    content_type='FestivalCalendar',
                    object_id=festival.id,
                    object_repr=festival.name,
                    changes=request.data
                )
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except FestivalCalendar.DoesNotExist:
            return Response({'error': 'Festival not found'}, status=404)
    
    def delete(self, request, festival_id):
        try:
            from analytics.models import FestivalCalendar
            festival = FestivalCalendar.objects.get(id=festival_id)
            festival.delete()
            AuditLog.objects.create(
                user=request.user,
                action_type='DELETE',
                content_type='FestivalCalendar',
                object_repr=festival.name
            )
            return Response({'message': 'Festival deleted'}, status=204)
        except FestivalCalendar.DoesNotExist:
            return Response({'error': 'Festival not found'}, status=404)

class AnnouncementDetailView(APIView):
    """Get/Update/Delete announcement"""
    permission_classes = [IsAdmin]
    
    def get(self, request, announcement_id):
        try:
            announcement = Announcement.objects.get(id=announcement_id)
            serializer = AnnouncementSerializer(announcement)
            return Response(serializer.data)
        except Announcement.DoesNotExist:
            return Response({'error': 'Announcement not found'}, status=404)
    
    def put(self, request, announcement_id):
        try:
            announcement = Announcement.objects.get(id=announcement_id)
            serializer = AnnouncementSerializer(announcement, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                AuditLog.objects.create(
                    user=request.user,
                    action_type='UPDATE',
                    content_type='Announcement',
                    object_id=announcement.id,
                    object_repr=announcement.title,
                    changes=request.data
                )
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Announcement.DoesNotExist:
            return Response({'error': 'Announcement not found'}, status=404)
    
    def delete(self, request, announcement_id):
        try:
            announcement = Announcement.objects.get(id=announcement_id)
            announcement.delete()
            AuditLog.objects.create(
                user=request.user,
                action_type='DELETE',
                content_type='Announcement',
                object_repr=announcement.title
            )
            return Response({'message': 'Announcement deleted'}, status=204)
        except Announcement.DoesNotExist:
            return Response({'error': 'Announcement not found'}, status=404)

class DisputeMessageView(APIView):
    """Add message to dispute"""
    permission_classes = [IsAdmin]
    
    def post(self, request, dispute_id):
        try:
            dispute = Dispute.objects.get(id=dispute_id)
            message = request.data.get('message')
            
            if not message:
                return Response({'error': 'Message required'}, status=400)
            
            dispute_message = DisputeMessage.objects.create(
                dispute=dispute,
                sender=request.user,
                message=message,
                is_staff_only=request.data.get('is_staff_only', False)
            )
            
            serializer = DisputeMessageSerializer(dispute_message)
            return Response(serializer.data, status=201)
            
        except Dispute.DoesNotExist:
            return Response({'error': 'Dispute not found'}, status=404)