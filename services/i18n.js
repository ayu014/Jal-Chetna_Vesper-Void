import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

// Import all your translation files
import en from '../translations/en.json';
import hi from '../translations/hi.json';
import pa from '../translations/pa.json';
import ta from '../translations/ta.json'; // Tamil
import te from '../translations/te.json'; // Telugu

const i18n = new I18n({
  en,
  hi,
  pa,
  ta,
  te,
});

// Set the locale once at the beginning of your app.
i18n.locale = Localization.getLocales()[0].languageCode;
i18n.enableFallback = true;

export default i18n;