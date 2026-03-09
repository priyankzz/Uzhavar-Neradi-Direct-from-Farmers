"""
URL configuration for config project.
Copy to: backend/config/urls.py
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include, re_path  
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/admin/', include('admin_panel.urls')),
    re_path(r'^placeholder-product\.jpg$', RedirectView.as_view(
        url='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50%%\' y=\'50%%\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-size=\'50\'%3E📦%3C/text%3E%3C/svg%3E',
        permanent=False
    )),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)