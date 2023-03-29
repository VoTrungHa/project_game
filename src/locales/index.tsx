import i18n from 'i18next';
import en from 'locales/EN';
import vn from 'locales/VN';
import { initReactI18next } from 'react-i18next';

// TODO: enable multilanguage later
// const lng = storage.getValueFromKey('lang') ? storage.getValueFromKey('lang') : 'vn';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    vn: {
      translation: vn,
    },
  },
  lng: 'vn',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
