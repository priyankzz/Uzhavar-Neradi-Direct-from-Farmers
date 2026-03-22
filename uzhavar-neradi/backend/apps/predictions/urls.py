from django.urls import path
from .views import PredictionChartView

urlpatterns = [
    path('charts/', PredictionChartView.as_view(), name='prediction-charts'),
]