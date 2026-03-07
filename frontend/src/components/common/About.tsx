/**
 * About Us Page - Bilingual
 * Copy to: frontend/src/components/common/About.tsx
 */

import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const About: React.FC = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isTamil ? 'எங்களைப் பற்றி' : 'About Uzhavar Neradi'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Uzhavar Neradi" className="h-24" />
        </div>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-4">
            {isTamil ? (
              <>
                <strong>உழவர் நேரடி</strong> என்றால் "விவசாயிகளிடமிருந்து நேரடியாக" என்று பொருள். 
                எங்கள் தளம் ஒரே நோக்கத்துடன் கட்டமைக்கப்பட்டுள்ளது: நுகர்வோரை நேரடியாக விவசாயிகளுடன் 
                இணைப்பது, இடைத்தரகர்களை நீக்கி இரு தரப்பினருக்கும் நியாயமான விலையை உறுதி செய்வது.
              </>
            ) : (
              <>
                <strong>Uzhavar Neradi (உழவர் நேரடி)</strong> means "Direct from Farmers" in Tamil. 
                Our platform is built with a single mission: to connect consumers directly with farmers, 
                eliminating middlemen and ensuring fair prices for both parties.
              </>
            )}
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">
            {isTamil ? 'எங்கள் நோக்கம்' : 'Our Mission'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'தமிழ்நாட்டு விவசாயிகளுக்கு நேரடி டிஜிட்டல் சந்தையை வழங்குவதன் மூலம் அவர்களை மேம்படுத்துவதே எங்கள் நோக்கம். இது அவர்களின் விளைபொருட்களை நியாயமான விலையில் விற்கவும், நுகர்வோருக்கு புத்துணர்ச்சியான, தரமான விவசாய பொருட்களை நேரடி மூலத்திலிருந்து பெறவும் உதவுகிறது.'
            ) : (
              'To empower Tamil Nadu\'s farmers by providing them with a direct digital marketplace where they can sell their produce at fair prices, while offering consumers access to fresh, quality agricultural products directly from the source.'
            )}
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">
            {isTamil ? 'நாம் என்ன செய்கிறோம்' : 'What We Do'}
          </h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              {isTamil ? 'விவசாயிகளை நேரடியாக நுகர்வோருடன் இணைக்கிறோம்' : 'Connect farmers directly with consumers'}
            </li>
            <li className="mb-2">
              {isTamil ? 'நியாயமான விலையை உறுதி செய்ய இடைத்தரகர்களை நீக்குகிறோம்' : 'Eliminate middlemen to ensure fair pricing'}
            </li>
            <li className="mb-2">
              {isTamil ? 'விவசாயிகளுக்கு AI-இயங்கும் தேவை நுண்ணறிவுகளை வழங்குகிறோம்' : 'Provide AI-powered demand insights to farmers'}
            </li>
            <li className="mb-2">
              {isTamil ? 'உணவு விரயத்தை குறைக்க முன்-ஆர்டர்களை செயல்படுத்துகிறோம்' : 'Enable pre-orders to reduce food waste'}
            </li>
            <li className="mb-2">
              {isTamil ? 'அணுகல்தன்மைக்காக முதலில் தமிழ் மொழியை ஆதரிக்கிறோம்' : 'Support Tamil language first for accessibility'}
            </li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">
            {isTamil ? 'எங்கள் மதிப்புகள்' : 'Our Values'}
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">
                {isTamil ? '🌱 நியாய வர்த்தகம்' : '🌱 Fair Trade'}
              </h3>
              <p className="text-sm text-green-700">
                {isTamil ? 'விவசாயிகளுக்கு நியாய விலை உறுதி' : 'Ensuring farmers get fair prices'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">
                {isTamil ? '🤝 நம்பிக்கை' : '🤝 Trust'}
              </h3>
              <p className="text-sm text-green-700">
                {isTamil ? 'சரிபார்க்கப்பட்ட விவசாயிகள், தரமான பொருட்கள்' : 'Verified farmers, quality products'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">
                {isTamil ? '🌾 புத்துணர்ச்சி' : '🌾 Freshness'}
              </h3>
              <p className="text-sm text-green-700">
                {isTamil ? 'பண்ணையிலிருந்து நேரடியாக மேசைக்கு' : 'Direct from farm to table'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">
                {isTamil ? '💚 நிலைத்தன்மை' : '💚 Sustainability'}
              </h3>
              <p className="text-sm text-green-700">
                {isTamil ? 'முன்-ஆர்டர்கள் மூலம் உணவு விரயத்தை குறைத்தல்' : 'Reducing food waste through pre-orders'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;