"""
Admin Panel Signals.
Copy to: backend/admin_panel/signals.py
"""

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from orders.models import Order
from .models import MiddlemanFlag, AuditLog

User = get_user_model()

@receiver(post_save, sender=Order)
def detect_suspicious_orders(sender, instance, created, **kwargs):
    """Detect potential middleman activities"""
    if created:
        # Check for bulk orders from same customer
        recent_orders = Order.objects.filter(
            customer=instance.customer,
            created_at__date=instance.created_at.date()
        ).count()
        
        if recent_orders > 5:  # More than 5 orders in a day
            MiddlemanFlag.objects.create(
                user=instance.customer,
                flag_type='BULK_PURCHASE',
                description=f"Customer placed {recent_orders} orders today",
                evidence_data={
                    'order_ids': list(Order.objects.filter(
                        customer=instance.customer,
                        created_at__date=instance.created_at.date()
                    ).values_list('id', flat=True)),
                    'date': str(instance.created_at.date())
                }
            )
        
        # Check for high value orders
        if instance.total_amount > 10000:  # Orders above ₹10,000
            MiddlemanFlag.objects.create(
                user=instance.customer,
                flag_type='UNUSUAL_ORDERING',
                description=f"High value order: ₹{instance.total_amount}",
                evidence_data={
                    'order_id': instance.id,
                    'amount': float(instance.total_amount)
                }
            )

@receiver(pre_save, sender=User)
def log_user_changes(sender, instance, **kwargs):
    """Log changes to user accounts"""
    if instance.pk:
        try:
            old = User.objects.get(pk=instance.pk)
            changes = {}
            
            # Track important changes
            fields_to_track = ['is_active', 'is_verified', 'role', 'email']
            for field in fields_to_track:
                old_value = getattr(old, field)
                new_value = getattr(instance, field)
                if old_value != new_value:
                    changes[field] = {'old': old_value, 'new': new_value}
            
            if changes:
                # We'll create audit log in the view since we don't have request user here
                # This signal just detects changes
                instance._changed_fields = changes
                
        except User.DoesNotExist:
            pass