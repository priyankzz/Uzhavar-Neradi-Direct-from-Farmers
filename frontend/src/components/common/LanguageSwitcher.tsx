/**
 * Language Switcher Component
 * Copy to: frontend/src/components/common/LanguageSwitcher.tsx
 */

import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2 bg-green-700 rounded-lg p-1">
      <button
        onClick={() => setLanguage('ta')}
        className={`px-2 py-1 rounded text-sm transition ${
          language === 'ta' 
            ? 'bg-white text-green-700' 
            : 'text-white hover:bg-green-600'
        }`}
      >
        தமிழ்
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded text-sm transition ${
          language === 'en' 
            ? 'bg-white text-green-700' 
            : 'text-white hover:bg-green-600'
        }`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;