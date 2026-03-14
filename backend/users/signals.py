# users/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.conf import settings
from .models import FarmerProfile, CustomerProfile, DeliveryPartnerProfile
from .views import NotificationService
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

# ============================================================================
# Automatically create empty profiles after a user is created
# ============================================================================

@receiver(post_save, sender=User)
def create_default_profiles(sender, instance, created, **kwargs):
    if created:
        logger.info(f"New user created: {instance.id} - {instance.email}")

        # Auto-create farmer profile if role is FARMER
        if instance.role == 'FARMER' and not FarmerProfile.objects.filter(user=instance).exists():
            profile = FarmerProfile.objects.create(user=instance)
            logger.info(f"Default farmer profile created for user {instance.id}")
            
            # Optional: Send welcome notification
            NotificationService.create_notification(
                instance,
                'WELCOME',
                'Farmer Profile Created',
                'A default farmer profile has been created for you.',
                {'profile_id': profile.id}
            )

        # Auto-create customer profile if role is CUSTOMER
        if instance.role == 'CUSTOMER' and not CustomerProfile.objects.filter(user=instance).exists():
            profile = CustomerProfile.objects.create(user=instance)
            logger.info(f"Default customer profile created for user {instance.id}")
            
            NotificationService.create_notification(
                instance,
                'WELCOME',
                'Customer Profile Created',
                'A default customer profile has been created for you.',
                {'profile_id': profile.id}
            )

        # Auto-create delivery partner profile if role is DELIVERY
        if instance.role == 'DELIVERY' and not DeliveryPartnerProfile.objects.filter(user=instance).exists():
            profile = DeliveryPartnerProfile.objects.create(user=instance)
            logger.info(f"Default delivery profile created for user {instance.id}")
            
            NotificationService.create_notification(
                instance,
                'WELCOME',
                'Delivery Partner Profile Created',
                'A default delivery partner profile has been created for you.',
                {'profile_id': profile.id}
            )