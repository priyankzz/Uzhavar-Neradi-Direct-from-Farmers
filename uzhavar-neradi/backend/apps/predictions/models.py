from django.db import models

class CropPrediction(models.Model):
    crop_name = models.CharField(max_length=100)
    predicted_demand = models.IntegerField()  # number of orders expected
    profit_margin = models.FloatField()       # percentage
    season = models.CharField(max_length=50)  # e.g., "Summer 2025"
    confidence = models.FloatField()          # 0-1