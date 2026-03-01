"""
Admin Panel Admin Configuration.
Copy to: backend/admin_panel/admin.py
"""

from django.contrib import admin
from .models import (
    PlatformSettings, PlatformLogo, MiddlemanFlag,
    Dispute, DisputeMessage, AuditLog, Announcement
)

@admin.register(PlatformSettings)
class PlatformSettingsAdmin(admin.ModelAdmin):
    list_display = ['key', 'value', 'is_public', 'updated_at']
    list_filter = ['is_public']
    search_fields = ['key', 'value']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(PlatformLogo)
class PlatformLogoAdmin(admin.ModelAdmin):
    list_display = ['id', 'is_active', 'uploaded_by', 'uploaded_at']
    list_filter = ['is_active']
    readonly_fields = ['uploaded_at']

@admin.register(MiddlemanFlag)
class MiddlemanFlagAdmin(admin.ModelAdmin):
    list_display = ['user', 'flag_type', 'status', 'created_at']
    list_filter = ['flag_type', 'status']
    search_fields = ['user__username', 'user__email', 'description']
    readonly_fields = ['created_at', 'updated_at']
    raw_id_fields = ['user', 'investigated_by']

@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ['dispute_id', 'title', 'dispute_type', 'status', 'raised_by', 'created_at']
    list_filter = ['dispute_type', 'status']
    search_fields = ['dispute_id', 'title', 'raised_by__username']
    readonly_fields = ['dispute_id', 'created_at', 'updated_at', 'resolved_at']
    raw_id_fields = ['raised_by', 'against_user', 'assigned_to', 'resolved_by', 'order']

@admin.register(DisputeMessage)
class DisputeMessageAdmin(admin.ModelAdmin):
    list_display = ['dispute', 'sender', 'created_at', 'is_staff_only']
    list_filter = ['is_staff_only']
    readonly_fields = ['created_at']
    raw_id_fields = ['dispute', 'sender']

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action_type', 'content_type', 'object_repr', 'timestamp']
    list_filter = ['action_type', 'content_type']
    search_fields = ['user__username', 'object_repr']
    readonly_fields = ['timestamp']
    raw_id_fields = ['user']

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'is_active', 'publish_from', 'created_at']
    list_filter = ['priority', 'is_active', 'target_roles']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'updated_at']
    raw_id_fields = ['created_by']