import requests
import time
import re
from math import radians, cos, sin, asin, sqrt

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "UzhavarNeradi/1.0 (your@email.com)"  # update with your email

def _geocode(query):
    """Internal function: geocode a single query string."""
    params = {'q': query, 'format': 'json', 'limit': 1}
    headers = {'User-Agent': USER_AGENT}
    time.sleep(1)
    try:
        response = requests.get(NOMINATIM_URL, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        if data:
            lat = float(data[0]['lat'])
            lon = float(data[0]['lon'])
            return lat, lon
        else:
            print(f"No results for: {query}")
    except Exception as e:
        print(f"Geocoding error for '{query}': {e}")
    return None, None

import requests
from django.conf import settings

GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"

def geocode_address(address):
    """
    Convert address to (lat, lng) using Google Geocoding API.
    Returns (latitude, longitude) as floats or (None, None) on failure.
    """
    params = {
        'address': address,
        'key': settings.GOOGLE_MAPS_API_KEY
    }
    try:
        response = requests.get(GOOGLE_GEOCODE_URL, params=params)
        response.raise_for_status()
        data = response.json()
        if data['status'] == 'OK':
            location = data['results'][0]['geometry']['location']
            return location['lat'], location['lng']
        else:
            print(f"Geocoding failed: {data['status']}")
    except Exception as e:
        print(f"Geocoding error: {e}")
    return None, None
        
def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great-circle distance between two points
    on the Earth (specified in decimal degrees). Returns distance in km.
    """
    # convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    # Radius of earth in kilometers is 6371
    km = 6371 * c
    return km