/**
 * Shipping Information Page - Bilingual
 * Copy to: frontend/src/components/common/ShippingInfo.tsx
 */

import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const ShippingInfo: React.FC = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isTamil ? 'விநியோக தகவல்' : 'Shipping Information'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? 'விநியோக பகுதிகள்' : 'Delivery Areas'}
          </h2>
          <p className="text-gray-700 mb-6">
            {isTamil ? (
              'நாங்கள் தற்போது தமிழ்நாடு முழுவதும் உள்ள அனைத்து முக்கிய நகரங்கள் மற்றும் நகரங்களுக்கு விநியோகிக்கிறோம். மேலும் கிராமப்புறங்களை அடைய எங்கள் நெட்வொர்க் வேகமாக விரிவடைந்து வருகிறது.'
            ) : (
              'We currently deliver to all major cities and towns across Tamil Nadu. Our network is expanding rapidly to reach more rural areas.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? 'விநியோக கட்டணம்' : 'Delivery Charges'}
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2">
                    {isTamil ? '₹500 க்கு மேல் ஆர்டர் மதிப்பு' : 'Order value above ₹500'}
                  </td>
                  <td className="py-2 font-semibold text-green-600">
                    {isTamil ? 'இலவசம்' : 'FREE'}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">
                    {isTamil ? '₹500 க்கு கீழ் ஆர்டர் மதிப்பு' : 'Order value below ₹500'}
                  </td>
                  <td className="py-2 font-semibold">₹50</td>
                </tr>
                <tr>
                  <td className="py-2">
                    {isTamil ? 'எக்ஸ்பிரஸ் விநியோகம் (24 மணி நேரத்தில்)' : 'Express delivery (within 24 hours)'}
                  </td>
                  <td className="py-2 font-semibold">₹100</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? 'விநியோக நேரம்' : 'Delivery Time'}
          </h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">
              {isTamil ? 'சாதாரண ஆர்டர்கள்: 2-3 வேலை நாட்கள்' : 'Normal orders: 2-3 business days'}
            </li>
            <li className="mb-2">
              {isTamil ? 'முன்-ஆர்டர்கள்: திட்டமிடப்பட்ட தேதியில் விநியோகம்' : 'Pre-orders: Delivered on scheduled date'}
            </li>
            <li className="mb-2">
              {isTamil ? 'எக்ஸ்பிரஸ் விநியோகம்: 24 மணி நேரத்தில் (கிடைக்கும் இடங்களில்)' : 'Express delivery: Within 24 hours (where available)'}
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? 'உங்கள் ஆர்டரை கண்காணித்தல்' : 'Tracking Your Order'}
          </h2>
          <p className="text-gray-700 mb-6">
            {isTamil ? (
              'உங்கள் ஆர்டர் அனுப்பப்பட்டதும், மின்னஞ்சல் மற்றும் எஸ்எம்எஸ் மூலம் கண்காணிப்பு இணைப்பைப் பெறுவீர்கள். உங்கள் டாஷ்போர்டிலிருந்து உங்கள் ஆர்டரை நிகழ்நேரத்தில் கண்காணிக்கவும் முடியும்.'
            ) : (
              'Once your order is shipped, you\'ll receive a tracking link via email and SMS. You can also track your order in real-time from your dashboard.'
            )}
          </p>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              {isTamil ? '⚠️ முக்கிய குறிப்புகள்' : '⚠️ Important Notes'}
            </h3>
            <ul className="list-disc pl-6 text-yellow-800">
              <li>
                {isTamil ? 'பண்டிகை காலங்களில் அல்லது மோசமான வானிலையில் விநியோக நேரம் மாறுபடலாம்' : 'Delivery times may vary during festivals or bad weather'}
              </li>
              <li>
                {isTamil ? 'விவசாயிகள் விநியோக நாளில் பொருட்களை புத்துணர்ச்சியாக பொதியிடுகிறார்கள்' : 'Farmers pack orders fresh on the day of delivery'}
              </li>
              <li>
                {isTamil ? 'முன்-ஆர்டர்களுக்கு, அறுவடை கிடைக்கும் தன்மைக்கு ஏற்ப விநியோகம்' : 'For pre-orders, delivery is subject to harvest availability'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;