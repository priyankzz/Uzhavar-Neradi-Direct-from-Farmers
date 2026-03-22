from django.contrib import admin
from .models import DeliveryAssignment

@admin.register(DeliveryAssignment)
class DeliveryAssignmentAdmin(admin.ModelAdmin):
    list_display = ('order', 'delivery_partner', 'assigned_at', 'delivered_at')
    list_filter = ('delivery_partner', 'assigned_at')
    search_fields = ('order__id', 'delivery_partner__username')