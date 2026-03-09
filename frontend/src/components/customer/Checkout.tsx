/**
 * Checkout Component - Dynamic Delivery Fee
 * Copy to: frontend/src/components/customer/Checkout.tsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

interface FarmerInfo {
  delivery_fee: number;
  free_delivery_min_amount: number | null;
  accepts_online_payment: boolean;
  accepts_cod: boolean;
  upi_id: string | null;
  qr_code_image: string | null;
  farm_pickup_address: string;
  pickup_available: boolean;
  delivery_available: boolean;
}

const Checkout: React.FC = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isTamil = language === 'ta';

  const [formData, setFormData] = useState({
    delivery_address: '',
    delivery_instructions: '',
    payment_method: 'COD',
    order_type: 'NORMAL' as 'NORMAL' | 'PICKUP',
    scheduled_date: '',
    pickup_location: ''
  });

  const [farmerInfo, setFarmerInfo] = useState<FarmerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Get delivery fee from cart state if passed
  const passedDeliveryFee = location.state?.deliveryFee;

  useEffect(() => {
  const fetchFarmerInfo = async () => {
    if (items.length === 0) return;

    try {
      // Get unique farmer IDs from cart items
      const farmerIds = Array.from(new Set(items.map(item => item.farmer_id)));
      
      // For now, use the first farmer (assuming all items from same farmer)
      const farmerId = farmerIds[0];
      
      // Fetch farmer's profile to get delivery settings
      const response = await axios.get(
        `http://localhost:8000/api/auth/farmer/profile/?user_id=${farmerId}`,
        {
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        }
      );

      const farmer = response.data;
      
      // ✅ Use passed delivery fee from cart if available, otherwise from API
      const deliveryFee = passedDeliveryFee !== undefined 
        ? passedDeliveryFee 
        : (Number(farmer.delivery_fee) || 50);
      
      setFarmerInfo({
        delivery_fee: deliveryFee,
        free_delivery_min_amount: farmer.free_delivery_min_amount ? Number(farmer.free_delivery_min_amount) : null,
        accepts_online_payment: farmer.accepts_online_payment || false,
        accepts_cod: farmer.accepts_cod !== false,
        upi_id: farmer.upi_id,
        qr_code_image: farmer.qr_code_image,
        farm_pickup_address: farmer.farm_pickup_address || '',
        pickup_available: farmer.pickup_available !== false,
        delivery_available: farmer.delivery_available !== false
      });
    } catch (error) {
      console.error('Failed to fetch farmer info:', error);
      // Use passed delivery fee as fallback
      setFarmerInfo({
        delivery_fee: passedDeliveryFee || 50,
        free_delivery_min_amount: null,
        accepts_online_payment: false,
        accepts_cod: true,
        upi_id: null,
        qr_code_image: null,
        farm_pickup_address: '',
        pickup_available: true,
        delivery_available: true
      });
    } finally {
      setLoading(false);
    }
  };

  fetchFarmerInfo();
}, [items, passedDeliveryFee]);

  // Calculate delivery fee based on farmer's settings
  const calculateDeliveryFee = () => {
    if (!farmerInfo) return 0;
    if (formData.order_type === 'PICKUP') return 0;
    
    const subtotal = Number(getCartTotal());
    
    // Check if free delivery applies
    if (farmerInfo.free_delivery_min_amount && 
        subtotal >= farmerInfo.free_delivery_min_amount) {
      return 0;
    }
    
    return farmerInfo.delivery_fee;
  };

  const subtotal = Number(getCartTotal());
  const deliveryFee = calculateDeliveryFee();
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + deliveryFee + tax).toFixed(2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!farmerInfo) {
      setError(isTamil ? 'விவசாயி தகவல் கிடைக்கவில்லை' : 'Farmer information not available');
      return;
    }

    // Validate payment method
    if (formData.payment_method === 'ONLINE' && !farmerInfo.accepts_online_payment) {
      setError(isTamil 
        ? 'இந்த விவசாயி ஆன்லைன் கட்டணத்தை ஏற்கவில்லை' 
        : 'This farmer does not accept online payment');
      return;
    }

    if (formData.payment_method === 'COD' && !farmerInfo.accepts_cod) {
      setError(isTamil 
        ? 'இந்த விவசாயி பணம் செலுத்துதலை ஏற்கவில்லை' 
        : 'This farmer does not accept COD');
      return;
    }

    // Validate order type
    if (formData.order_type === 'PICKUP' && !farmerInfo.pickup_available) {
      setError(isTamil 
        ? 'இந்த விவசாயி பண்ணையில் எடுத்துச் செல்லலை ஆதரிக்கவில்லை' 
        : 'This farmer does not support farm pickup');
      return;
    }

    if (formData.order_type === 'NORMAL' && !farmerInfo.delivery_available) {
      setError(isTamil 
        ? 'இந்த விவசாயி விநியோகத்தை ஆதரிக்கவில்லை' 
        : 'This farmer does not support delivery');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderItems = items.map(item => ({
        product: item.product_id,
        quantity: item.quantity
      }));

      const orderData = {
        ...formData,
        items: orderItems,
        delivery_fee: deliveryFee, // Send the calculated delivery fee
        total_amount: total
      };

      const response = await axios.post('http://localhost:8000/api/orders/create/', orderData, {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });

      if (response.data) {
        clearCart();
        
        if (formData.payment_method === 'ONLINE' && farmerInfo.upi_id) {
          setShowQR(true);
        } else if (formData.payment_method === 'ONLINE' && !farmerInfo.upi_id) {
          navigate(`/payment/${response.data.id}`);
        } else {
          navigate('/orders', { state: { message: 'Order placed successfully!' } });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isTamil ? 'செக்-அவுட்' : 'Checkout'}
      </h1>
      
      {/* QR Code Modal */}
      {showQR && farmerInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {isTamil ? 'UPI QR குறியீடு' : 'UPI QR Code'}
            </h2>
            
            {farmerInfo.qr_code_image ? (
              <img 
                src={farmerInfo.qr_code_image} 
                alt="Farmer QR Code"
                className="w-64 h-64 mx-auto my-4"
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {isTamil ? 'QR குறியீடு இல்லை' : 'No QR Code'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  UPI ID: {farmerInfo.upi_id}
                </p>
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowQR(false);
                  navigate('/orders');
                }}
                className="btn-primary flex-1"
              >
                {isTamil ? 'நான் பணம் செலுத்திவிட்டேன்' : 'I have paid'}
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="btn-secondary flex-1"
              >
                {isTamil ? 'ரத்து செய்' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Order Type Selection */}
            {farmerInfo && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  {isTamil ? 'ஆர்டர் வகை' : 'Order Type'}
                </h2>
                <div className="flex gap-4">
                  {farmerInfo.delivery_available && (
                    <label className="flex items-center p-3 border rounded hover:bg-gray-50 flex-1">
                      <input
                        type="radio"
                        name="order_type"
                        value="NORMAL"
                        checked={formData.order_type === 'NORMAL'}
                        onChange={(e) => setFormData({...formData, order_type: e.target.value as 'NORMAL' | 'PICKUP'})}
                        className="mr-2"
                      />
                      <div>
                        <span className="font-medium">{isTamil ? 'விநியோகம்' : 'Delivery'}</span>
                        <p className="text-xs text-gray-500">
                          ₹{farmerInfo.delivery_fee} {isTamil ? 'கட்டணம்' : 'fee'}
                        </p>
                      </div>
                    </label>
                  )}
                  
                  {farmerInfo.pickup_available && (
                    <label className="flex items-center p-3 border rounded hover:bg-gray-50 flex-1">
                      <input
                        type="radio"
                        name="order_type"
                        value="PICKUP"
                        checked={formData.order_type === 'PICKUP'}
                        onChange={(e) => setFormData({...formData, order_type: e.target.value as 'NORMAL' | 'PICKUP'})}
                        className="mr-2"
                      />
                      <div>
                        <span className="font-medium">{isTamil ? 'பண்ணையில் எடுக்க' : 'Farm Pickup'}</span>
                        <p className="text-xs text-gray-500">
                          {isTamil ? 'இலவசம்' : 'Free'}
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Address - Only for delivery orders */}
            {formData.order_type === 'NORMAL' && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  {isTamil ? 'விநியோக முகவரி' : 'Delivery Address'}
                </h2>
                <textarea
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
                  placeholder={isTamil ? 'உங்கள் முழுமையான முகவரியை உள்ளிடவும்' : 'Enter your complete address'}
                  className="input-field"
                  rows={3}
                  required={formData.order_type === 'NORMAL'}
                />
              </div>
            )}

            {/* Pickup Address - Only for pickup orders */}
            {formData.order_type === 'PICKUP' && farmerInfo && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  {isTamil ? 'பண்ணை முகவரி' : 'Farm Address'}
                </h2>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800">{farmerInfo.farm_pickup_address}</p>
                  <p className="text-sm text-green-600 mt-2">
                    {isTamil 
                      ? 'இந்த முகவரியில் உங்கள் பொருட்களை எடுத்துக் கொள்ளலாம்' 
                      : 'You can pick up your items at this address'}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Method */}
            {farmerInfo && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  {isTamil ? 'கட்டண முறை' : 'Payment Method'}
                </h2>
                <div className="space-y-2">
                  {farmerInfo.accepts_online_payment && (
                    <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment_method"
                        value="ONLINE"
                        checked={formData.payment_method === 'ONLINE'}
                        onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium">{isTamil ? 'ஆன்லைன் கட்டணம்' : 'Online Payment'}</span>
                        <p className="text-sm text-gray-500">
                          {farmerInfo.upi_id 
                            ? (isTamil ? 'UPI QR ஸ்கேன் செய்து பணம் செலுத்தவும்' : 'Scan UPI QR to pay')
                            : (isTamil ? 'ரேஸர்பே மூலம் பணம் செலுத்தவும்' : 'Pay via Razorpay')}
                        </p>
                      </div>
                    </label>
                  )}
                  
                  {farmerInfo.accepts_cod && (
                    <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment_method"
                        value="COD"
                        checked={formData.payment_method === 'COD'}
                        onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium">{isTamil ? 'பணம் செலுத்துதல்' : 'Cash on Delivery'}</span>
                        <p className="text-sm text-gray-500">
                          {isTamil ? 'பொருளைப் பெறும்போது பணம் செலுத்தவும்' : 'Pay when you receive the order'}
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg"
            >
              {loading 
                ? (isTamil ? 'ஆர்டர் செயலாக்கப்படுகிறது...' : 'Processing...')
                : (isTamil ? 'ஆர்டரை உறுதி செய்' : 'Place Order')}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">
              {isTamil ? 'ஆர்டர் சுருக்கம்' : 'Order Summary'}
            </h2>
            
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>{isTamil ? 'மொத்தம்' : 'Subtotal'}</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              {formData.order_type === 'NORMAL' && (
                <div className="flex justify-between">
                  <span>{isTamil ? 'விநியோக கட்டணம்' : 'Delivery Fee'}</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                    {deliveryFee === 0 
                      ? (isTamil ? 'இலவசம்' : 'FREE') 
                      : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              )}
              
              {farmerInfo?.free_delivery_min_amount && 
               subtotal < farmerInfo.free_delivery_min_amount && 
               formData.order_type === 'NORMAL' && (
                <div className="text-xs text-gray-500">
                  {isTamil 
                    ? `இலவச விநியோகத்திற்கு மேலும் ₹${(farmerInfo.free_delivery_min_amount - subtotal).toFixed(2)} சேர்க்கவும்`
                    : `Add ₹${(farmerInfo.free_delivery_min_amount - subtotal).toFixed(2)} more for free delivery`}
                </div>
              )}
              
              <div className="flex justify-between">
                <span>{isTamil ? 'வரி (5%)' : 'Tax (5%)'}</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>{isTamil ? 'மொத்த தொகை' : 'Total'}</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;