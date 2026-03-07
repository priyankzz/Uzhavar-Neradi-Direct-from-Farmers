/**
 * Privacy Policy Page - Complete Bilingual Version
 * Copy to: frontend/src/components/common/PrivacyPolicy.tsx
 */

import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isTamil ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            {isTamil ? 'கடைசியாக புதுப்பிக்கப்பட்டது: மார்ச் 2026' : 'Last updated: March 2026'}
          </p>

          <p className="text-gray-700 mb-6">
            {isTamil ? (
              'உழவர் நேரடியில், உங்கள் தனியுரிமை எங்களுக்கு மிகவும் முக்கியமானது. இந்த தனியுரிமைக் கொள்கை எங்கள் தளத்தைப் பயன்படுத்தும் போது நாங்கள் சேகரிக்கும், பயன்படுத்தும், பகிர்ந்து கொள்ளும் மற்றும் பாதுகாக்கும் தகவல்களை விளக்குகிறது.'
            ) : (
              'At Uzhavar Neradi, your privacy is of utmost importance to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '1. நாங்கள் சேகரிக்கும் தகவல்' : '1. Information We Collect'}
          </h2>
          
          <h3 className="text-lg font-medium mb-2">
            {isTamil ? '1.1 தனிப்பட்ட தகவல்' : '1.1 Personal Information'}
          </h3>
          <p className="text-gray-700 mb-2">
            {isTamil ? 'நீங்கள் எங்கள் சேவைகளைப் பயன்படுத்தும் போது பின்வரும் தனிப்பட்ட தகவல்களை நாங்கள் சேகரிக்கலாம்:' : 'We may collect the following personal information when you use our services:'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>{isTamil ? 'பெயர்' : 'Name'}</strong> - {isTamil ? 'உங்கள் முழுப்பெயர்' : 'Your full name'}</li>
            <li><strong>{isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}</strong> - {isTamil ? 'உங்கள் மின்னஞ்சல் முகவரி' : 'Your email address'}</li>
            <li><strong>{isTamil ? 'தொலைபேசி எண்' : 'Phone Number'}</strong> - {isTamil ? 'உங்கள் தொடர்பு எண்' : 'Your contact number'}</li>
            <li><strong>{isTamil ? 'முகவரி' : 'Address'}</strong> - {isTamil ? 'விநியோக முகவரி' : 'Delivery address'}</li>
            <li><strong>{isTamil ? 'பிறந்த தேதி' : 'Date of Birth'}</strong> - {isTamil ? 'உங்கள் பிறந்த தேதி (விருப்ப)' : 'Your date of birth (optional)'}</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">
            {isTamil ? '1.2 சரிபார்ப்பு ஆவணங்கள்' : '1.2 Verification Documents'}
          </h3>
          <p className="text-gray-700 mb-2">
            {isTamil ? 'விவசாயிகள் மற்றும் விநியோக கூட்டாளர்களுக்கு, நாங்கள் பின்வரும் ஆவணங்களை சேகரிக்கிறோம்:' : 'For farmers and delivery partners, we collect the following documents:'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>{isTamil ? 'ஆதார் அட்டை' : 'Aadhaar Card'}</strong> - {isTamil ? 'அடையாள சரிபார்ப்புக்கு' : 'For identity verification'}</li>
            <li><strong>{isTamil ? 'நில ஆவணங்கள்' : 'Land Documents'}</strong> - {isTamil ? 'விவசாய நில உரிமையை சரிபார்க்க' : 'To verify farm ownership'}</li>
            <li><strong>{isTamil ? 'ஓட்டுநர் உரிமம்' : 'Driving License'}</strong> - {isTamil ? 'விநியோக கூட்டாளிகளுக்கு' : 'For delivery partners'}</li>
            <li><strong>{isTamil ? 'வாகன பதிவு' : 'Vehicle Registration'}</strong> - {isTamil ? 'வாகன விவரங்களுக்கு' : 'For vehicle details'}</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">
            {isTamil ? '1.3 பயன்பாட்டு தரவு' : '1.3 Usage Data'}
          </h3>
          <p className="text-gray-700 mb-2">
            {isTamil ? 'நீங்கள் எங்கள் தளத்தைப் பயன்படுத்தும் போது, நாங்கள் தானாகவே பின்வரும் தகவல்களை சேகரிக்கிறோம்:' : 'When you use our platform, we automatically collect the following information:'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>{isTamil ? 'ஐபி முகவரி' : 'IP Address'}</strong> - {isTamil ? 'உங்கள் இணைய முகவரி' : 'Your internet address'}</li>
            <li><strong>{isTamil ? 'உலாவி வகை' : 'Browser Type'}</strong> - {isTamil ? 'நீங்கள் பயன்படுத்தும் உலாவி' : 'The browser you use'}</li>
            <li><strong>{isTamil ? 'சாதன தகவல்' : 'Device Information'}</strong> - {isTamil ? 'உங்கள் சாதன விவரங்கள்' : 'Your device details'}</li>
            <li><strong>{isTamil ? 'குக்கீகள்' : 'Cookies'}</strong> - {isTamil ? 'உங்கள் விருப்பங்களை நினைவில் கொள்ள' : 'To remember your preferences'}</li>
            <li><strong>{isTamil ? 'இருப்பிட தரவு' : 'Location Data'}</strong> - {isTamil ? 'உங்கள் அனுமதியுடன் மட்டுமே' : 'Only with your permission'}</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">
            {isTamil ? '1.4 பரிவர்த்தனை தரவு' : '1.4 Transaction Data'}
          </h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>{isTamil ? 'ஆர்டர் வரலாறு' : 'Order History'}</strong> - {isTamil ? 'நீங்கள் செய்த ஆர்டர்கள்' : 'Orders you have placed'}</li>
            <li><strong>{isTamil ? 'கட்டண விவரங்கள்' : 'Payment Details'}</strong> - {isTamil ? 'கட்டண முறை மற்றும் நிலை' : 'Payment method and status'}</li>
            <li><strong>{isTamil ? 'விநியோக தகவல்' : 'Delivery Information'}</strong> - {isTamil ? 'விநியோக முகவரி மற்றும் நேரம்' : 'Delivery address and time'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '2. தகவலை எவ்வாறு பயன்படுத்துகிறோம்' : '2. How We Use Your Information'}
          </h2>
          <p className="text-gray-700 mb-2">
            {isTamil ? 'சேகரிக்கப்பட்ட தகவலை பின்வரும் நோக்கங்களுக்காகப் பயன்படுத்துகிறோம்:' : 'We use the collected information for the following purposes:'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>{isTamil ? 'சேவைகளை வழங்கவும் மேம்படுத்தவும்' : 'To provide and improve our services'}</li>
            <li>{isTamil ? 'அடையாளத்தை சரிபார்க்கவும் மோசடியை தடுக்கவும்' : 'To verify identity and prevent fraud'}</li>
            <li>{isTamil ? 'உங்கள் ஆர்டர்களை செயலாக்கவும் விநியோகிக்கவும்' : 'To process and deliver your orders'}</li>
            <li>{isTamil ? 'ஆர்டர் புதுப்பிப்புகள் குறித்து தெரிவிக்க' : 'To communicate about order updates'}</li>
            <li>{isTamil ? 'வாடிக்கையாளர் ஆதரவை வழங்க' : 'To provide customer support'}</li>
            <li>{isTamil ? 'தனிப்பயனாக்கப்பட்ட அனுபவத்தை வழங்க' : 'To personalize your experience'}</li>
            <li>{isTamil ? 'பகுப்பாய்வு மற்றும் ஆராய்ச்சிக்காக' : 'For analytics and research'}</li>
            <li>{isTamil ? 'சட்டப்பூர்வ கடமைகளை நிறைவேற்ற' : 'To comply with legal obligations'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '3. தகவலைப் பகிர்தல்' : '3. Information Sharing'}
          </h2>
          <p className="text-gray-700 mb-2">
            {isTamil ? 'பின்வரும் சூழ்நிலைகளில் மட்டுமே நாங்கள் உங்கள் தகவலைப் பகிர்ந்து கொள்கிறோம்:' : 'We share your information only in the following circumstances:'}
          </p>
          
          <h3 className="text-lg font-medium mb-2">
            {isTamil ? '3.1 விவசாயிகளுடன்' : '3.1 With Farmers'}
          </h3>
          <p className="text-gray-700 mb-2">
            {isTamil ? 'உங்கள் ஆர்டரை நிறைவேற்ற, விவசாயிகளுடன் பின்வரும் தகவல்களைப் பகிர்ந்து கொள்கிறோம்:' : 'To fulfill your order, we share the following information with farmers:'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>{isTamil ? 'பெயர்' : 'Name'}</li>
            <li>{isTamil ? 'விநியோக முகவரி' : 'Delivery address'}</li>
            <li>{isTamil ? 'தொலைபேசி எண்' : 'Phone number'}</li>
            <li>{isTamil ? 'ஆர்டர் விவரங்கள்' : 'Order details'}</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">
            {isTamil ? '3.2 விநியோக கூட்டாளர்களுடன்' : '3.2 With Delivery Partners'}
          </h3>
          <p className="text-gray-700 mb-2">
            {isTamil ? 'விநியோகத்திற்காக, விநியோக கூட்டாளர்களுடன் பின்வரும் தகவல்களைப் பகிர்ந்து கொள்கிறோம் (விநியோகத்திற்குப் பிறகு இந்தத் தகவல் நீக்கப்படும்):' : 'For delivery, we share the following with delivery partners (this information is deleted after delivery):'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>{isTamil ? 'பெயர்' : 'Name'}</li>
            <li>{isTamil ? 'விநியோக முகவரி' : 'Delivery address'}</li>
            <li>{isTamil ? 'தொலைபேசி எண்' : 'Phone number'}</li>
            <li>{isTamil ? 'விநியோக வழிகாட்டுதல்கள்' : 'Delivery instructions'}</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">
            {isTamil ? '3.3 கட்டணச் செயலிகளுடன்' : '3.3 With Payment Processors'}
          </h3>
          <p className="text-gray-700 mb-4">
            {isTamil ? 'கட்டணங்களைப் பாதுகாப்பாகச் செயலாக்க, ரேஸர்பே போன்ற கட்டணச் செயலிகளுடன் கட்டண விவரங்களைப் பகிர்ந்து கொள்கிறோம்.' : 'We share payment details with payment processors like Razorpay to securely process payments.'}
          </p>

          <h3 className="text-lg font-medium mb-2">
            {isTamil ? '3.4 சட்டப்பூர்வ தேவைகள்' : '3.4 Legal Requirements'}
          </h3>
          <p className="text-gray-700 mb-4">
            {isTamil ? 'சட்டத்தால் கட்டாயப்படுத்தப்பட்டால் அல்லது உங்கள் பாதுகாப்பிற்காக அரசு அமைப்புகளுடன் தகவலைப் பகிரலாம்.' : 'We may share information with government authorities if required by law or for your protection.'}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '4. தரவு பாதுகாப்பு' : '4. Data Security'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'உங்கள் தனிப்பட்ட தகவலைப் பாதுகாக்க நாங்கள் பல பாதுகாப்பு நடவடிக்கைகளைப் பயன்படுத்துகிறோம்:'
            ) : (
              'We implement multiple security measures to protect your personal information:'
            )}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>{isTamil ? 'குறியாக்கம்' : 'Encryption'}</strong> - {isTamil ? 'எல்லா தரவும் SSL குறியாக்கம் செய்யப்படுகிறது' : 'All data is SSL encrypted'}</li>
            <li><strong>{isTamil ? 'அணுகல் கட்டுப்பாடு' : 'Access Control'}</strong> - {isTamil ? 'தரவுக்கான அணுகல் கட்டுப்படுத்தப்பட்டுள்ளது' : 'Access to data is restricted'}</li>
            <li><strong>{isTamil ? 'வழக்கமான தணிக்கை' : 'Regular Audits'}</strong> - {isTamil ? 'பாதுகாப்பு முறைகள் வழக்கமாக சோதிக்கப்படுகின்றன' : 'Security measures are regularly tested'}</li>
            <li><strong>{isTamil ? 'இரு-காரணி அங்கீகாரம்' : 'Two-Factor Authentication'}</strong> - {isTamil ? 'கூடுதல் பாதுகாப்பு அடுக்கு' : 'Additional security layer'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '5. தரவு தக்கவைப்பு' : '5. Data Retention'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'உங்கள் கணக்கு செயலில் இருக்கும் வரை உங்கள் தகவலை நாங்கள் வைத்திருப்போம். கணக்கு நீக்கப்பட்ட பிறகு, சட்டப்பூர்வ தேவைகளுக்காக சில தகவல்களை நாங்கள் வைத்திருக்கலாம். விநியோக கூட்டாளர்கள் விநியோகத்தை முடித்த உடனேயே வாடிக்கையாளர் தரவை அணுக முடியாது.'
            ) : (
              'We retain your information as long as your account is active. After account deletion, we may retain certain information for legal purposes. Delivery partners lose access to customer data immediately after delivery completion.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '6. உங்கள் உரிமைகள்' : '6. Your Rights'}
          </h2>
          <p className="text-gray-700 mb-2">
            {isTamil ? 'உங்கள் தனிப்பட்ட தரவு தொடர்பாக உங்களுக்கு பின்வரும் உரிமைகள் உள்ளன:' : 'You have the following rights regarding your personal data:'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>{isTamil ? 'அணுகல் உரிமை' : 'Right to Access'}</strong> - {isTamil ? 'உங்கள் தரவை அணுகக் கோரலாம்' : 'Request access to your data'}</li>
            <li><strong>{isTamil ? 'திருத்தும் உரிமை' : 'Right to Rectification'}</strong> - {isTamil ? 'தவறான தரவை திருத்தக் கோரலாம்' : 'Request correction of inaccurate data'}</li>
            <li><strong>{isTamil ? 'நீக்கும் உரிமை' : 'Right to Erasure'}</strong> - {isTamil ? 'உங்கள் தரவை நீக்கக் கோரலாம்' : 'Request deletion of your data'}</li>
            <li><strong>{isTamil ? 'ஏற்றுமதி உரிமை' : 'Right to Export'}</strong> - {isTamil ? 'உங்கள் தரவை ஏற்றுமதி செய்யலாம்' : 'Export your data'}</li>
            <li><strong>{isTamil ? 'எதிர்ப்பு உரிமை' : 'Right to Object'}</strong> - {isTamil ? 'தரவு பயன்பாட்டை எதிர்க்கலாம்' : 'Object to data processing'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '7. குக்கீகள்' : '7. Cookies'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'உங்கள் அனுபவத்தை மேம்படுத்த எங்கள் தளம் குக்கீகளைப் பயன்படுத்துகிறது. குக்கீகள் உங்கள் உலாவியில் சேமிக்கப்படும் சிறிய கோப்புகள். நீங்கள் குக்கீகளை முடக்கலாம், ஆனால் சில அம்சங்கள் சரியாக வேலை செய்யாமல் போகலாம். எங்கள் குக்கீகள் தனிப்பட்ட தகவலை சேகரிக்காது.'
            ) : (
              'Our site uses cookies to enhance your experience. Cookies are small files stored on your browser. You can disable cookies, but some features may not work properly. Our cookies do not collect personal information.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '8. குழந்தைகளின் தனியுரிமை' : '8. Children\'s Privacy'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'எங்கள் சேவைகள் 18 வயதுக்குட்பட்ட குழந்தைகளுக்காக இல்லை. 18 வயதுக்குட்பட்ட குழந்தைகளிடமிருந்து தெரிந்தே தகவல்களை நாங்கள் சேகரிப்பதில்லை.'
            ) : (
              'Our services are not directed to children under 18. We do not knowingly collect information from children under 18.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '9. சர்வதேச தரவு பரிமாற்றம்' : '9. International Data Transfer'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'உங்கள் தகவல் இந்தியாவில் உள்ள சேவையகங்களில் சேமிக்கப்படுகிறது. எங்கள் சேவைகளைப் பயன்படுத்துவதன் மூலம், உங்கள் தகவல் இந்தியாவில் செயலாக்கப்படுவதற்கு நீங்கள் ஒப்புக்கொள்கிறீர்கள்.'
            ) : (
              'Your information is stored on servers located in India. By using our services, you consent to your information being processed in India.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '10. இணைப்புகள்' : '10. Third-Party Links'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'எங்கள் தளத்தில் மூன்றாம் தரப்பு இணையதளங்களுக்கான இணைப்புகள் இருக்கலாம். இந்த இணையதளங்களின் தனியுரிமைக் கொள்கைகளுக்கு நாங்கள் பொறுப்பல்ல.'
            ) : (
              'Our site may contain links to third-party websites. We are not responsible for the privacy policies of these websites.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '11. கொள்கையில் மாற்றங்கள்' : '11. Changes to This Policy'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'இந்த தனியுரிமைக் கொள்கையை அவ்வப்போது புதுப்பிக்கலாம். முக்கிய மாற்றங்கள் இந்தப் பக்கத்தில் அறிவிக்கப்படும். தொடர்ந்து எங்கள் தளத்தைப் பயன்படுத்துவது புதுப்பிக்கப்பட்ட கொள்கையை ஏற்றுக்கொள்வதாகும்.'
            ) : (
              'We may update this privacy policy periodically. Material changes will be notified on this page. Your continued use of the platform constitutes acceptance of the updated policy.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '12. உங்கள் ஒப்புதல்' : '12. Your Consent'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'எங்கள் தளத்தைப் பயன்படுத்துவதன் மூலம், எங்கள் தனியுரிமைக் கொள்கைக்கு நீங்கள் ஒப்புக்கொள்கிறீர்கள்.'
            ) : (
              'By using our site, you consent to our privacy policy.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '13. எங்களைத் தொடர்பு கொள்ள' : '13. Contact Us'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? 'இந்த தனியுரிமைக் கொள்கை குறித்த ஏதேனும் கேள்விகள் இருந்தால், எங்களைத் தொடர்பு கொள்ளவும்:' : 'If you have any questions about this privacy policy, please contact us:'}
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-800">
              <strong>Uzhavar Neradi</strong><br />
              {isTamil ? 'தனியுரிமை அதிகாரி' : 'Privacy Officer'}<br />
              {isTamil ? 'மின்னஞ்சல்' : 'Email'}: privacy@uzhavarneradi.com<br />
              {isTamil ? 'தொலைபேசி' : 'Phone'}: +91 98765 43210<br />
              {isTamil ? 'முகவரி' : 'Address'}: {isTamil ? 'சென்னை, தமிழ்நாடு - 600001' : 'Chennai, Tamil Nadu - 600001'}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              {isTamil ? '✅ உங்கள் தனியுரிமை முக்கியமானது' : '✅ Your Privacy Matters'}
            </h3>
            <p className="text-green-700">
              {isTamil ? 
                'உங்கள் தரவைப் பாதுகாக்க நாங்கள் உறுதிபூண்டுள்ளோம். அனைத்து தகவல்களும் இந்திய தரவு பாதுகாப்புச் சட்டங்களுக்கு இணங்க கையாளப்படுகின்றன. உங்கள் தனியுரிமை குறித்து ஏதேனும் கவலைகள் இருந்தால், எங்களைத் தொடர்பு கொள்ள தயங்க வேண்டாம்.' : 
                "We're committed to protecting your data. All information is handled in accordance with Indian data protection laws. If you have any concerns about your privacy, please don't hesitate to contact us."}
            </p>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>
              {isTamil ? 
                'கடைசியாக மதிப்பாய்வு செய்யப்பட்டது: மார்ச் 2026' : 
                'Last reviewed: March 2026'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;