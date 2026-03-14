"""
Analytics views for ML and demand insights.
Copy to: backend/analytics/views.py
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta, datetime
from collections import defaultdict
import random

from .models import DemandInsight, HistoricalSalesData, FestivalCalendar, RegionalDemandPattern
from .serializers import (
    DemandInsightSerializer, HistoricalSalesDataSerializer,
    FestivalCalendarSerializer, RegionalDemandPatternSerializer,
    SalesReportSerializer, PlatformStatsSerializer
)
from products.models import Product, Category
from orders.models import Order
from users.models import User
from users.permissions import IsFarmer, IsAdmin

class DemandInsightsView(APIView):
    """Get demand insights for farmer (Rule-based)"""
    permission_classes = [permissions.IsAuthenticated, IsFarmer]
    
    def get(self, request):
        farmer = request.user
        
        # Get or generate insights
        insights = DemandInsight.objects.filter(
            farmer=farmer,
            insight_date=timezone.now().date()
        )
        
        if not insights.exists():
            # Generate new insights
            insights = self.generate_insights(farmer)
        else:
            insights = insights.first()
        
        serializer = DemandInsightSerializer(insights)
        return Response(serializer.data)
    
    def generate_insights(self, farmer):
        """Generate rule-based demand insights"""
        # Get farmer's products
        products = Product.objects.filter(farmer=farmer)
        
        if not products.exists():
            return {"message": "No products found"}
        
        # Get historical data
        thirty_days_ago = timezone.now().date() - timedelta(days=30)
        historical = HistoricalSalesData.objects.filter(
            product__in=products,
            date__gte=thirty_days_ago
        )
        
        # Calculate basic statistics
        insights = []
        for product in products:
            product_data = historical.filter(product=product)
            
            if product_data.exists():
                avg_daily = product_data.aggregate(Avg('quantity_sold'))['quantity_sold__avg'] or 0
                total_sold = product_data.aggregate(Sum('quantity_sold'))['quantity_sold__sum'] or 0
                
                # Simple prediction based on recent trends
                predicted = avg_daily * 1.1  # 10% growth assumption
                
                # Check for festivals
                today = timezone.now().date()
                festivals = FestivalCalendar.objects.filter(
                    date__gte=today,
                    date__lte=today + timedelta(days=7)
                )
                
                festival_multiplier = 1.0
                if festivals.exists():
                    festival_multiplier = 1.3  # 30% increase during festivals
                
                predicted *= festival_multiplier
                
                # Seasonal factor
                seasonal_factor = 1.0
                current_month = today.month
                seasonal = RegionalDemandPattern.objects.filter(
                    region=farmer.farmer_profile.farm_address.split(',')[-1].strip() if farmer.farmer_profile else '',
                    category=product.category
                ).first()
                
                if seasonal:
                    seasonal_factor = seasonal.get_monthly_factor(current_month)
                    predicted *= seasonal_factor
                
                insight = DemandInsight.objects.create(
                    farmer=farmer,
                    product_category=product.category,
                    predicted_demand=predicted,
                    confidence_score=0.7 if product_data.count() > 10 else 0.5,
                    seasonal_factor=seasonal_factor if seasonal else 1.0,
                    festival_factor=festival_multiplier,
                    historical_trend=total_sold / 30 if total_sold > 0 else 0,
                    suggested_price=product.price_per_unit * 1.05,  # Suggest 5% increase
                    suggested_quantity=predicted * 1.2,  # Suggest 20% buffer
                    recommendation_text=self.generate_recommendation(predicted, festival_multiplier, seasonal_factor)
                )
                insights.append(insight)
        
        return insights[0] if insights else None
    
    def generate_recommendation(self, predicted_demand, festival_factor, seasonal_factor):
        """Generate human-readable recommendation"""
        if festival_factor > 1.2:
            return "Festival season approaching! Increase stock by 30% and consider slight price increase."
        elif seasonal_factor > 1.2:
            return "Peak season for this crop. Good time to sell."
        elif seasonal_factor < 0.8:
            return "Off-season. Consider reducing prices to maintain sales."
        else:
            return "Stable demand. Maintain current pricing and stock levels."

class DemandPredictionsView(APIView):
    """Get ML-based demand predictions (Phase 2)"""
    permission_classes = [permissions.IsAuthenticated, IsFarmer]
    
    def get(self, request):
        farmer = request.user
        product_id = request.query_params.get('product_id')
        
        # In production, this would use actual ML models
        # For now, generate sample predictions
        
        products = Product.objects.filter(farmer=farmer)
        if product_id:
            products = products.filter(id=product_id)
        
        predictions = []
        for product in products:
            # Generate random but realistic predictions
            base_demand = random.uniform(50, 500)
            
            # Next 7 days predictions
            next_week = []
            for i in range(7):
                date = timezone.now().date() + timedelta(days=i)
                daily_demand = base_demand * (1 + random.uniform(-0.2, 0.2))
                confidence = random.uniform(0.6, 0.9)
                
                next_week.append({
                    'date': date,
                    'predicted_demand': round(daily_demand, 2),
                    'confidence': round(confidence, 2)
                })
            
            predictions.append({
                'product_id': product.id,
                'product_name': product.name_en,
                'current_price': float(product.price_per_unit),
                'suggested_price': float(product.price_per_unit) * (1 + random.uniform(-0.1, 0.15)),
                'next_week': next_week,
                'monthly_trend': random.choice(['increasing', 'stable', 'decreasing']),
                'risk_level': random.choice(['low', 'medium', 'high'])
            })
        
        return Response(predictions)

class SalesReportView(APIView):
    """Get sales report for farmer"""
    permission_classes = [permissions.IsAuthenticated, IsFarmer]
    
    def get(self, request):
        farmer = request.user
        period = request.query_params.get('period', 'month')  # week, month, year
        
        today = timezone.now().date()
        
        if period == 'week':
            start_date = today - timedelta(days=7)
        elif period == 'month':
            start_date = today - timedelta(days=30)
        elif period == 'year':
            start_date = today - timedelta(days=365)
        else:
            start_date = today - timedelta(days=30)
        
        # Get orders
        orders = Order.objects.filter(
            farmer=farmer,
            created_at__date__gte=start_date,
            status='DELIVERED'
        )
        
        total_sales = orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_orders = orders.count()
        
        # Top products
        top_products = []
        for order in orders:
            for item in order.items.all():
                top_products.append({
                    'product_id': item.product.id,
                    'product_name': item.product.name_en,
                    'quantity': float(item.quantity),
                    'revenue': float(item.total_price)
                })
        
        # Aggregate top products
        product_summary = defaultdict(lambda: {'quantity': 0, 'revenue': 0})
        for item in top_products:
            product_summary[item['product_id']]['name'] = item['product_name']
            product_summary[item['product_id']]['quantity'] += item['quantity']
            product_summary[item['product_id']]['revenue'] += item['revenue']
        
        top_products_list = [
            {
                'id': pid,
                'name': data['name'],
                'quantity': data['quantity'],
                'revenue': data['revenue']
            }
            for pid, data in product_summary.items()
        ]
        top_products_list.sort(key=lambda x: x['revenue'], reverse=True)
        
        # Daily breakdown
        daily = []
        current = start_date
        while current <= today:
            day_orders = orders.filter(created_at__date=current)
            daily.append({
                'date': current,
                'orders': day_orders.count(),
                'revenue': float(day_orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0)
            })
            current += timedelta(days=1)
        
        report = {
            'period': period,
            'start_date': start_date,
            'end_date': today,
            'total_sales': total_sales,
            'total_orders': total_orders,
            'average_order_value': total_sales / total_orders if total_orders > 0 else 0,
            'top_products': top_products_list[:5],
            'daily_breakdown': daily
        }
        
        serializer = SalesReportSerializer(report)
        return Response(serializer.data)

class SeasonalTrendsView(APIView):
    """Get seasonal trends for farmer's region"""
    permission_classes = [permissions.IsAuthenticated, IsFarmer]
    
    def get(self, request):
        farmer = request.user
        
        # Get farmer's region
        region = None
        if hasattr(farmer, 'farmer_profile') and farmer.farmer_profile:
            # Extract region from address (simplified)
            address_parts = farmer.farmer_profile.farm_address.split(',')
            region = address_parts[-1].strip() if address_parts else None
        
        # Get regional patterns
        patterns = RegionalDemandPattern.objects.all()
        if region:
            patterns = patterns.filter(region__icontains=region)
        
        serializer = RegionalDemandPatternSerializer(patterns, many=True)
        return Response(serializer.data)

class PlatformStatsView(APIView):
    """Get platform statistics (Admin only)"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request):
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)
        
        # User stats
        total_users = User.objects.count()
        total_farmers = User.objects.filter(role='FARMER').count()
        total_customers = User.objects.filter(role='CUSTOMER').count()
        total_delivery = User.objects.filter(role='DELIVERY').count()
        
        # Product stats
        total_products = Product.objects.filter(is_active=True).count()
        
        # Order stats
        orders = Order.objects.filter(created_at__date__gte=thirty_days_ago)
        total_orders = orders.count()
        total_revenue = orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # User growth
        user_growth = []
        for i in range(30):
            date = thirty_days_ago + timedelta(days=i)
            count = User.objects.filter(date_joined__date=date).count()
            user_growth.append({
                'date': date,
                'new_users': count
            })
        
        # Revenue growth
        revenue_growth = []
        for i in range(30):
            date = thirty_days_ago + timedelta(days=i)
            daily_revenue = Order.objects.filter(
                created_at__date=date,
                status='DELIVERED'
            ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
            revenue_growth.append({
                'date': date,
                'revenue': float(daily_revenue)
            })
        
        stats = {
            'total_users': total_users,
            'total_farmers': total_farmers,
            'total_customers': total_customers,
            'total_delivery': total_delivery,
            'total_products': total_products,
            'total_orders': total_orders,
            'total_revenue': total_revenue,
            'average_order_value': total_revenue / total_orders if total_orders > 0 else 0,
            'user_growth': user_growth,
            'revenue_growth': revenue_growth
        }
        
        serializer = PlatformStatsSerializer(stats)
        return Response(serializer.data)

class UserGrowthView(APIView):
    """Get user growth analytics (Admin only)"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request):
        period = request.query_params.get('period', 'month')
        
        today = timezone.now().date()
        
        if period == 'week':
            days = 7
        elif period == 'month':
            days = 30
        elif period == 'year':
            days = 365
        else:
            days = 30
        
        start_date = today - timedelta(days=days)
        
        growth_data = []
        current = start_date
        
        while current <= today:
            farmers = User.objects.filter(role='FARMER', date_joined__date=current).count()
            customers = User.objects.filter(role='CUSTOMER', date_joined__date=current).count()
            delivery = User.objects.filter(role='DELIVERY', date_joined__date=current).count()
            
            growth_data.append({
                'date': current,
                'farmers': farmers,
                'customers': customers,
                'delivery': delivery,
                'total': farmers + customers + delivery
            })
            
            current += timedelta(days=1)
        
        return Response(growth_data)

class TopProductsView(APIView):
    """Get top selling products (Admin only)"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        period = request.query_params.get('period', 'month')
        
        today = timezone.now().date()
        
        if period == 'week':
            start_date = today - timedelta(days=7)
        elif period == 'month':
            start_date = today - timedelta(days=30)
        else:
            start_date = today - timedelta(days=30)
        
        # Get all delivered orders in period
        orders = Order.objects.filter(
            created_at__date__gte=start_date,
            status='DELIVERED'
        )
        
        # Aggregate product sales
        product_sales = defaultdict(lambda: {'quantity': 0, 'revenue': 0, 'orders': 0})
        
        for order in orders:
            for item in order.items.all():
                product_sales[item.product.id]['name'] = item.product.name_en
                product_sales[item.product.id]['quantity'] += float(item.quantity)
                product_sales[item.product.id]['revenue'] += float(item.total_price)
                product_sales[item.product.id]['orders'] += 1
        
        # Convert to list and sort
        top_products = [
            {
                'id': pid,
                'name': data['name'],
                'quantity_sold': data['quantity'],
                'revenue': data['revenue'],
                'order_count': data['orders']
            }
            for pid, data in product_sales.items()
        ]
        
        top_products.sort(key=lambda x: x['revenue'], reverse=True)
        
        return Response(top_products[:limit])

class RegionAnalysisView(APIView):
    """Get region-wise analysis (Admin only)"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request):
        # Group orders by region (simplified - extract from delivery_address)
        orders = Order.objects.filter(status='DELIVERED')
        
        region_data = defaultdict(lambda: {'orders': 0, 'revenue': 0, 'customers': set()})
        
        for order in orders:
            # Extract region from address (simplified)
            address_parts = order.delivery_address.split(',')
            region = address_parts[-1].strip() if len(address_parts) > 1 else 'Other'
            
            region_data[region]['orders'] += 1
            region_data[region]['revenue'] += float(order.total_amount)
            region_data[region]['customers'].add(order.customer.id)
        
        # Format response
        analysis = [
            {
                'region': region,
                'total_orders': data['orders'],
                'total_revenue': data['revenue'],
                'unique_customers': len(data['customers']),
                'average_order_value': data['revenue'] / data['orders'] if data['orders'] > 0 else 0
            }
            for region, data in region_data.items()
        ]
        
        analysis.sort(key=lambda x: x['total_revenue'], reverse=True)
        
        return Response(analysis)