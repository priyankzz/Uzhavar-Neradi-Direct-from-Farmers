"""
Analytics admin configuration.
Copy to: backend/analytics/admin.py
"""

from django.contrib import admin
from .models import DemandInsight, HistoricalSalesData, FestivalCalendar, RegionalDemandPattern

@admin.register(DemandInsight)
class DemandInsightAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'product_category', 'insight_date', 'predicted_demand', 'confidence_score']
    list_filter = ['farmer', 'product_category', 'insight_date']
    search_fields = ['farmer__username', 'recommendation_text']

@admin.register(HistoricalSalesData)
class HistoricalSalesDataAdmin(admin.ModelAdmin):
    list_display = ['product', 'date', 'quantity_sold', 'average_price']
    list_filter = ['product', 'date', 'region']
    search_fields = ['product__name_en', 'product__name_ta']

@admin.register(FestivalCalendar)
class FestivalCalendarAdmin(admin.ModelAdmin):
    list_display = ['name', 'date', 'region']
    list_filter = ['region', 'date']
    search_fields = ['name']

@admin.register(RegionalDemandPattern)
class RegionalDemandPatternAdmin(admin.ModelAdmin):
    list_display = ['region', 'category', 'updated_at']
    list_filter = ['region', 'category']