"""
Analytics serializers.
Copy to: backend/analytics/serializers.py
"""

from rest_framework import serializers
from .models import DemandInsight, HistoricalSalesData, FestivalCalendar, RegionalDemandPattern
from products.serializers import CategorySerializer

class DemandInsightSerializer(serializers.ModelSerializer):
    """Demand Insight Serializer"""
    category_name = serializers.ReadOnlyField(source='product_category.name_en')
    
    class Meta:
        model = DemandInsight
        fields = '__all__'
        read_only_fields = ['farmer', 'insight_date', 'created_at']

class HistoricalSalesDataSerializer(serializers.ModelSerializer):
    """Historical Sales Data Serializer"""
    product_name = serializers.ReadOnlyField(source='product.name_en')
    
    class Meta:
        model = HistoricalSalesData
        fields = '__all__'

class FestivalCalendarSerializer(serializers.ModelSerializer):
    """Festival Calendar Serializer"""
    affected_categories = CategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = FestivalCalendar
        fields = '__all__'

class RegionalDemandPatternSerializer(serializers.ModelSerializer):
    """Regional Demand Pattern Serializer"""
    category_name = serializers.ReadOnlyField(source='category.name_en')
    
    class Meta:
        model = RegionalDemandPattern
        fields = '__all__'

class SalesReportSerializer(serializers.Serializer):
    """Sales Report Serializer"""
    period = serializers.CharField()
    total_sales = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_orders = serializers.IntegerField()
    average_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    top_products = serializers.ListField(child=serializers.DictField())
    daily_breakdown = serializers.ListField(child=serializers.DictField())

class PlatformStatsSerializer(serializers.Serializer):
    """Platform Statistics Serializer"""
    total_users = serializers.IntegerField()
    total_farmers = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    total_delivery = serializers.IntegerField()
    total_products = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    average_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    user_growth = serializers.ListField(child=serializers.DictField())
    revenue_growth = serializers.ListField(child=serializers.DictField())