from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CropPrediction
import random

class PredictionChartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Mock data - in production this would call an ML model
        crops = ['Tomato', 'Brinjal', 'Chilli', 'Cucumber', 'Ladies Finger']
        bar_data = {
            'labels': crops,
            'values': [random.randint(50, 200) for _ in crops]
        }
        pie_data = {
            'labels': ['High Demand', 'Medium Demand', 'Low Demand'],
            'values': [45, 30, 25]
        }
        return Response({
            'bar_chart': bar_data,
            'pie_chart': pie_data,
            'recommendations': [
                'Plant Tomato for highest profit this season.',
                'Cucumber demand is rising.',
            ]
        })