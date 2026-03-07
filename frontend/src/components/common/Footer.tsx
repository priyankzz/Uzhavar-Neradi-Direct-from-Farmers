/**
 * Footer Component - Complete Bilingual Version
 * Copy to: frontend/src/components/common/Footer.tsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // Tamil translations
  const t = {
    aboutUs: isTamil ? 'எங்களைப் பற்றி' : 'About Us',
    contact: isTamil ? 'தொடர்பு கொள்ள' : 'Contact',
    terms: isTamil ? 'விதிமுறைகள்' : 'Terms & Conditions',
    privacy: isTamil ? 'தனியுரிமை' : 'Privacy Policy',
    allRightsReserved: isTamil ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை' : 'All rights reserved',
    directFromFarmers: isTamil ? 'நேரடியாக விவசாயிகளிடமிருந்து' : 'Direct from Farmers',
    home: isTamil ? 'முகப்பு' : 'Home',
    products: isTamil ? 'பொருட்கள்' : 'Products',
    faq: isTamil ? 'கேள்விகள்' : 'FAQ',
    shipping: isTamil ? 'விநியோகம்' : 'Shipping',
    returns: isTamil ? 'திருப்பி அனுப்புதல்' : 'Returns',
    customerService: isTamil ? 'வாடிக்கையாளர் சேவை' : 'Customer Service',
    quickLinks: isTamil ? 'விரைவு இணைப்புகள்' : 'Quick Links',
    contactInfo: isTamil ? 'தொடர்பு தகவல்' : 'Contact Information',
    address: isTamil ? 'முகவரி' : 'Address',
    phone: isTamil ? 'தொலைபேசி' : 'Phone',
    email: isTamil ? 'மின்னஞ்சல்' : 'Email',
    workingHours: isTamil ? 'வேலை நேரம்' : 'Working Hours',
    monSat: isTamil ? 'திங்கள் - சனி: காலை 9 - மாலை 6' : 'Mon - Sat: 9AM - 6PM',
    sunday: isTamil ? 'ஞாயிறு: விடுமுறை' : 'Sunday: Closed'
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.aboutUs}</h3>
            <p className="text-gray-300 text-sm">
              {isTamil 
                ? 'உழவர் நேரடி - விவசாயிகளிடமிருந்து நேரடியாக புத்துணர்ச்சியான, தரமான விவசாய பொருட்களை நியாயமான விலையில் உங்களுக்கு வழங்குகிறது.'
                : `${t.directFromFarmers} - connects you directly with farmers for fresh, quality produce at fair prices.`
              }
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition">
                  {t.products}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition">
                  {t.aboutUs}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition">
                  {t.contact}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition">
                  {t.faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.customerService}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition">
                  {t.faq}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white transition">
                  {t.shipping}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white transition">
                  {t.returns}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition">
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition">
                  {t.privacy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.contactInfo}</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="mt-1">📍</span>
                <span>
                  {isTamil ? 'விழுப்புரம், தமிழ்நாடு' : 'Villupuram, Tamil Nadu'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">✉️</span>
                <span>support@uzhavarneradi.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">🕒</span>
                <div>
                  <p>{t.monSat}</p>
                  <p>{t.sunday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} {isTamil ? 'உழவர் நேரடி' : 'Uzhavar Neradi'}. {t.allRightsReserved}.</p>
          <p className="mt-2">🌾 {t.directFromFarmers}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;