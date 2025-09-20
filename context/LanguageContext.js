import React, { createContext, useState, useContext } from 'react';
import i18n from '../services/i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(i18n.locale);

  const setLocale = (newLocale) => {
    i18n.locale = newLocale;
    setLocaleState(newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);