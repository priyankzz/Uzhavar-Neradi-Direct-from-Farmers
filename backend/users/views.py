"""
User views for API.
Copy to: backend/users/views.py
"""

from rest_framework import generics, permissions, status, mixins
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import NotFound, ValidationError
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from django.urls import reverse
from users.permissions import IsFarmer, IsCustomer, IsDeliveryPartner
import logging
import json
from users.permissions import IsVerifiedUser

from .models import (
    User, FarmerProfile, CustomerProfile, DeliveryPartnerProfile, 
    Notification, UserActivity
)
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    OTPVerifySerializer, FarmerProfileSerializer,
    CustomerProfileSerializer, DeliveryPartnerProfileSerializer,
    NotificationSerializer,  UserActivitySerializer 
)

User = get_user_model()
logger = logging.getLogger(__name__)

# ============================================================================
# NOTIFICATION SERVICE - Centralized notification handling
# ============================================================================

class NotificationService:
    """Centralized notification service for all user communications"""
    
    @staticmethod
    def create_notification(user, notification_type, title, message, data=None):
        """Create in-app notification"""
        try:
            notification = Notification.objects.create(
                user=user,
                type=notification_type,
                title=title,
                message=message,
                data=data or {}
            )
            logger.info(f"Notification created for user {user.id}: {notification_type}")
            return notification
        except Exception as e:
            logger.error(f"Failed to create notification: {str(e)}")
            return None
    
    @staticmethod
    def send_email(user, subject, template_name, context):
        """Send HTML email with fallback to plain text"""
        try:
            html_message = render_to_string(f'emails/{template_name}.html', context)
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False
            )
            logger.info(f"Email sent to {user.email}: {subject}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {user.email}: {str(e)}")
            return False
    
    @staticmethod
    def send_sms(user, message):
        """Send SMS notification (implement with your SMS provider)"""
        if user.phone and settings.ENABLE_SMS:
            try:
                # Integrate with your SMS provider (Twilio, MSG91, etc.)
                # sms_provider.send(user.phone, message)
                logger.info(f"SMS sent to {user.phone}")
                return True
            except Exception as e:
                logger.error(f"Failed to send SMS: {str(e)}")
        return False
    
    @staticmethod
    def send_push_notification(user, title, body, data=None):
        """Send push notification (implement with Firebase, OneSignal, etc.)"""
        if hasattr(user, 'push_token') and user.push_token:
            try:
                # Integrate with your push notification service
                # push_service.send(user.push_token, title, body, data)
                logger.info(f"Push notification sent to user {user.id}")
                return True
            except Exception as e:
                logger.error(f"Failed to send push notification: {str(e)}")
        return False

# ============================================================================
# ORIGINAL AUTH VIEWS - KEPT EXACTLY AS THEY WERE
# ============================================================================

class RegisterView(generics.CreateAPIView):
    """User Registration with Email OTP"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        
        # Send OTP via email
        if not user.is_superuser and user.email_otp:
            context = {
                'user': user,
                'otp': user.email_otp,
                'year': timezone.now().year
            }
            
            email_sent = NotificationService.send_email(
                user,
                'Uzhavar Neradi - Email Verification OTP',
                'otp_verification',
                context
            )
            
            # Create in-app notification
            NotificationService.create_notification(
                user,
                'OTP',
                'Email Verification Required',
                f'Please verify your email using OTP: {user.email_otp}',
                {'otp': user.email_otp}
            )
            
            if email_sent:
                print(f"✅ OTP email sent successfully to {user.email}")
            else:
                print(f"⚠️ OTP is: {user.email_otp} (use this for verification)")

# users/views.py

class LoginView(APIView):
    """User Login with verification check"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        # Check verification for non-admin users
        if user.role != 'ADMIN':
            is_verified = True  # default allow
            if user.role == 'DELIVERY':
                profile = getattr(user, 'delivery_profile', None)
                is_verified = profile.is_verified if profile else False
            elif user.role == 'FARMER':
                profile = getattr(user, 'farmer_profile', None)
                is_verified = profile.is_verified if profile else False

            user_data['is_verified'] = is_verified
            user_data['verification_message'] = (
                "You are not verified by admin. You cannot do anything until admin verifies your account."
                if not is_verified else "Verified"
            )

        # Track login activity
        UserActivity.objects.create(
            user=user,
            activity_type='LOGIN',
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )

        return Response({
            'user': user_data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'Login successful'
        })

class OTPVerifyView(APIView):
    """Verify OTP"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            
            # Send welcome email after verification
            if not user.is_superuser:
                context = {
                    'user': user,
                    'login_url': request.build_absolute_uri('/login'),
                    'year': timezone.now().year
                }
                
                NotificationService.send_email(
                    user,
                    'Welcome to Uzhavar Neradi!',
                    'welcome',
                    context
                )
                
                NotificationService.create_notification(
                    user,
                    'WELCOME',
                    'Welcome to Uzhavar Neradi!',
                    f'Thank you for joining, {user.username}! Complete your profile to start.',
                    {'profile_url': '/profile'}
                )
            
            return Response({
                'message': 'Email verified successfully',
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    """Resend OTP"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            
            if user.is_superuser:
                return Response({'error': 'Superuser does not need OTP verification'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            if user.is_verified:
                return Response({'error': 'Email already verified'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Generate new OTP
            otp = user.generate_otp()
            
            # Send OTP via email
            context = {
                'user': user,
                'otp': otp,
                'year': timezone.now().year
            }
            
            email_sent = NotificationService.send_email(
                user,
                'Uzhavar Neradi - New OTP for Verification',
                'otp_resend',
                context
            )
            
            NotificationService.create_notification(
                user,
                'OTP',
                'New OTP Generated',
                f'Your new OTP is: {otp}',
                {'otp': otp}
            )
            
            if email_sent:
                return Response({'message': 'OTP resent successfully. Please check your email.'})
            else:
                return Response({
                    'message': 'OTP generated successfully',
                    'otp': otp,
                    'warning': 'Email sending failed, but OTP is shown for testing'
                })
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get/Update User Profile"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

# ============================================================================
# ORIGINAL PROFILE VIEWS
# ============================================================================

class CreateFarmerProfileView(generics.CreateAPIView):
    """Create Farmer Profile"""
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmer]
    
    def perform_create(self, serializer):
        profile = serializer.save(user=self.request.user)
        
        # Send notifications
        self._send_profile_notifications(profile)
    
    def _send_profile_notifications(self, profile):
        """Send all profile creation notifications"""
        user = profile.user
        
        # Email notification
        context = {
            'user': user,
            'profile': profile,
            'dashboard_url': '/farmer/dashboard',
            'year': timezone.now().year
        }
        
        NotificationService.send_email(
            user,
            'Your Farmer Profile is Under Review',
            'farmer_profile_created',
            context
        )
        
        # In-app notification
        NotificationService.create_notification(
            user,
            'PROFILE',
            'Farmer Profile Created',
            'Your farmer profile has been created and is pending verification.',
            {'profile_id': profile.id, 'status': profile.verification_status}
        )
        
        # SMS notification if phone exists
        if user.phone:
            NotificationService.send_sms(
                user,
                f'Your farmer profile has been created. We will verify and notify you within 24-48 hours.'
            )
        
        # Notify admin about new profile
        self._notify_admin_new_farmer(profile)
    
    def _notify_admin_new_farmer(self, profile):
        """Notify admins about new farmer registration"""
        admins = User.objects.filter(role='ADMIN', is_active=True)
        for admin in admins:
            NotificationService.create_notification(
                admin,
                'ADMIN_ALERT',
                'New Farmer Registration',
                f'{profile.user.username} has registered as a farmer and needs verification.',
                {
                    'farmer_id': profile.user.id,
                    'profile_id': profile.id,
                    'verification_url': f'/admin/farmers/{profile.id}/verify'
                }
            )

class GetFarmerProfileView(generics.RetrieveAPIView):
    """Get Farmer Profile"""
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmer]
    
    def get_object(self):
        try:
            return FarmerProfile.objects.get(user=self.request.user)
        except FarmerProfile.DoesNotExist:
            return Response(
                {
                    'error': 'Farmer profile not found',
                    'message': 'You need to create a farmer profile first',
                    'needs_creation': True
                }, 
                status=status.HTTP_404_NOT_FOUND
            )

class CreateCustomerProfileView(generics.CreateAPIView):
    """Create Customer Profile"""
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomer]
    
    def perform_create(self, serializer):
        profile = serializer.save(user=self.request.user)
        
        # Welcome notification for customer
        NotificationService.create_notification(
            self.request.user,
            'WELCOME',
            'Welcome Customer!',
            'Start exploring fresh produce from local farmers.',
            {'products_url': '/products'}
        )

class GetCustomerProfileView(generics.RetrieveAPIView):
    """Get Customer Profile"""
    serializer_class = CustomerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomer]
    
    def get_object(self):
        try:
            return CustomerProfile.objects.get(user=self.request.user)
        except CustomerProfile.DoesNotExist:
            raise NotFound("Customer profile not found. Please create one first.")

class CreateDeliveryProfileView(generics.CreateAPIView):
    """Create Delivery Partner Profile"""
    serializer_class = DeliveryPartnerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliveryPartner]
    
    def perform_create(self, serializer):
        profile = serializer.save(user=self.request.user)
        
        # Notify delivery partner
        NotificationService.create_notification(
            self.request.user,
            'PROFILE',
            'Delivery Partner Profile Created',
            'Your profile is under review. You will be notified when verified.',
            {'status': profile.verification_status}
        )
        
        # Notify admins
        self._notify_admin_new_delivery(profile)
    
    def _notify_admin_new_delivery(self, profile):
        """Notify admins about new delivery partner"""
        admins = User.objects.filter(role='ADMIN', is_active=True)
        for admin in admins:
            NotificationService.create_notification(
                admin,
                'ADMIN_ALERT',
                'New Delivery Partner Registration',
                f'{profile.user.username} has registered as a delivery partner.',
                {
                    'delivery_id': profile.user.id,
                    'profile_id': profile.id,
                    'verification_url': f'/admin/delivery/{profile.id}/verify'
                }
            )

class GetDeliveryProfileView(generics.RetrieveAPIView):
    """Get Delivery Partner Profile"""
    serializer_class = DeliveryPartnerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliveryPartner]
    
    def get_object(self):
        try:
            return DeliveryPartnerProfile.objects.get(user=self.request.user)
        except DeliveryPartnerProfile.DoesNotExist:
            raise NotFound("Delivery profile not found. Please create one first.")

# ============================================================================
# ENHANCED FARMER PROFILE VIEWS
# ============================================================================

class BaseProfileView:
    """Base class for profile views with common functionality"""
    
    def get_profile_or_404(self, model, user):
        """Get profile or raise detailed NotFound exception"""
        try:
            return model.objects.get(user=user)
        except ObjectDoesNotExist:
            profile_type = model.__name__.replace('Profile', '').lower()
            logger.warning(f"{profile_type} profile not found for user {user.id} - {user.email}")
            raise NotFound(
                detail={
                    'error': f'{profile_type.capitalize()} profile not found',
                    'message': f'Please create your {profile_type} profile first',
                    'user_id': user.id,
                    'user_email': user.email,
                    'requires_creation': True,
                    'creation_endpoint': f'/api/auth/{profile_type}/create/'
                }
            )

class EnhancedGetFarmerProfileView(
    BaseProfileView,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    """
    ENHANCED: Get or partially update farmer profile.
    - GET: Retrieve farmer profile
    - PATCH: Update farmer profile partially
    - PUT: Update farmer profile fully
    """
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsVerifiedUser]
    
    def get_object(self):
        try:
            return FarmerProfile.objects.get(user=self.request.user)
        except FarmerProfile.DoesNotExist:
            raise NotFound("Farmer profile not found. Please create one first.")
    
    def get(self, request, *args, **kwargs):
        """Retrieve farmer profile with additional context"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            
            # Add helpful metadata
            response_data = serializer.data
            response_data['_metadata'] = {
                'can_edit': True,
                'edit_endpoint': request.path,
                'allowed_methods': ['GET', 'PUT', 'PATCH'],
                'profile_status': 'active' if instance.is_verified else 'pending',
                'payment_info_status': 'complete' if instance.has_payment_info else 'incomplete'
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except NotFound as e:
            return Response(e.detail, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, *args, **kwargs):
        """Partially update farmer profile"""
        return self.partial_update(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        """Fully update farmer profile"""
        return self.update(request, *args, **kwargs)
    
    def perform_update(self, serializer):
        """Log profile updates for audit trail"""
        instance = serializer.save()
        
        # Log activity
        UserActivity.objects.create(
            user=self.request.user,
            activity_type='PROFILE_UPDATE',
            metadata={
                'profile_type': 'farmer',
                'fields_updated': list(serializer.validated_data.keys())
            }
        )
        
        logger.info(
            f"Farmer profile updated - User: {self.request.user.id}, "
            f"Farm: {instance.farm_name}, Fields: {list(serializer.validated_data.keys())}"
        )

class EnhancedCreateFarmerProfileView(generics.CreateAPIView):
    """ENHANCED: Create farmer profile with validation and auto-population"""
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Ensure users can only see their own profiles"""
        return FarmerProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Create profile with pre-validation and logging"""
        # Check if profile already exists
        if FarmerProfile.objects.filter(user=self.request.user).exists():
            logger.warning(
                f"Attempted duplicate farmer profile creation - User: {self.request.user.id}"
            )
            raise ValidationError({
                'error': 'Profile already exists',
                'message': 'You already have a farmer profile',
                'profile_endpoint': '/api/auth/farmer/profile/'
            })
        
        # Create profile
        profile = serializer.save(user=self.request.user)
        
        # Send comprehensive notifications
        self._send_all_notifications(profile)
        
        # Log creation for audit
        logger.info(
            f"New farmer profile created - User: {self.request.user.id}, "
            f"Farm: {profile.farm_name}"
        )
    
    def _send_all_notifications(self, profile):
        """Send ALL notifications for profile creation"""
        user = profile.user
        
        # 1. Email notification
        context = {
            'user': user,
            'profile': profile,
            'dashboard_url': '/farmer/dashboard',
            'support_email': settings.SUPPORT_EMAIL,
            'year': timezone.now().year
        }
        
        NotificationService.send_email(
            user,
            'Welcome to Uzhavar Neradi Farmer Community!',
            'farmer_welcome',
            context
        )
        
        # 2. SMS notification
        if user.phone:
            message = (
                f"Dear {user.username}, your farmer profile has been created. "
                f"We'll verify your documents within 24-48 hours. "
                f"Thank you for joining Uzhavar Neradi!"
            )
            NotificationService.send_sms(user, message)
        
        # 3. In-app notifications (multiple for different purposes)
        
        # Welcome notification
        NotificationService.create_notification(
            user,
            'WELCOME',
            '🎉 Welcome to Uzhavar Neradi Farmers!',
            'Your profile is being reviewed. Start adding your products while you wait!',
            {
                'action': 'add_products',
                'action_url': '/farmer/products/add',
                'profile_id': profile.id
            }
        )
        
        # Verification pending notification
        NotificationService.create_notification(
            user,
            'VERIFICATION',
            '📋 Profile Under Verification',
            'We are verifying your documents. This usually takes 24-48 hours.',
            {
                'status': profile.verification_status,
                'estimated_time': '24-48 hours'
            }
        )
        
        # Setup payment info reminder
        NotificationService.create_notification(
            user,
            'REMINDER',
            '💳 Complete Payment Setup',
            'Set up your payment details to start receiving payments for orders.',
            {
                'action': 'setup_payment',
                'action_url': '/farmer/payment-setup',
                'priority': 'high'
            }
        )
        
        # Add products reminder
        NotificationService.create_notification(
            user,
            'REMINDER',
            '🌾 Start Adding Products',
            'Add your farm products to start selling to customers.',
            {
                'action': 'add_products',
                'action_url': '/farmer/products/add',
                'priority': 'medium'
            }
        )
        
        # 4. Push notification if enabled
        NotificationService.send_push_notification(
            user,
            'Welcome to Uzhavar Neradi!',
            'Your farmer profile has been created successfully.',
            {'screen': 'FarmerDashboard'}
        )
        
        # 5. Admin notifications (multiple admins)
        self._notify_all_admins(profile)
        
        # 6. Send WhatsApp notification if integrated
        self._send_whatsapp_notification(profile)
    
    def _notify_all_admins(self, profile):
        """Notify all admins about new farmer"""
        admins = User.objects.filter(role='ADMIN', is_active=True)
        
        for admin in admins:
            # Email to admin
            context = {
                'admin': admin,
                'farmer': profile.user,
                'profile': profile,
                'verification_url': f'/admin/farmers/{profile.id}/verify',
                'admin_dashboard': '/admin/dashboard',
                'year': timezone.now().year
            }
            
            NotificationService.send_email(
                admin,
                f'New Farmer Registration: {profile.user.username}',
                'admin_new_farmer',
                context
            )
            
            # In-app notification for admin
            NotificationService.create_notification(
                admin,
                'ADMIN_ALERT',
                '🚜 New Farmer Registration',
                f'{profile.user.username} ({profile.farm_name}) has registered and needs verification.',
                {
                    'farmer_id': profile.user.id,
                    'profile_id': profile.id,
                    'verification_url': f'/admin/farmers/{profile.id}/verify',
                    'priority': 'high',
                    'action_required': True
                }
            )
            
            # SMS to admin (optional, for urgent notifications)
            if admin.phone and hasattr(settings, 'ADMIN_SMS_ALERTS') and settings.ADMIN_SMS_ALERTS:
                NotificationService.send_sms(
                    admin,
                    f'New farmer registration: {profile.user.username}. Please verify.'
                )
    
    def _send_whatsapp_notification(self, profile):
        """Send WhatsApp notification if integrated"""
        if hasattr(settings, 'WHATSAPP_ENABLED') and settings.WHATSAPP_ENABLED:
            try:
                # Integrate with WhatsApp Business API
                # whatsapp_service.send_template(
                #     to=profile.user.phone,
                #     template='farmer_welcome',
                #     params=[profile.user.username]
                # )
                logger.info(f"WhatsApp notification sent to {profile.user.phone}")
            except Exception as e:
                logger.error(f"Failed to send WhatsApp notification: {str(e)}")

class FarmerProfileStatusView(generics.RetrieveAPIView):
    """
    Get farmer profile verification status
    Useful for checking if profile exists and its verification state
    """
    permission_classes = [permissions.IsAuthenticated, IsVerifiedUser]
    
    def get(self, request, *args, **kwargs):
        """Return profile status without full data"""
        try:
            profile = FarmerProfile.objects.get(user=request.user)
            return Response({
                'exists': True,
                'is_verified': profile.is_verified,
                'verification_status': profile.verification_status,
                'payment_info_verified': profile.payment_info_verified,
                'has_payment_info': profile.has_payment_info,
                'created_at': profile.created_at,
                'needs_payment_setup': not profile.has_payment_info,
                'can_sell': profile.is_verified and profile.has_payment_info
            }, status=status.HTTP_200_OK)
            
        except FarmerProfile.DoesNotExist:
            return Response({
                'exists': False,
                'message': 'Farmer profile not found',
                'needs_creation': True
            }, status=status.HTTP_200_OK)

class PublicFarmerDeliveryInfoView(APIView):
    """
    Public endpoint to get farmer delivery information
    No authentication required - safe for cart page
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, farmer_id):
        try:
            farmer = User.objects.get(id=farmer_id, role='FARMER')
            try:
                profile = FarmerProfile.objects.get(user=farmer)
                return Response({
                    'farmer_id': farmer.id,
                    'delivery_fee': profile.delivery_fee,
                    'free_delivery_min_amount': profile.free_delivery_min_amount,
                    'delivery_available': profile.delivery_available,
                    'pickup_available': profile.pickup_available,
                    'farm_pickup_address': profile.farm_pickup_address
                })
            except FarmerProfile.DoesNotExist:
                return Response({
                    'farmer_id': farmer.id,
                    'delivery_fee': 50.00,
                    'free_delivery_min_amount': None,
                    'delivery_available': True,
                    'pickup_available': True,
                    'farm_pickup_address': ''
                })
        except User.DoesNotExist:
            return Response(
                {'error': 'Farmer not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

# ============================================================================
# NOTIFICATION VIEWS
# ============================================================================

class NotificationListView(generics.ListAPIView):
    """Get user notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsVerifiedUser]
    
    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Mark as read when fetched
        unread = queryset.filter(is_read=False)
        unread.update(is_read=True)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'notifications': serializer.data,
            'unread_count': 0  # All are now read
        })

class NotificationCountView(APIView):
    """Get unread notification count"""
    permission_classes = [permissions.IsAuthenticated, IsVerifiedUser]
    
    def get(self, request):
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        return Response({'unread_count': count})

class MarkNotificationReadView(APIView):
    """Mark notification as read"""
    permission_classes = [permissions.IsAuthenticated, IsVerifiedUser]
    
    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )
            notification.is_read = True
            notification.save()
            return Response({'message': 'Notification marked as read'})
        except Notification.DoesNotExist:
            return Response(
                {'error': 'Notification not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class MarkAllNotificationsReadView(APIView):
    """Mark all notifications as read"""
    permission_classes = [permissions.IsAuthenticated, IsVerifiedUser]
    
    def post(self, request):
        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})