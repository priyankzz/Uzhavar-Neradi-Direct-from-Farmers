"""
Analytics models for ML and demand insights.
Copy to: backend/analytics/models.py
"""

from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product, Category

User = get_user_model()

class DemandInsight(models.Model):
    """Rule-based demand insights for farmers"""
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='demand_insights', limit_choices_to={'role': 'FARMER'})
    product_category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='demand_insights')
    
    # Insight data
    insight_date = models.DateField(auto_now_add=True)
    predicted_demand = models.FloatField(help_text="Predicted demand in quantity")
    confidence_score = models.FloatField(default=0.5, help_text="Confidence score from 0 to 1")
    
    # Factors influencing demand
    seasonal_factor = models.FloatField(default=1.0, help_text="Seasonal multiplier")
    festival_factor = models.FloatField(default=1.0, help_text="Festival multiplier")
    historical_trend = models.FloatField(default=0, help_text="Historical trend value")
    weather_factor = models.FloatField(default=1.0, null=True, blank=True, help_text="Weather impact factor")
    market_trend = models.FloatField(default=1.0, help_text="Market trend factor")
    
    # Recommendations
    suggested_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    suggested_quantity = models.FloatField(null=True, blank=True, help_text="Suggested quantity to produce")
    suggested_harvest_date = models.DateField(null=True, blank=True, help_text="Optimal harvest date")
    recommendation_text = models.TextField(blank=True, help_text="Human readable recommendation")
    
    # For ML model tracking
    model_version = models.CharField(max_length=50, default='v1.0')
    actual_demand = models.FloatField(null=True, blank=True, help_text="Actual demand for accuracy tracking")
    prediction_accuracy = models.FloatField(null=True, blank=True, help_text="Accuracy of prediction")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-insight_date']
        indexes = [
            models.Index(fields=['farmer', 'insight_date']),
            models.Index(fields=['product_category', 'insight_date']),
        ]
    
    def __str__(self):
        return f"Insight for {self.farmer.username} on {self.insight_date}"
    
    def calculate_accuracy(self):
        """Calculate prediction accuracy when actual demand is available"""
        if self.actual_demand and self.predicted_demand:
            error = abs(self.actual_demand - self.predicted_demand)
            accuracy = max(0, 1 - (error / max(self.actual_demand, 1)))
            self.prediction_accuracy = accuracy
            self.save()
            return accuracy
        return None

class HistoricalSalesData(models.Model):
    """Historical sales data for training ML models"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='historical_sales')
    date = models.DateField()
    quantity_sold = models.FloatField()
    average_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Context
    day_of_week = models.IntegerField(help_text="0-6, Monday is 0")
    week_of_year = models.IntegerField(null=True, blank=True)
    month = models.IntegerField()
    year = models.IntegerField()
    quarter = models.IntegerField(null=True, blank=True)
    is_weekend = models.BooleanField(default=False)
    is_festival = models.BooleanField(default=False)
    festival_name = models.CharField(max_length=100, blank=True)
    
    # Weather data (optional)
    temperature = models.FloatField(null=True, blank=True, help_text="Temperature in Celsius")
    rainfall = models.FloatField(null=True, blank=True, help_text="Rainfall in mm")
    humidity = models.FloatField(null=True, blank=True, help_text="Humidity percentage")
    
    # Location
    region = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['product', 'date']),
            models.Index(fields=['region', 'date']),
            models.Index(fields=['product', 'month', 'year']),
        ]
        unique_together = ['product', 'date']  # One record per product per day
    
    def __str__(self):
        return f"{self.product.name_en} - {self.date}"
    
    def save(self, *args, **kwargs):
        # Auto-calculate total revenue
        self.total_revenue = self.quantity_sold * float(self.average_price)
        
        # Auto-set derived fields
        self.day_of_week = self.date.weekday()
        self.week_of_year = self.date.isocalendar()[1]
        self.month = self.date.month
        self.year = self.date.year
        self.quarter = (self.date.month - 1) // 3 + 1
        self.is_weekend = self.date.weekday() >= 5
        
        super().save(*args, **kwargs)

class FestivalCalendar(models.Model):
    """Festival dates for demand prediction"""
    name = models.CharField(max_length=100)
    name_ta = models.CharField(max_length=100, blank=True, help_text="Tamil name")
    date = models.DateField()
    end_date = models.DateField(null=True, blank=True, help_text="If festival spans multiple days")
    region = models.CharField(max_length=100, blank=True, help_text="Blank means all regions")
    
    # Impact parameters
    impact_days_before = models.IntegerField(default=7, help_text="Days before festival when demand starts")
    impact_days_after = models.IntegerField(default=3, help_text="Days after festival when demand continues")
    demand_multiplier = models.FloatField(default=1.5, help_text="Expected demand multiplier")
    
    # Categories affected
    affected_categories = models.ManyToManyField(Category, blank=True, related_name='festivals')
    
    # Specific products affected (optional)
    affected_products = models.ManyToManyField(Product, blank=True, related_name='festivals')
    
    # Metadata
    is_recurring = models.BooleanField(default=False, help_text="If festival occurs every year")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date']
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['region', 'date']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.date}"
    
    def get_impact_dates(self):
        """Get all dates affected by this festival"""
        start = self.date - timedelta(days=self.impact_days_before)
        end = (self.end_date or self.date) + timedelta(days=self.impact_days_after)
        return [start + timedelta(days=x) for x in range((end - start).days + 1)]

class RegionalDemandPattern(models.Model):
    """Region-wise demand patterns by month"""
    region = models.CharField(max_length=100)
    city = models.CharField(max_length=100, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='regional_patterns')
    
    # Monthly demand multipliers (relative to average)
    jan_demand = models.FloatField(default=1.0)
    feb_demand = models.FloatField(default=1.0)
    mar_demand = models.FloatField(default=1.0)
    apr_demand = models.FloatField(default=1.0)
    may_demand = models.FloatField(default=1.0)
    jun_demand = models.FloatField(default=1.0)
    jul_demand = models.FloatField(default=1.0)
    aug_demand = models.FloatField(default=1.0)
    sep_demand = models.FloatField(default=1.0)
    oct_demand = models.FloatField(default=1.0)
    nov_demand = models.FloatField(default=1.0)
    dec_demand = models.FloatField(default=1.0)
    
    # Base demand (average daily demand)
    base_daily_demand = models.FloatField(default=100.0, help_text="Average daily demand in kg")
    
    # Price sensitivity
    price_elasticity = models.FloatField(default=-0.5, help_text="How demand changes with price")
    
    # Metadata
    population = models.IntegerField(null=True, blank=True, help_text="Regional population")
    income_level = models.CharField(max_length=50, blank=True, choices=[
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
    ])
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['region', 'category']
        indexes = [
            models.Index(fields=['region', 'category']),
        ]
        unique_together = ['region', 'category']
    
    def __str__(self):
        return f"{self.region} - {self.category.name_en}"
    
    def get_monthly_factor(self, month):
        """Get demand factor for specific month"""
        month_factors = {
            1: self.jan_demand,
            2: self.feb_demand,
            3: self.mar_demand,
            4: self.apr_demand,
            5: self.may_demand,
            6: self.jun_demand,
            7: self.jul_demand,
            8: self.aug_demand,
            9: self.sep_demand,
            10: self.oct_demand,
            11: self.nov_demand,
            12: self.dec_demand,
        }
        return month_factors.get(month, 1.0)

class MLModel(models.Model):
    """Track ML models and their performance"""
    MODEL_TYPES = [
        ('DEMAND_PREDICTION', 'Demand Prediction'),
        ('PRICE_OPTIMIZATION', 'Price Optimization'),
        ('CROP_SUGGESTION', 'Crop Suggestion'),
    ]
    
    STATUS_CHOICES = [
        ('TRAINING', 'Training'),
        ('ACTIVE', 'Active'),
        ('DEPRECATED', 'Deprecated'),
        ('FAILED', 'Failed'),
    ]
    
    name = models.CharField(max_length=100)
    model_type = models.CharField(max_length=50, choices=MODEL_TYPES)
    version = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TRAINING')
    
    # Performance metrics
    accuracy = models.FloatField(null=True, blank=True)
    precision = models.FloatField(null=True, blank=True)
    recall = models.FloatField(null=True, blank=True)
    f1_score = models.FloatField(null=True, blank=True)
    mae = models.FloatField(null=True, blank=True, help_text="Mean Absolute Error")
    rmse = models.FloatField(null=True, blank=True, help_text="Root Mean Square Error")
    
    # Training data
    training_start = models.DateTimeField(null=True, blank=True)
    training_end = models.DateTimeField(null=True, blank=True)
    training_data_start = models.DateField(null=True, blank=True)
    training_data_end = models.DateField(null=True, blank=True)
    training_samples = models.IntegerField(default=0)
    
    # Model file (for saved models)
    model_file = models.FileField(upload_to='ml_models/', null=True, blank=True)
    model_config = models.JSONField(default=dict, help_text="Model hyperparameters")
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    description = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['model_type', 'version']
    
    def __str__(self):
        return f"{self.get_model_type_display()} - v{self.version}"

class PredictionLog(models.Model):
    """Log all predictions for auditing and improvement"""
    model = models.ForeignKey(MLModel, on_delete=models.CASCADE, related_name='predictions')
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='predictions')
    
    # Input data
    input_data = models.JSONField(help_text="Features used for prediction")
    
    # Output
    predicted_value = models.FloatField()
    confidence = models.FloatField()
    actual_value = models.FloatField(null=True, blank=True, help_text="For tracking accuracy")
    
    # Context
    prediction_date = models.DateTimeField(auto_now_add=True)
    processing_time_ms = models.IntegerField(help_text="Time taken for prediction")
    
    class Meta:
        ordering = ['-prediction_date']
        indexes = [
            models.Index(fields=['model', 'prediction_date']),
            models.Index(fields=['farmer', 'prediction_date']),
        ]
    
    def __str__(self):
        return f"Prediction by {self.model.name} on {self.prediction_date}"

# Import timedelta for festival impact calculation
from datetime import timedelta