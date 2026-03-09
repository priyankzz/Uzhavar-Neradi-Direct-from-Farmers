// components/farmer/PaymentSettings.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import { BanknotesIcon, CreditCardIcon, QrCodeIcon } from '@heroicons/react/24/outline';



interface PaymentMethod {
  type: 'upi' | 'bank' | 'qr';
  details: any;
  isDefault: boolean;
}

export default function PaymentSettings({ farmerId }: { farmerId: string }) {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: ''
  });
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState('');
  const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

  useEffect(() => {
    loadPaymentSettings();
  }, [farmerId]);

  const loadPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('farmers')
        .select('payment_methods, upi_id, bank_account_number, bank_ifsc_code, bank_name, account_holder_name, qr_code_url')
        .eq('id', farmerId)
        .single();

      if (error) throw error;

      if (data) {
        setUpiId(data.upi_id || '');
        setBankDetails({
          accountNumber: data.bank_account_number || '',
          ifscCode: data.bank_ifsc_code || '',
          bankName: data.bank_name || '',
          accountHolderName: data.account_holder_name || ''
        });
        setPaymentMethods(data.payment_methods || []);
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
      toast.error('Failed to load payment settings');
    }
  };

  const handleUpiSubmit = async () => {
    if (!upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    // Basic UPI ID validation
    const upiRegex = /^[\w\.\-]+@[\w\.\-]+$/;
    if (!upiRegex.test(upiId)) {
      toast.error('Invalid UPI ID format');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('farmers')
        .update({ 
          upi_id: upiId,
          payment_methods: [...paymentMethods.filter(m => m.type !== 'upi'), 
            { type: 'upi', details: { upiId }, isDefault: paymentMethods.length === 0 }]
        })
        .eq('id', farmerId);

      if (error) throw error;
      toast.success('UPI ID saved successfully');
      loadPaymentSettings();
    } catch (error) {
      console.error('Error saving UPI ID:', error);
      toast.error('Failed to save UPI ID');
    } finally {
      setLoading(false);
    }
  };

  const handleBankSubmit = async () => {
    if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.bankName || !bankDetails.accountHolderName) {
      toast.error('Please fill all bank details');
      return;
    }

    // Basic IFSC validation
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(bankDetails.ifscCode)) {
      toast.error('Invalid IFSC code format');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('farmers')
        .update({
          bank_account_number: bankDetails.accountNumber,
          bank_ifsc_code: bankDetails.ifscCode,
          bank_name: bankDetails.bankName,
          account_holder_name: bankDetails.accountHolderName,
          payment_methods: [...paymentMethods.filter(m => m.type !== 'bank'),
            { type: 'bank', details: bankDetails, isDefault: paymentMethods.length === 0 }]
        })
        .eq('id', farmerId);

      if (error) throw error;
      toast.success('Bank details saved successfully');
      loadPaymentSettings();
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast.error('Failed to save bank details');
    } finally {
      setLoading(false);
    }
  };

  const handleQrUpload = async () => {
    if (!qrCode) {
      toast.error('Please select a QR code image');
      return;
    }

    setLoading(true);
    try {
      const fileExt = qrCode.name.split('.').pop();
      const fileName = `qr-codes/${farmerId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-qr-codes')
        .upload(fileName, qrCode);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-qr-codes')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('farmers')
        .update({
          qr_code_url: publicUrl,
          payment_methods: [...paymentMethods.filter(m => m.type !== 'qr'),
            { type: 'qr', details: { url: publicUrl }, isDefault: paymentMethods.length === 0 }]
        })
        .eq('id', farmerId);

      if (updateError) throw updateError;
      toast.success('QR code uploaded successfully');
      loadPaymentSettings();
    } catch (error) {
      console.error('Error uploading QR code:', error);
      toast.error('Failed to upload QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Payment Settings</h2>
      
      {/* UPI Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCardIcon className="h-5 w-5 mr-2 text-green-600" />
          UPI Payment
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g., farmer@okhdfcbank"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleUpiSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save UPI ID'}
          </button>
        </div>
      </div>

      {/* Bank Account Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BanknotesIcon className="h-5 w-5 mr-2 text-green-600" />
          Bank Account
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Holder Name
            </label>
            <input
              type="text"
              value={bankDetails.accountHolderName}
              onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IFSC Code
            </label>
            <input
              type="text"
              value={bankDetails.ifscCode}
              onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value.toUpperCase()})}
              placeholder="e.g., HDFC0001234"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={handleBankSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Bank Details'}
          </button>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <QrCodeIcon className="h-5 w-5 mr-2 text-green-600" />
          QR Code
        </h3>
        <div className="space-y-4">
          {qrPreview && (
            <div className="mb-4">
              <img src={qrPreview} alt="QR Code Preview" className="h-32 w-32 object-contain" />
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setQrCode(e.target.files[0]);
                  setQrPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="w-full"
            />
          </div>
          <button
            onClick={handleQrUpload}
            disabled={loading || !qrCode}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload QR Code'}
          </button>
        </div>
      </div>
    </div>
  );
}