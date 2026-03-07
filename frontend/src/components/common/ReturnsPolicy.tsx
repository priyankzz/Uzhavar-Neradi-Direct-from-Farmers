/**
 * Returns Policy Page - Bilingual
 * Copy to: frontend/src/components/common/ReturnsPolicy.tsx
 */

import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const ReturnsPolicy: React.FC = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isTamil ? 'திருப்பி அனுப்புதல் மற்றும் பணம் திரும்பப் பெறுதல் கொள்கை' : 'Returns & Refund Policy'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? 'தர உத்தரவாதம்' : 'Quality Guarantee'}
          </h2>
          <p className="text-gray-700 mb-6">
            {isTamil ? (
              'உழவர் நேரடியில், எங்கள் பண்ணை-புத்துணர்ச்சி பொருட்களின் தரத்தில் நாங்கள் பெருமை கொள்கிறோம். உங்கள் ஆர்டரில் நீங்கள் திருப்தியடையவில்லை என்றால், நாங்கள் உதவ தயாராக இருக்கிறோம்.'
            ) : (
              'At Uzhavar Neradi, we take pride in the quality of our farm-fresh products. If you\'re not satisfied with your order, we\'re here to help.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? 'திருப்பி அனுப்புதல்' : 'Returns'}
          </h2>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-green-800 mb-2">
              <strong>
                {isTamil ? 'பின்வரும் சந்தர்ப்பங்களில் விநியோகத்திற்குள் 24 மணி நேரத்தில் திருப்பி அனுப்ப கோரலாம்:' : 'You can request a return within 24 hours of delivery if:'}
              </strong>
            </p>
            <ul className="list-disc pl-6 text-green-800">
              <li>{isTamil ? 'பொருள் சேதமடைந்திருந்தால் அல்லது கெட்டிருந்தால்' : 'The product is damaged or spoiled'}</li>
              <li>{isTamil ? 'தவறான பொருள் வழங்கப்பட்டிருந்தால்' : 'Wrong item was delivered'}</li>
              <li>{isTamil ? 'தரம் விளக்கத்துடன் பொருந்தவில்லை என்றால்' : "Quality doesn't match description"}</li>
              <li>{isTamil ? 'ஆர்டர் செய்ததை விட குறைவான அளவு இருந்தால்' : 'Quantity is less than ordered'}</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? 'திருப்பி அனுப்ப முடியாத பொருட்கள்' : 'Non-Returnable Items'}
          </h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>{isTamil ? 'பயன்படுத்தப்பட்ட அல்லது நுகரப்பட்ட பொருட்கள்' : 'Products consumed or used'}</li>
            <li>{isTamil ? 'விநியோகத்திற்குப் பின் 24 மணி நேரத்திற்கு மேலான பொருட்கள்' : 'Items past 24 hours of delivery'}</li>
            <li>{isTamil ? 'தனிப்பயன் அல்லது முன்-ஆர்டர் பொருட்கள் (தர பிரச்சினைகள் தவிர)' : 'Custom or pre-ordered items (except quality issues)'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? 'பணம் திரும்பப் பெறும் செயல்முறை' : 'Refund Process'}
          </h2>
          <ol className="list-decimal pl-6 mb-6 text-gray-700">
            <li className="mb-2">
              {isTamil ? 'விநியோகத்தில் 24 மணி நேரத்திற்குள் எங்களை தொடர்பு கொள்ளவும்' : 'Contact us within 24 hours of delivery'}
            </li>
            <li className="mb-2">
              {isTamil ? 'பிரச்சினையின் புகைப்படங்களைப் பகிரவும் (பொருந்தினால்)' : 'Share photos of the issue (if applicable)'}
            </li>
            <li className="mb-2">
              {isTamil ? 'எங்கள் குழு 24 மணி நேரத்திற்குள் சரிபார்க்கும்' : 'Our team will verify within 24 hours'}
            </li>
            <li className="mb-2">
              {isTamil ? 'அங்கீகரிக்கப்பட்டால், 5-7 வேலை நாட்களில் பணம் திரும்பப் பெறப்படும்' : 'If approved, refund is processed within 5-7 business days'}
            </li>
          </ol>

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">
              {isTamil ? 'உதவி தேவையா?' : 'Need Help?'}
            </h3>
            <p className="text-red-700">
              {isTamil ? 'திருப்பி அனுப்புதல் தொடர்பான கேள்விகளுக்கு எங்கள் ஆதரவு குழுவை தொடர்பு கொள்ளவும்:' : 'Contact our support team for any return-related queries:'}
              <br />
              📞 +91 98765 43210
              <br />
              ✉️ returns@uzhavarneradi.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;