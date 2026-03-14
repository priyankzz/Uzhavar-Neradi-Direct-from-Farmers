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

class IsVerifiedUser(permissions.BasePermission):
    """
    Allow access only if the user is verified by admin.
    Admin and Customers are always allowed.
    """

    message = "Your account is not verified by admin yet."

    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        # Admin always allowed
        if user.role == 'ADMIN':
            return True

        # Customer allowed
        if user.role == 'CUSTOMER':
            return True

        # Farmer verification check
        if user.role == 'FARMER':
            profile = getattr(user, 'farmer_profile', None)
            return profile and profile.is_verified

        # Delivery verification check
        if user.role == 'DELIVERY':
            profile = getattr(user, 'delivery_profile', None)
            return profile and profile.is_verified

        return False

class IsVerifiedUser(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_verified