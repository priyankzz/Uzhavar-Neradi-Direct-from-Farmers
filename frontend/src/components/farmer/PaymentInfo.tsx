/**
 * Farmer Payment Information Component
 * Copy to: frontend/src/components/farmer/PaymentInfo.tsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const PaymentInfo: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    accepts_online_payment: false,
    upi_id: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
    accepts_cod: true
  });
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/farmer/profile/', {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });
      setProfile(response.data);
      setFormData({
        accepts_online_payment: response.data.accepts_online_payment || false,
        upi_id: response.data.upi_id || '',
        bank_name: response.data.bank_name || '',
        account_number: response.data.account_number || '',
        ifsc_code: response.data.ifsc_code || '',
        account_holder_name: response.data.account_holder_name || '',
        accepts_cod: response.data.accepts_cod !== false // default to true
      });
      if (response.data.qr_code_image) {
        setQrPreview(response.data.qr_code_image);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleQRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQrFile(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, String(value));
        }
      });

      // Append QR code if uploaded
      if (qrFile) {
        formDataToSend.append('qr_code_image', qrFile);
      }

      const response = await axios.put(
        'http://localhost:8000/api/auth/farmer/profile/',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess(isTamil 
        ? 'கட்டணத் தகவல் வெற்றிகரமாக சேமிக்கப்பட்டது!' 
        : 'Payment information saved successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || (isTamil 
        ? 'சேமிப்பதில் பிழை' 
        : 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isTamil ? 'கட்டணத் தகவல்' : 'Payment Information'}
      </h1>

      {!profile?.is_verified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            ⚠️ {isTamil 
              ? 'உங்கள் சுயவிவரம் சரிபார்க்கப்பட்ட பின்னரே கட்டணத் தகவலைச் சேர்க்க முடியும்' 
              : 'You can add payment information only after your profile is verified'}
          </p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Payment Methods */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {isTamil ? 'கட்டண முறைகள்' : 'Payment Methods'}
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="accepts_online_payment"
                  checked={formData.accepts_online_payment}
                  onChange={handleInputChange}
                  className="mr-3"
                  disabled={!profile?.is_verified}
                />
                <div>
                  <span className="font-medium">
                    {isTamil ? 'ஆன்லைன் கட்டணத்தை ஏற்கவும்' : 'Accept Online Payment'}
                  </span>
                  <p className="text-sm text-gray-500">
                    {isTamil 
                      ? 'UPI, நெட்பேங்கிங், கிரெடிட் கார்டு' 
                      : 'UPI, NetBanking, Credit Card'}
                  </p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="accepts_cod"
                  checked={formData.accepts_cod}
                  onChange={handleInputChange}
                  className="mr-3"
                  disabled={!profile?.is_verified}
                />
                <div>
                  <span className="font-medium">
                    {isTamil ? 'பணம் செலுத்துதலை ஏற்கவும்' : 'Accept Cash on Delivery'}
                  </span>
                  <p className="text-sm text-gray-500">
                    {isTamil 
                      ? 'விநியோகத்தின் போது பணம் செலுத்துதல்' 
                      : 'Cash payment at delivery'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* UPI Section */}
          {formData.accepts_online_payment && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">
                {isTamil ? 'UPI விவரங்கள்' : 'UPI Details'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    {isTamil ? 'UPI ஐடி' : 'UPI ID'}
                  </label>
                  <input
                    type="text"
                    name="upi_id"
                    value={formData.upi_id}
                    onChange={handleInputChange}
                    placeholder="farmer@okhdfcbank"
                    className="input-field"
                    disabled={!profile?.is_verified}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isTamil ? 'எ.கா: farmer@okhdfcbank, farmer@paytm' : 'e.g., farmer@okhdfcbank, farmer@paytm'}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    {isTamil ? 'QR குறியீடு' : 'QR Code'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQRChange}
                    className="input-field"
                    disabled={!profile?.is_verified}
                  />
                  
                  {qrPreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {isTamil ? 'தற்போதைய QR குறியீடு:' : 'Current QR Code:'}
                      </p>
                      <img 
                        src={qrPreview} 
                        alt="QR Code" 
                        className="w-48 h-48 object-contain border rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bank Account Section */}
          {formData.accepts_online_payment && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">
                {isTamil ? 'வங்கி கணக்கு விவரங்கள்' : 'Bank Account Details'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    {isTamil ? 'வங்கியின் பெயர்' : 'Bank Name'}
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    className="input-field"
                    disabled={!profile?.is_verified}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    {isTamil ? 'கணக்கு வைத்திருப்பவரின் பெயர்' : 'Account Holder Name'}
                  </label>
                  <input
                    type="text"
                    name="account_holder_name"
                    value={formData.account_holder_name}
                    onChange={handleInputChange}
                    className="input-field"
                    disabled={!profile?.is_verified}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    {isTamil ? 'கணக்கு எண்' : 'Account Number'}
                  </label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleInputChange}
                    className="input-field"
                    disabled={!profile?.is_verified}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    {isTamil ? 'IFSC குறியீடு' : 'IFSC Code'}
                  </label>
                  <input
                    type="text"
                    name="ifsc_code"
                    value={formData.ifsc_code}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="SBIN0001234"
                    disabled={!profile?.is_verified}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {profile?.is_verified && (
            <div className="border-t pt-6">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-8"
              >
                {saving 
                  ? (isTamil ? 'சேமிக்கிறது...' : 'Saving...')
                  : (isTamil ? 'சேமி' : 'Save Payment Info')}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">
          {isTamil ? 'ℹ️ முக்கிய தகவல்' : 'ℹ️ Important Information'}
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• {isTamil 
            ? 'உங்கள் சுயவிவரம் சரிபார்க்கப்பட்ட பின்னரே கட்டணத் தகவலைச் சேர்க்க முடியும்' 
            : 'Payment information can only be added after profile verification'}
          </li>
          <li>• {isTamil 
            ? 'UPI ஐடி அல்லது வங்கி கணக்கு விவரங்கள் குறைந்தது ஒன்று அவசியம்' 
            : 'At least UPI ID or Bank Account details are required'}
          </li>
          <li>• {isTamil 
            ? 'QR குறியீடு வாடிக்கையாளர்களுக்கு எளிதாக பணம் செலுத்த உதவும்' 
            : 'QR code helps customers pay easily'}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentInfo;