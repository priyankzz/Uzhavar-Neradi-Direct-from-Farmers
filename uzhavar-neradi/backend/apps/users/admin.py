from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTP

class UserAdmin(BaseUserAdmin):
    # Customize which fields appear in admin
    list_display = ('username', 'email', 'phone', 'role', 'is_approved', 'is_staff')
    list_filter = ('role', 'is_approved', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Uzhavar Neradi', {'fields': ('role', 'is_approved', 'approved_at', 'language')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone', 'password1', 'password2', 'role'),
        }),
    )
    search_fields = ('username', 'email', 'phone')
    ordering = ('username',)
    def get_actions(self, request):
        actions = super().get_actions(request)
        if request.user.is_superuser:
            # Delete action is already included by default
            pass
        return actions

    # Optional: add a custom delete action (already exists by default)
    actions = ['delete_selected']  # this is built-in

admin.site.register(User, UserAdmin)

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'created_at', 'is_used')
    list_filter = ('is_used', 'created_at')
    search_fields = ('user__email', 'code')