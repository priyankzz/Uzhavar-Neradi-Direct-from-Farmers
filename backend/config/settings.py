"""
Django settings for config project.
Fully secure version using environment variables.
"""

from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv

# Load .env
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ===============================
# SECURITY
# ===============================

SECRET_KEY = os.getenv("SECRET_KEY")

DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

# ===============================
# APPLICATIONS
# ===============================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # Local apps
    'users',
    'products',
    'orders',
    'analytics',
    'admin_panel',
]

MIDDLEWARE = [

    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'config.middleware.RequestLogMiddleware',
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

# ===============================
# TEMPLATES
# ===============================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ===============================
# DATABASE
# ===============================

DATABASES = {
    'default': {
        'ENGINE': os.getenv("DB_ENGINE"),
        'NAME': os.getenv("DB_NAME"),
        'USER': os.getenv("DB_USER"),
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'HOST': os.getenv("DB_HOST"),
        'PORT': os.getenv("DB_PORT"),
    }
}

# ===============================
# PASSWORD VALIDATION
# ===============================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ===============================
# INTERNATIONALIZATION
# ===============================

LANGUAGE_CODE = os.getenv("LANGUAGE_CODE", "en-us")
TIME_ZONE = os.getenv("TIME_ZONE", "UTC")
USE_I18N = True
USE_TZ = True

# ===============================
# STATIC & MEDIA
# ===============================

STATIC_URL = os.getenv("STATIC_URL", "/static/")
STATIC_ROOT = BASE_DIR / os.getenv("STATIC_ROOT", "staticfiles")

MEDIA_URL = os.getenv("MEDIA_URL", "/media/")
MEDIA_ROOT = BASE_DIR / os.getenv("MEDIA_ROOT", "media")

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ===============================
# CUSTOM USER
# ===============================

AUTH_USER_MODEL = os.getenv("AUTH_USER_MODEL", "users.User")

# ===============================
# CORS
# ===============================

CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "False") == "True"
CORS_ALLOW_CREDENTIALS = True

# ===============================
# REST FRAMEWORK
# ===============================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        os.getenv("DEFAULT_AUTH_CLASS"),
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        os.getenv("DEFAULT_PERMISSION_CLASS"),
    ],
    'DEFAULT_PAGINATION_CLASS': os.getenv("DEFAULT_PAGINATION_CLASS"),
    'PAGE_SIZE': int(os.getenv("PAGE_SIZE", 20))
}

# ===============================
# JWT SETTINGS
# ===============================

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=int(os.getenv("ACCESS_TOKEN_LIFETIME", 1))),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=int(os.getenv("REFRESH_TOKEN_LIFETIME", 7))),
    'ROTATE_REFRESH_TOKENS': os.getenv("ROTATE_REFRESH_TOKENS", "False") == "True",
    'BLACKLIST_AFTER_ROTATION': os.getenv("BLACKLIST_AFTER_ROTATION", "True") == "True",
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': os.getenv("JWT_ALGORITHM", "HS256"),
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': (os.getenv("AUTH_HEADER_TYPE", "Bearer"),),
}

# ===============================
# EMAIL
# ===============================

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)