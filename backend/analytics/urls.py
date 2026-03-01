"""
Analytics URLs.
Copy to: backend/analytics/urls.py
"""

from django.urls import path
from . import views

urlpatterns = [
    # Farmer Analytics
    path('demand-insights/', views.DemandInsightsView.as_view(), name='demand-insights'),
    path('predictions/', views.DemandPredictionsView.as_view(), name='demand-predictions'),
    path('sales-report/', views.SalesReportView.as_view(), name='sales-report'),
    path('seasonal-trends/', views.SeasonalTrendsView.as_view(), name='seasonal-trends'),
    
    # Admin Analytics
    path('platform-stats/', views.PlatformStatsView.as_view(), name='platform-stats'),
    path('user-growth/', views.UserGrowthView.as_view(), name='user-growth'),
    path('top-products/', views.TopProductsView.as_view(), name='top-products'),
    path('region-analysis/', views.RegionAnalysisView.as_view(), name='region-analysis'),
]