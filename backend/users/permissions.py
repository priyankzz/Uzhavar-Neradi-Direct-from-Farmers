"""
Custom permissions.
Copy to: backend/users/permissions.py
"""

from rest_framework import permissions

class IsFarmer(permissions.BasePermission):
    """Allow access only to farmers"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'FARMER'

class IsCustomer(permissions.BasePermission):
    """Allow access only to customers"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'CUSTOMER'

class IsDeliveryPartner(permissions.BasePermission):
    """Allow access only to delivery partners"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'DELIVERY'

class IsAdmin(permissions.BasePermission):
    """Allow access only to admins"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allow edit only to owner"""
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user