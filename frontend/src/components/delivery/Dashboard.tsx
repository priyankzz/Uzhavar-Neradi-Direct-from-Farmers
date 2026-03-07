/**
 * Delivery Partner Dashboard Component - Complete Bilingual
 * Copy to: frontend/src/components/delivery/Dashboard.tsx
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface DeliveryStats {
  totalDeliveries: number;
  completedToday: number;
  pendingDeliveries: number;
  totalEarnings: number;
  averageRating: number;
}

interface ActiveDelivery {
  id: number;
  order_number: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  status: string;
  estimated_delivery_time: string;
  total_amount: number;
  items: Array<{
    product_name: string;
    quantity: number;
  }>;
}

const DeliveryDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  
  const [stats, setStats] = useState<DeliveryStats>({
    totalDeliveries: 0,
    completedToday: 0,
    pendingDeliveries: 0,
    totalEarnings: 0,
    averageRating: 0
  });
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');

  // Tamil translations
  const t = {
    welcome: isTamil ? 'மீண்டும் வரவேற்கிறோம்' : 'Welcome back',
    welcomeDesc: isTamil 
      ? 'உங்கள் விநியோகங்களை நிர்வகிக்கவும், உங்கள் வருவாயை கண்காணிக்கவும்.' 
      : 'Manage your deliveries and track your earnings here.',
    locationActive: isTamil ? 'இருப்பிடம் பகிர்வு செயலில் உள்ளது' : 'Location sharing active',
    locationUnavailable: isTamil ? 'இருப்பிடம் பகிர்வு கிடைக்கவில்லை' : 'Location sharing unavailable',
    enableLocation: isTamil ? 'இருப்பிடத்தை இயக்கு' : 'Enable Location',
    lat: isTamil ? 'அகலாங்கு' : 'Lat',
    lng: isTamil ? 'நெட்டாங்கு' : 'Lng',
    totalDeliveries: isTamil ? 'மொத்த விநியோகங்கள்' : 'Total Deliveries',
    completedToday: isTamil ? 'இன்று முடிந்தவை' : 'Completed Today',
    pending: isTamil ? 'நிலுவையில்' : 'Pending',
    todayEarnings: isTamil ? 'இன்றைய வருவாய்' : "Today's Earnings",
    averageRating: isTamil ? 'சராசரி மதிப்பீடு' : 'Average Rating',
    viewAssignments: isTamil ? 'பணிகளைக் காண்க' : 'View Assignments',
    viewAssignmentsDesc: isTamil ? 'நிலுவையில் உள்ள விநியோக கோரிக்கைகளைப் பார்க்கவும்' : 'See all pending delivery requests',
    performance: isTamil ? 'செயல்திறன்' : 'Performance',
    onTimeDelivery: isTamil ? 'சரியான நேர விநியோகம்' : 'On-time delivery',
    activeDeliveries: isTamil ? 'செயலில் உள்ள விநியோகங்கள்' : 'Active Deliveries',
    noActiveDeliveries: isTamil ? 'செயலில் உள்ள விநியோகங்கள் இல்லை' : 'No active deliveries',
    checkAssignments: isTamil ? 'புதிய விநியோக கோரிக்கைகளுக்கு பணிகளைச் சரிபார்க்கவும்' : 'Check assignments for new delivery requests',
    deliveryTips: isTamil ? 'விநியோக உதவிக்குறிப்புகள்' : 'Delivery Tips',
    tip1: isTamil ? 'பொருளை ஒப்படைக்கும் முன் வாடிக்கையாளர் அடையாளத்தை எப்போதும் சரிபார்க்கவும்' : 'Always verify customer identity before handing over the order',
    tip2: isTamil ? 'துல்லியமான கண்காணிப்புக்கு நிலையை உடனுக்குடன் புதுப்பிக்கவும்' : 'Update status promptly for accurate tracking',
    tip3: isTamil ? 'சிறந்த பாதை மேம்படுத்தலுக்கு உங்கள் இருப்பிடப் பகிர்வை இயக்கத்தில் வைத்திருங்கள்' : 'Keep your location sharing on for better route optimization',
    tip4: isTamil ? 'விநியோகத்தில் ஏதேனும் சிக்கல் இருந்தால் ஆதரவைத் தொடர்பு கொள்ளவும்' : 'Contact support if you face any issues with delivery',
    updateStatus: isTamil ? 'நிலையைப் புதுப்பிக்க' : 'Update Status',
    navigate: isTamil ? 'வழிசெலுத்தல்' : 'Navigate',
    orderNo: isTamil ? 'ஆர்டர் எண்' : 'Order #',
    deliveryAddress: isTamil ? 'விநியோக முகவரி' : 'Delivery Address',
    contact: isTamil ? 'தொடர்பு' : 'Contact',
    items: isTamil ? 'பொருட்கள்' : 'Items',
    today: isTamil ? 'இன்று' : 'Today'
  };

  useEffect(() => {
    fetchDashboardData();
    getCurrentLocation();
    
    // Refresh location every 30 seconds
    const locationInterval = setInterval(updateLocation, 30000);
    
    return () => clearInterval(locationInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch assigned deliveries
      const deliveriesResponse = await axios.get(
        'http://localhost:8000/api/orders/delivery/assignments/',
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );

      const deliveries = deliveriesResponse.data.results || deliveriesResponse.data;
      
      // Calculate stats
      const today = new Date().toDateString();
      const completedToday = deliveries.filter((d: any) => 
        d.status === 'DELIVERED' && 
        new Date(d.updated_at).toDateString() === today
      ).length;

      const pendingDeliveries = deliveries.filter((d: any) => 
        ['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(d.status)
      ).length;

      setStats({
        totalDeliveries: deliveries.length,
        completedToday,
        pendingDeliveries,
        totalEarnings: completedToday * 50, // ₹50 per delivery
        averageRating: 4.8
      });

      // Set active deliveries (pending and in-progress)
      setActiveDeliveries(deliveries.filter((d: any) => 
        ['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(d.status)
      ));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError(isTamil ? 'உங்கள் இருப்பிடத்தைப் பெற முடியவில்லை' : 'Unable to get your location');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError(isTamil ? 'உங்கள் உலாவி இருப்பிடத்தை ஆதரிக்கவில்லை' : 'Geolocation is not supported by your browser');
    }
  };

  const updateLocation = async () => {
    if (currentLocation) {
      try {
        await axios.post(
          'http://localhost:8000/api/users/delivery/location/',
          currentLocation,
          {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }
        );
      } catch (error) {
        console.error('Failed to update location:', error);
      }
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': isTamil ? 'நிலுவையில்' : 'Pending',
      'ACCEPTED': isTamil ? 'ஏற்றுக்கொள்ளப்பட்டது' : 'Accepted',
      'PICKED_UP': isTamil ? 'எடுக்கப்பட்டது' : 'Picked Up',
      'OUT_FOR_DELIVERY': isTamil ? 'விநியோகத்திற்கு' : 'Out for Delivery',
      'DELIVERED': isTamil ? 'விநியோகிக்கப்பட்டது' : 'Delivered',
      'REJECTED': isTamil ? 'நிராகரிக்கப்பட்டது' : 'Rejected'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-blue-100 text-blue-800',
      'PICKED_UP': 'bg-indigo-100 text-indigo-800',
      'OUT_FOR_DELIVERY': 'bg-orange-100 text-orange-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {t.welcome}, {user?.username}! 🚚
        </h1>
        <p className="text-blue-100">
          {t.welcomeDesc}
        </p>
      </div>

      {/* Location Status */}
      <div className={`mb-6 p-4 rounded-lg ${
        currentLocation ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">📍</span>
            <div>
              <p className="font-medium">
                {currentLocation ? t.locationActive : t.locationUnavailable}
              </p>
              {currentLocation ? (
                <p className="text-sm text-gray-600">
                  {t.lat}: {currentLocation.lat.toFixed(6)}, {t.lng}: {currentLocation.lng.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-yellow-700">{locationError || t.locationUnavailable}</p>
              )}
            </div>
          </div>
          {!currentLocation && (
            <button
              onClick={getCurrentLocation}
              className="btn-primary text-sm"
            >
              {t.enableLocation}
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">📦</div>
          <div className="text-xl font-bold">{stats.totalDeliveries}</div>
          <div className="text-xs text-gray-600">{t.totalDeliveries}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-xl font-bold">{stats.completedToday}</div>
          <div className="text-xs text-gray-600">{t.completedToday}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">⏳</div>
          <div className="text-xl font-bold">{stats.pendingDeliveries}</div>
          <div className="text-xs text-gray-600">{t.pending}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-xl font-bold">₹{stats.totalEarnings}</div>
          <div className="text-xs text-gray-600">{t.todayEarnings}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-xl font-bold">{stats.averageRating}</div>
          <div className="text-xs text-gray-600">{t.averageRating}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/delivery/assignments" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex items-center">
          <div className="text-4xl mr-4">📋</div>
          <div>
            <h3 className="font-semibold text-lg">{t.viewAssignments}</h3>
            <p className="text-gray-600 text-sm">{t.viewAssignmentsDesc}</p>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="text-4xl mr-4">📊</div>
          <div>
            <h3 className="font-semibold text-lg">{t.performance}</h3>
            <p className="text-gray-600 text-sm">{t.onTimeDelivery}: 98%</p>
          </div>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t.activeDeliveries}</h2>
        
        {activeDeliveries.length > 0 ? (
          <div className="space-y-4">
            {activeDeliveries.map((delivery) => (
              <div key={delivery.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono text-sm text-gray-500">
                      {t.orderNo} {delivery.order_number}
                    </p>
                    <p className="font-semibold">{delivery.customer_name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(delivery.status)}`}>
                    {getStatusText(delivery.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-500">{t.deliveryAddress}</p>
                    <p className="text-sm">{delivery.customer_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t.contact}</p>
                    <p className="text-sm">{delivery.customer_phone}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{t.items}:</p>
                    <p className="text-sm">
                      {delivery.items.map(item => `${item.product_name} x${item.quantity}`).join(', ')}
                    </p>
                  </div>
                  <p className="font-bold text-green-600">₹{delivery.total_amount}</p>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/delivery/assignments/${delivery.id}`}
                    className="btn-primary text-sm"
                  >
                    {t.updateStatus}
                  </Link>
                  <button
                    onClick={() => {
                      const address = encodeURIComponent(delivery.customer_address);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                    }}
                    className="btn-secondary text-sm"
                  >
                    {t.navigate}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-3">🚚</p>
            <p>{t.noActiveDeliveries}</p>
            <p className="text-sm mt-2">{t.checkAssignments}</p>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">{t.deliveryTips}</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• {t.tip1}</li>
          <li>• {t.tip2}</li>
          <li>• {t.tip3}</li>
          <li>• {t.tip4}</li>
        </ul>
      </div>
    </div>
  );
};

export default DeliveryDashboard;