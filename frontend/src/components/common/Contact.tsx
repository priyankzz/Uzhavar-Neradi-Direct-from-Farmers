/**
 * Contact Page - Bilingual
 * Copy to: frontend/src/components/common/Contact.tsx
 */

import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form:', formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isTamil ? 'தொடர்பு கொள்ள' : 'Contact Us'}
      </h1>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-semibold mb-2">
                {isTamil ? 'நன்றி!' : 'Thank You!'}
              </h2>
              <p className="text-gray-600">
                {isTamil ? 'உங்கள் செய்தி அனுப்பப்பட்டது. விரைவில் பதிலளிப்போம்.' : "We'll get back to you soon."}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary mt-4"
              >
                {isTamil ? 'மீண்டும் செய்தி அனுப்ப' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  {isTamil ? 'பெயர்' : 'Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  {isTamil ? 'மின்னஞ்சல்' : 'Email'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  {isTamil ? 'பொருள்' : 'Subject'}
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  {isTamil ? 'செய்தி' : 'Message'}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={5}
                  className="input-field"
                  required
                />
              </div>
              
              <button type="submit" className="btn-primary w-full">
                {isTamil ? 'செய்தி அனுப்பு' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {isTamil ? 'தொடர்பு முகவரி' : 'Get in Touch'}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-medium">
                    {isTamil ? 'முகவரி' : 'Address'}
                  </p>
                  <p className="text-gray-600">
                    {isTamil ? 'விழுப்புரம், தமிழ்நாடு' : 'Villupuram, Tamil Nadu'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-medium">
                    {isTamil ? 'தொலைபேசி' : 'Phone'}
                  </p>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-sm text-gray-500">
                    {isTamil ? 'திங்கள்-சனி, காலை 9 - மாலை 6' : 'Mon-Sat, 9AM - 6PM'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="font-medium">
                    {isTamil ? 'மின்னஞ்சல்' : 'Email'}
                  </p>
                  <p className="text-gray-600">support@uzhavarneradi.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3">
              {isTamil ? 'உதவி நேரங்கள்' : 'Support Hours'}
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>{isTamil ? 'திங்கள் - வெள்ளி: காலை 9 - மாலை 6' : 'Monday - Friday: 9:00 AM - 6:00 PM'}</p>
              <p>{isTamil ? 'சனி: காலை 9 - மதியம் 2' : 'Saturday: 9:00 AM - 2:00 PM'}</p>
              <p>{isTamil ? 'ஞாயிறு: விடுமுறை' : 'Sunday: Closed'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;