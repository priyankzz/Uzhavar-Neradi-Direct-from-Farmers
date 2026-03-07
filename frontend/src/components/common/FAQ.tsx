/**
 * FAQ Page - Bilingual
 * Copy to: frontend/src/components/common/FAQ.tsx
 */

import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface FAQItem {
  question_en: string;
  question_ta: string;
  answer_en: string;
  answer_ta: string;
  category: string;
}

const FAQ: React.FC = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [category, setCategory] = useState('all');

  const faqs: FAQItem[] = [
    {
      category: 'general',
      question_en: 'What is Uzhavar Neradi?',
      question_ta: 'உழவர் நேரடி என்றால் என்ன?',
      answer_en: 'Uzhavar Neradi (உழவர் நேரடி) is a platform that connects consumers directly with farmers in Tamil Nadu. We eliminate middlemen to ensure fair prices for farmers and fresh produce for consumers.',
      answer_ta: 'உழவர் நேரடி என்பது தமிழ்நாட்டில் நுகர்வோரை நேரடியாக விவசாயிகளுடன் இணைக்கும் ஒரு தளமாகும். விவசாயிகளுக்கு நியாயமான விலையையும், நுகர்வோருக்கு புத்துணர்ச்சியான விளைபொருட்களையும் உறுதி செய்ய இடைத்தரகர்களை நாங்கள் நீக்குகிறோம்.'
    },
    {
      category: 'general',
      question_en: 'How does it work?',
      question_ta: 'இது எப்படி செயல்படுகிறது?',
      answer_en: 'Farmers list their products on our platform. Consumers can browse, pre-order, or buy directly. Orders are delivered by our verified delivery partners directly from the farm to your doorstep.',
      answer_ta: 'விவசாயிகள் தங்கள் பொருட்களை எங்கள் தளத்தில் பட்டியலிடுகிறார்கள். நுகர்வோர் உலாவலாம், முன்-ஆர்டர் செய்யலாம் அல்லது நேரடியாக வாங்கலாம். ஆர்டர்கள் எங்கள் சரிபார்க்கப்பட்ட விநியோக கூட்டாளர்களால் பண்ணையிலிருந்து நேரடியாக உங்கள் வீட்டு வாசலுக்கு வழங்கப்படுகின்றன.'
    },
    {
      category: 'farmer',
      question_en: 'How do I register as a farmer?',
      question_ta: 'விவசாயியாக பதிவு செய்வது எப்படி?',
      answer_en: 'Click on "Register" and select "Farmer" as your role. You will need to upload your Aadhaar and land documents for verification. Once verified by our admin team, you can start listing your products.',
      answer_ta: '"பதிவு" என்பதைக் கிளிக் செய்து, உங்கள் பாத்திரமாக "விவசாயி" என்பதைத் தேர்ந்தெடுக்கவும். சரிபார்ப்புக்காக உங்கள் ஆதார் மற்றும் நில ஆவணங்களைப் பதிவேற்ற வேண்டும். எங்கள் நிர்வாகக் குழுவால் சரிபார்க்கப்பட்டதும், உங்கள் பொருட்களைப் பட்டியலிட ஆரம்பிக்கலாம்.'
    },
    {
      category: 'farmer',
      question_en: 'Is there any fee for farmers?',
      question_ta: 'விவசாயிகளுக்கு ஏதேனும் கட்டணம் உண்டா?',
      answer_en: 'No, registration is completely free for farmers. We believe in empowering farmers and only charge a nominal delivery fee from consumers.',
      answer_ta: 'இல்லை, விவசாயிகளுக்கு பதிவு முற்றிலும் இலவசம். விவசாயிகளை மேம்படுத்துவதில் நாங்கள் நம்பிக்கை கொண்டுள்ளோம், நுகர்வோரிடமிருந்து ஒரு குறியீட்டு விநியோகக் கட்டணத்தை மட்டுமே வசூலிக்கிறோம்.'
    },
    {
      category: 'customer',
      question_en: 'How do I place an order?',
      question_ta: 'நான் எப்படி ஆர்டர் செய்வது?',
      answer_en: 'Browse products, add items to cart, and proceed to checkout. You can choose between normal order or pre-order. Payment can be made via Razorpay or Cash on Delivery.',
      answer_ta: 'பொருட்களை உலவவும், பொருட்களை வண்டியில் சேர்க்கவும், பின்னர் செக்-அவுட்டுக்குச் செல்லவும். நீங்கள் சாதாரண ஆர்டர் அல்லது முன்-ஆர்டர் இடையே தேர்வு செய்யலாம். ரேஸர்பே அல்லது டெலிவரியில் பணம் மூலம் பணம் செலுத்தலாம்.'
    },
    {
      category: 'customer',
      question_en: 'What is pre-order?',
      question_ta: 'முன்-ஆர்டர் என்றால் என்ன?',
      answer_en: 'Pre-order allows you to order fresh produce in advance. Farmers harvest based on pre-orders, which helps reduce food waste and ensures you get the freshest products.',
      answer_ta: 'முன்-ஆர்டர் புத்துணர்ச்சியான பொருட்களை முன்கூட்டியே ஆர்டர் செய்ய அனுமதிக்கிறது. விவசாயிகள் முன்-ஆர்டர்களின் அடிப்படையில் அறுவடை செய்கிறார்கள், இது உணவு விரயத்தைக் குறைக்க உதவுகிறது மற்றும் நீங்கள் புத்துணர்ச்சியான பொருட்களைப் பெறுவதை உறுதி செய்கிறது.'
    },
    {
      category: 'delivery',
      question_en: 'How do I become a delivery partner?',
      question_ta: 'நான் எப்படி விநியோக கூட்டாளியாக முடியும்?',
      answer_en: 'Register as "Delivery Partner" and complete your profile with vehicle and license details. Once verified by admin, you can start accepting delivery assignments.',
      answer_ta: '"விநியோக கூட்டாளி" ஆக பதிவு செய்து, வாகனம் மற்றும் உரிம விவரங்களுடன் உங்கள் சுயவிவரத்தை நிரப்பவும். நிர்வாகத்தால் சரிபார்க்கப்பட்டதும், நீங்கள் விநியோக பணிகளை ஏற்க ஆரம்பிக்கலாம்.'
    },
    {
      category: 'payment',
      question_en: 'What payment methods are accepted?',
      question_ta: 'என்ன கட்டண முறைகள் ஏற்கப்படுகின்றன?',
      answer_en: 'We accept Razorpay (UPI, Cards, NetBanking) and Cash on Delivery (COD).',
      answer_ta: 'நாங்கள் ரேஸர்பே (UPI, அட்டைகள், நெட்பேங்கிங்) மற்றும் டெலிவரியில் பணம் (COD) ஆகியவற்றை ஏற்கிறோம்.'
    }
  ];

  const filteredFaqs = category === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === category);

  const categories = [
    { id: 'all', name_en: 'All', name_ta: 'அனைத்தும்', icon: '📋' },
    { id: 'general', name_en: 'General', name_ta: 'பொது', icon: '❓' },
    { id: 'farmer', name_en: 'Farmers', name_ta: 'விவசாயிகள்', icon: '🌾' },
    { id: 'customer', name_en: 'Customers', name_ta: 'வாடிக்கையாளர்கள்', icon: '🛒' },
    { id: 'delivery', name_en: 'Delivery', name_ta: 'விநியோகம்', icon: '🚚' },
    { id: 'payment', name_en: 'Payment', name_ta: 'கட்டணம்', icon: '💰' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isTamil ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}
      </h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full transition ${
              category === cat.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {cat.icon} {isTamil ? cat.name_ta : cat.name_en}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <button
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-medium">
                {isTamil ? faq.question_ta : faq.question_en}
              </span>
              <span className="text-xl">
                {activeIndex === index ? '−' : '+'}
              </span>
            </button>
            
            {activeIndex === index && (
              <div className="px-6 py-4 bg-gray-50 border-t">
                <p className="text-gray-700">
                  {isTamil ? faq.answer_ta : faq.answer_en}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still have questions */}
      <div className="mt-8 bg-green-50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">
          {isTamil ? 'இன்னும் கேள்விகள் உள்ளனவா?' : 'Still have questions?'}
        </h2>
        <p className="text-gray-700 mb-4">
          {isTamil 
            ? 'உங்களுக்கு தேவையான பதிலைக் காணவில்லையா? எங்கள் ஆதரவு குழுவைத் தொடர்பு கொள்ளவும்.' 
            : "Can't find the answer you're looking for? Please contact our support team."}
        </p>
        <a href="/contact" className="btn-primary inline-block">
          {isTamil ? 'எங்களை தொடர்பு கொள்ள' : 'Contact Us'}
        </a>
      </div>
    </div>
  );
};

export default FAQ;