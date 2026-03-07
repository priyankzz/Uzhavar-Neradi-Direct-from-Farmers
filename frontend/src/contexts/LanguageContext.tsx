/**
 * Language Context
 * Copy to: frontend/src/contexts/LanguageContext.tsx
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ta');

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language, i18n]);

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;