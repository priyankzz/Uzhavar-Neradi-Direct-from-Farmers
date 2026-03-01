"""
Management command to generate sample analytics data.
Copy to: backend/analytics/management/commands/generate_sample_data.py
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random

from analytics.models import HistoricalSalesData, FestivalCalendar, RegionalDemandPattern
from products.models import Product, Category
from users.models import User

class Command(BaseCommand):
    help = 'Generate sample data for analytics testing'

    def handle(self, *args, **options):
        self.stdout.write('Generating sample data...')
        
        # Create festival data
        festivals = [
            {'name': 'Pongal', 'date': '2024-01-15', 'region': 'Tamil Nadu'},
            {'name': 'Diwali', 'date': '2024-11-12', 'region': 'All'},
            {'name': 'Onam', 'date': '2024-09-15', 'region': 'Kerala'},
        ]
        
        for festival in festivals:
            obj, created = FestivalCalendar.objects.get_or_create(
                name=festival['name'],
                defaults={
                    'date': festival['date'],
                    'region': festival['region'],
                    'impact_days_before': 7,
                    'impact_days_after': 3
                }
            )
            if created:
                self.stdout.write(f"Created festival: {festival['name']}")
        
        # Create regional patterns
        regions = ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli']
        categories = Category.objects.all()
        
        for region in regions:
            for category in categories:
                pattern, created = RegionalDemandPattern.objects.get_or_create(
                    region=region,
                    category=category,
                    defaults={
                        'jan_demand': random.uniform(0.5, 1.5),
                        'feb_demand': random.uniform(0.5, 1.5),
                        'mar_demand': random.uniform(0.5, 1.5),
                        'apr_demand': random.uniform(0.5, 1.5),
                        'may_demand': random.uniform(0.5, 1.5),
                        'jun_demand': random.uniform(0.5, 1.5),
                        'jul_demand': random.uniform(0.5, 1.5),
                        'aug_demand': random.uniform(0.5, 1.5),
                        'sep_demand': random.uniform(0.5, 1.5),
                        'oct_demand': random.uniform(0.5, 1.5),
                        'nov_demand': random.uniform(0.5, 1.5),
                        'dec_demand': random.uniform(0.5, 1.5),
                    }
                )
        
        # Create historical sales data
        products = Product.objects.all()
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=365)
        
        current = start_date
        while current <= end_date:
            for product in products:
                # Random sales quantity
                quantity = random.uniform(10, 100)
                
                HistoricalSalesData.objects.get_or_create(
                    product=product,
                    date=current,
                    defaults={
                        'quantity_sold': quantity,
                        'average_price': product.price_per_unit,
                        'day_of_week': current.weekday(),
                        'month': current.month,
                        'year': current.year,
                        'is_festival': random.choice([True, False]),
                        'region': random.choice(regions),
                    }
                )
            
            current += timedelta(days=1)
            
            if current.day == 1:  # Progress indicator
                self.stdout.write(f"Processed: {current}")
        
        self.stdout.write(self.style.SUCCESS('Successfully generated sample data'))