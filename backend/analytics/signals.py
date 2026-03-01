"""
Analytics signals for automatic data collection.
Copy to: backend/analytics/signals.py
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from orders.models import Order
from .models import HistoricalSalesData

@receiver(post_save, sender=Order)
def update_historical_sales(sender, instance, created, **kwargs):
    """Update historical sales data when order is delivered"""
    if instance.status == 'DELIVERED' and not created:
        # For each item in the order
        for item in instance.items.all():
            # Create or update historical sales record
            data, created = HistoricalSalesData.objects.get_or_create(
                product=item.product,
                date=instance.delivered_at.date(),
                defaults={
                    'quantity_sold': float(item.quantity),
                    'average_price': float(item.price_per_unit),
                    'region': instance.delivery_address.split(',')[-1].strip() if ',' in instance.delivery_address else 'Unknown',
                }
            )
            
            if not created:
                # Update existing record
                data.quantity_sold += float(item.quantity)
                # Recalculate average price
                total_value = data.quantity_sold * float(data.average_price)
                total_value += float(item.quantity) * float(item.price_per_unit)
                data.average_price = total_value / data.quantity_sold
                data.save()