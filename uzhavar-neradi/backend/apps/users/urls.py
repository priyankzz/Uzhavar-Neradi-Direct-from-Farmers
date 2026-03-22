from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginView, UserProfileView
from .views import AllUsersView, UserDetailUpdateDeleteView, UpdateFarmerUPIView, UserProfileUpdateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('all/', AllUsersView.as_view(), name='all-users'),
    path('<int:pk>/', UserDetailUpdateDeleteView.as_view(), name='user-detail'),
    path('update-upi/', UpdateFarmerUPIView.as_view(), name='update-upi'),
    path('update-profile/', UserProfileUpdateView.as_view(), name='update-profile'),
]