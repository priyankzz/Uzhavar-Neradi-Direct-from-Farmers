/**
 * Terms and Conditions Page - Complete Bilingual Version
 * Copy to: frontend/src/components/common/TermsAndConditions.tsx
 */

import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const TermsAndConditions: React.FC = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isTamil ? 'விதிமுறைகள் மற்றும் நிபந்தனைகள்' : 'Terms and Conditions'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            {isTamil ? 'கடைசியாக புதுப்பிக்கப்பட்டது: மார்ச் 2026' : 'Last updated: March 2026'}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '1. விதிமுறைகளை ஏற்றுக்கொள்தல்' : '1. Acceptance of Terms'}
          </h2>
          <p className="text-gray-700 mb-6">
            {isTamil ? (
              'உழவர் நேரடி இணையதளம் மற்றும் பயன்பாட்டை (இனி "சேவை" என குறிப்பிடப்படுகிறது) அணுகுவதன் மூலமும் பயன்படுத்துவதன் மூலமும், நீங்கள் இந்த விதிமுறைகள் மற்றும் நிபந்தனைகளுக்கு கட்டுப்பட ஒப்புக்கொள்கிறீர்கள். நீங்கள் இந்த விதிமுறைகளை ஏற்கவில்லையெனில், தயவுசெய்து எங்கள் சேவையைப் பயன்படுத்த வேண்டாம்.'
            ) : (
              'By accessing and using the Uzhavar Neradi website and application (hereinafter referred to as the "Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Service.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '2. பயனர் கணக்குகள்' : '2. User Accounts'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? 'ஒரு கணக்கை உருவாக்கும் போது, நீங்கள்:' : 'When creating an account, you represent and warrant that:'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>{isTamil ? 'துல்லியமான, முழுமையான மற்றும் புதுப்பித்த தகவலை வழங்க வேண்டும்' : 'You are at least 18 years of age'}</li>
            <li>{isTamil ? 'உங்கள் கணக்கு மற்றும் கடவுச்சொல்லின் ரகசியத்தன்மையை பராமரிக்க வேண்டும்' : 'You will provide accurate, complete, and current information'}</li>
            <li>{isTamil ? 'உங்கள் கணக்கின் கீழ் நிகழும் அனைத்து நடவடிக்கைகளுக்கும் நீங்கள் பொறுப்பாவீர்கள்' : 'You will maintain the confidentiality of your account and password'}</li>
            <li>{isTamil ? 'உங்கள் கணக்கில் அங்கீகரிக்கப்படாத அணுகல் அல்லது பயன்பாடு குறித்து உடனடியாக எங்களுக்கு தெரிவிக்க வேண்டும்' : 'You are responsible for all activities that occur under your account'}</li>
            <li>{isTamil ? 'ஒரே நேரத்தில் பல கணக்குகளை வைத்திருக்க முடியாது' : 'You will notify us immediately of any unauthorized access or use'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '3. சேவையின் பயன்பாடு' : '3. Use of the Service'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? 'பின்வரும் நிபந்தனைகளுக்கு உட்பட்டு சேவையைப் பயன்படுத்த நீங்கள் ஒப்புக்கொள்கிறீர்கள்:' : 'You agree to use the Service subject to the following conditions:'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>{isTamil ? 'சேவையை சட்டவிரோத நோக்கங்களுக்காக பயன்படுத்த மாட்டீர்கள்' : 'You will not use the Service for any illegal purpose'}</li>
            <li>{isTamil ? 'சேவையின் இயல்பான செயல்பாட்டை சீர்குலைக்க மாட்டீர்கள்' : 'You will not disrupt the normal operation of the Service'}</li>
            <li>{isTamil ? 'பதிப்புரிமை, வர்த்தக முத்திரை அல்லது பிற உரிமைகளை மீற மாட்டீர்கள்' : 'You will not infringe any copyright, trademark, or other rights'}</li>
            <li>{isTamil ? 'தவறான அல்லது தவறாக வழிநடத்தும் தகவலை வழங்க மாட்டீர்கள்' : 'You will not provide false or misleading information'}</li>
            <li>{isTamil ? 'மற்ற பயனர்களின் தனியுரிமையை மீற மாட்டீர்கள்' : 'You will not violate the privacy of other users'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '4. விவசாயிகளுக்கான விதிமுறைகள்' : '4. Terms for Farmers'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? 'விவசாயியாக பதிவு செய்பவர்கள் பின்வரும் கூடுதல் நிபந்தனைகளுக்கு உட்பட்டவர்கள்:' : 'Users registering as farmers are subject to the following additional terms:'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>{isTamil ? 'துல்லியமான ஆவணங்களை வழங்கி சரிபார்ப்பு செயல்முறைக்கு உட்பட வேண்டும்' : 'You must provide accurate documentation and undergo verification'}</li>
            <li>{isTamil ? 'பட்டியலிடப்பட்ட பொருட்களின் தரத்திற்கு நீங்கள் பொறுப்பாவீர்கள்' : 'You are responsible for the quality of products listed'}</li>
            <li>{isTamil ? 'ஆர்டர்களை சரியான நேரத்தில் நிறைவேற்ற வேண்டும்' : 'You must fulfill orders in a timely manner'}</li>
            <li>{isTamil ? 'இடைத்தரகர் நடவடிக்கைகளில் ஈடுபட முடியாது' : 'You cannot engage in middleman activities'}</li>
            <li>{isTamil ? 'தயாரிப்பு விலைகள் மற்றும் கிடைக்கும் தன்மையை துல்லியமாக பராமரிக்க வேண்டும்' : 'You must maintain accurate product prices and availability'}</li>
            <li>{isTamil ? 'ஆர்டர்களை ரத்து செய்வதற்கான கொள்கைகளை பின்பற்ற வேண்டும்' : 'You must follow cancellation policies'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '5. வாடிக்கையாளர்களுக்கான விதிமுறைகள்' : '5. Terms for Customers'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? 'வாடிக்கையாளர்கள் பின்வரும் நிபந்தனைகளுக்கு உட்பட்டவர்கள்:' : 'Customers are subject to the following terms:'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>{isTamil ? 'துல்லியமான விநியோக தகவலை வழங்க வேண்டும்' : 'You must provide accurate delivery information'}</li>
            <li>{isTamil ? 'சரியான நேரத்தில் கட்டணம் செலுத்த வேண்டும்' : 'You must make timely payments'}</li>
            <li>{isTamil ? 'திருப்பி அனுப்புதல் கொள்கையை தவறாக பயன்படுத்த முடியாது' : 'You cannot misuse the return policy'}</li>
            <li>{isTamil ? 'விநியோக கூட்டாளர்களை மரியாதையுடன் நடத்த வேண்டும்' : 'You must treat delivery partners with respect'}</li>
            <li>{isTamil ? 'விவசாயிகளுடன் நேரடி பரிவர்த்தனைகளில் ஈடுபட முடியாது' : 'You cannot engage in direct transactions with farmers'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '6. விநியோக கூட்டாளர்களுக்கான விதிமுறைகள்' : '6. Terms for Delivery Partners'}
          </h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>{isTamil ? 'செல்லுபடியாகும் உரிமம் மற்றும் வாகன பதிவு இருக்க வேண்டும்' : 'Must have valid license and vehicle registration'}</li>
            <li>{isTamil ? 'ஒதுக்கப்பட்ட ஆர்டர்களை சரியான நேரத்தில் விநியோகிக்க வேண்டும்' : 'Must deliver assigned orders on time'}</li>
            <li>{isTamil ? 'வாடிக்கையாளர் தரவை பராமரிக்க வேண்டும் மற்றும் விநியோகத்திற்குப் பிறகு நீக்க வேண்டும்' : 'Must maintain customer privacy and delete data after delivery'}</li>
            <li>{isTamil ? 'விநியோக நிலையை துல்லியமாக புதுப்பிக்க வேண்டும்' : 'Must update delivery status accurately'}</li>
            <li>{isTamil ? 'சீருடை மற்றும் அடையாள அட்டை அணிய வேண்டும்' : 'Must wear uniform and ID card'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '7. விலை நிர்ணயம் மற்றும் கட்டணங்கள்' : '7. Pricing and Payments'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'அனைத்து விலைகளும் விவசாயிகளால் நிர்ணயிக்கப்படுகின்றன. துல்லியத்திற்காக நாங்கள் முயற்சி செய்கிறோம், ஆனால் பிழைகள் ஏற்படலாம். தவறான விலையில் காணப்படும் ஆர்டர்களை ரத்து செய்ய எங்களுக்கு உரிமை உள்ளது. அனைத்து கட்டணங்களும் இந்திய ரூபாயில் (₹) உள்ளன.'
            ) : (
              'All prices are set by farmers. We strive for accuracy but errors may occur. We reserve the right to cancel orders found at incorrect prices. All payments are processed in Indian Rupees (₹).'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '8. விநியோகம் மற்றும் ஷிப்பிங்' : '8. Delivery and Shipping'}
          </h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>{isTamil ? 'விநியோக நேரங்கள் மதிப்பீடுகள் மட்டுமே' : 'Delivery times are estimates only'}</li>
            <li>{isTamil ? 'எங்கள் கட்டுப்பாட்டிற்கு அப்பாற்பட்ட தாமதங்களுக்கு நாங்கள் பொறுப்பல்ல' : 'We are not liable for delays beyond our control'}</li>
            <li>{isTamil ? 'விநியோகத்தின் போது பொருட்களின் இழப்பு அல்லது சேதத்திற்கான ஆபத்து வாடிக்கையாளருக்கு மாற்றப்படும்' : 'Risk of loss passes to customer upon delivery'}</li>
            <li>{isTamil ? 'விநியோக முகவரி துல்லியமாக இருப்பதை உறுதி செய்வது வாடிக்கையாளரின் பொறுப்பு' : 'Customer is responsible for ensuring accurate delivery address'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '9. திருப்பி அனுப்புதல் மற்றும் பணம் திரும்பப் பெறுதல்' : '9. Returns and Refunds'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'எங்கள் திருப்பி அனுப்புதல் கொள்கை தனி பக்கத்தில் விவரிக்கப்பட்டுள்ளது. பொதுவாக, விநியோகத்தில் 24 மணி நேரத்திற்குள் தர பிரச்சினைகளுக்கு திருப்பி அனுப்புதல் ஏற்கப்படுகிறது. பணம் திரும்பப் பெறுதல் அங்கீகரிக்கப்பட்டவுடன் 5-7 வேலை நாட்களுக்குள் செயலாக்கப்படும்.'
            ) : (
              'Our return policy is described in a separate page. Generally, returns are accepted for quality issues within 24 hours of delivery. Refunds are processed within 5-7 business days upon approval.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '10. தடைசெய்யப்பட்ட செயல்பாடுகள்' : '10. Prohibited Activities'}
          </h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>{isTamil ? 'அங்கீகாரமின்றி பொருட்களை மறுவிற்பனை செய்தல்' : 'Reselling products without authorization'}</li>
            <li>{isTamil ? 'சட்டவிரோத நோக்கங்களுக்காக தளத்தைப் பயன்படுத்துதல்' : 'Using the platform for illegal purposes'}</li>
            <li>{isTamil ? 'விவசாயிகள் அல்லது விநியோக கூட்டாளர்களை துன்புறுத்துதல்' : 'Harassing farmers or delivery partners'}</li>
            <li>{isTamil ? 'எங்கள் சரிபார்ப்பு முறையை மீற முயற்சித்தல்' : 'Attempting to bypass our verification system'}</li>
            <li>{isTamil ? 'விளம்பரங்களை சுரண்ட பல கணக்குகளை உருவாக்குதல்' : 'Creating multiple accounts to exploit promotions'}</li>
            <li>{isTamil ? 'போலி மதிப்புரைகளை இடுதல்' : 'Posting fake reviews'}</li>
            <li>{isTamil ? 'தளத்தின் பாதுகாப்பை சீர்குலைக்க முயற்சித்தல்' : 'Attempting to disrupt platform security'}</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '11. அறிவுசார் சொத்துரிமைகள்' : '11. Intellectual Property Rights'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'உழவர் நேரடி பெயர், லோகோ, மற்றும் அனைத்து உள்ளடக்கங்களும் எங்கள் அறிவுசார் சொத்து. எங்கள் முன் அனுமதியின்றி இவற்றைப் பயன்படுத்த முடியாது. விவசாயிகள் பதிவேற்றும் பொருட்களின் படங்கள் மற்றும் விளக்கங்கள் அவர்களின் சொத்து.'
            ) : (
              'The Uzhavar Neradi name, logo, and all content are our intellectual property. You may not use them without our prior permission. Farmers retain ownership of their product images and descriptions.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '12. பொறுப்பு வரையறை' : '12. Limitation of Liability'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'சட்டத்தால் அனுமதிக்கப்பட்ட அதிகபட்ச அளவிற்கு, உழவர் நேரடி, அதன் இயக்குநர்கள், ஊழியர்கள் அல்லது முகவர்கள் சேவையின் பயன்பாட்டிலிருந்து எழும் நேரடி, மறைமுக, தற்செயலான, சிறப்பு அல்லது விளைவான சேதங்களுக்கு பொறுப்பாக மாட்டார்கள்.'
            ) : (
              'To the maximum extent permitted by law, Uzhavar Neradi, its directors, employees, or agents shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of the Service.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '13. இழப்பீடு' : '13. Indemnification'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'இந்த விதிமுறைகளை மீறுவதால் அல்லது சேவையின் உங்கள் பயன்பாட்டிலிருந்து எழும் எந்தவொரு கோரிக்கைகள், பொறுப்புகள், செலவுகள் மற்றும் செலவுகளிலிருந்து உழவர் நேரடியை பாதுகாக்க மற்றும் இழப்பீடு செய்ய நீங்கள் ஒப்புக்கொள்கிறீர்கள்.'
            ) : (
              'You agree to defend, indemnify, and hold harmless Uzhavar Neradi from any claims, liabilities, costs, and expenses arising from your violation of these terms or your use of the Service.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '14. கணக்கு நிறுத்துதல்' : '14. Termination'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'இந்த விதிமுறைகளை மீறும், மோசடி நடவடிக்கைகளில் ஈடுபடும் அல்லது எங்கள் சமூகத்திற்கு தீங்கு விளைவிக்கும் கணக்குகளை நிறுத்த எங்களுக்கு உரிமை உள்ளது. எந்தவொரு காரணத்திற்காகவும் அறிவிப்பு இன்றி சேவையை நிறுத்த அல்லது மாற்ற எங்களுக்கு உரிமை உண்டு.'
            ) : (
              'We reserve the right to terminate accounts that violate these terms, engage in fraudulent activity, or harm our community. We may suspend or terminate the Service for any reason without notice.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '15. மூன்றாம் தரப்பு இணைப்புகள்' : '15. Third-Party Links'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'எங்கள் சேவையில் மூன்றாம் தரப்பு இணையதளங்களுக்கான இணைப்புகள் இருக்கலாம். இந்த இணையதளங்களின் உள்ளடக்கம் அல்லது கொள்கைகளுக்கு நாங்கள் பொறுப்பல்ல.'
            ) : (
              'Our Service may contain links to third-party websites. We are not responsible for the content or policies of these websites.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '16. விதிமுறைகளில் மாற்றங்கள்' : '16. Changes to Terms'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'இந்த விதிமுறைகளை நாங்கள் அவ்வப்போது புதுப்பிக்கலாம். முக்கிய மாற்றங்கள் மின்னஞ்சல் அல்லது தள அறிவிப்பு மூலம் தெரிவிக்கப்படும். தளத்தின் தொடர்ச்சியான பயன்பாடு புதிய விதிமுறைகளை ஏற்றுக்கொள்வதாகும்.'
            ) : (
              'We may update these terms periodically. Material changes will be notified via email or platform announcement. Continued use of the platform constitutes acceptance of the new terms.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '17. பொருந்தும் சட்டம்' : '17. Governing Law'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'இந்த விதிமுறைகள் இந்திய சட்டங்களுக்கு உட்பட்டவை. எழும் எந்தவொரு சர்ச்சைகளும் சென்னை நீதிமன்றங்களின் பிரத்யேக அதிகார வரம்பிற்கு உட்பட்டவை.'
            ) : (
              'These terms shall be governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Chennai.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '18. முழு ஒப்பந்தம்' : '18. Entire Agreement'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'இந்த விதிமுறைகள், எங்கள் தனியுரிமைக் கொள்கையுடன் சேர்ந்து, உங்களுக்கும் உழவர் நேரடிக்கும் இடையிலான முழு ஒப்பந்தத்தை உருவாக்குகின்றன.'
            ) : (
              'These terms, together with our Privacy Policy, constitute the entire agreement between you and Uzhavar Neradi.'
            )}
          </p>

          <h2 className="text-xl font-semibold mb-4">
            {isTamil ? '19. தொடர்பு தகவல்' : '19. Contact Information'}
          </h2>
          <p className="text-gray-700 mb-4">
            {isTamil ? (
              'இந்த விதிமுறைகள் குறித்த கேள்விகளுக்கு, எங்களை தொடர்பு கொள்ளவும்:'
            ) : (
              'For questions about these terms, contact us at:'
            )}
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800">
              <strong>Uzhavar Neradi</strong><br />
              {isTamil ? 'மின்னஞ்சல்' : 'Email'}: legal@uzhavarneradi.com<br />
              {isTamil ? 'தொலைபேசி' : 'Phone'}: +91 98765 43210<br />
              {isTamil ? 'முகவரி' : 'Address'}: {isTamil ? 'சென்னை, தமிழ்நாடு - 600001' : 'Chennai, Tamil Nadu - 600001'}
            </p>
          </div>

          <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              {isTamil ? '⚠️ முக்கிய குறிப்பு' : '⚠️ Important Note'}
            </h3>
            <p className="text-yellow-700">
              {isTamil ? 
                'உழவர் நேரடியைப் பயன்படுத்துவதன் மூலம், இந்த விதிமுறைகள் மற்றும் நிபந்தனைகளை நீங்கள் படித்து, புரிந்துகொண்டு, அவற்றால் கட்டுப்பட ஒப்புக்கொள்கிறீர்கள்.' : 
                'By using Uzhavar Neradi, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;