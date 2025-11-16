import { en } from './translations/en';
import { de } from './translations/de';
import { el } from './translations/el';

export type Language = 'en' | 'el' | 'de';

// Complete translations object with all languages
export const translations = {
  en,
  de,
  el,
};

// Simple i18n context
export const createI18nContext = () => {
  let currentLanguage: Language = 'en';
  
  const setLanguage = (lang: Language) => {
    // Only allow valid languages to be set
    if (['en', 'el', 'de'].includes(lang)) {
      currentLanguage = lang;
      localStorage.setItem('habitat-language', lang);
    }
  };
  
  const getLanguage = (): Language => {
    const stored = localStorage.getItem('habitat-language') as Language;
    // Validate that the stored language is one of our supported languages
    if (stored && ['en', 'el', 'de'].includes(stored)) {
      return stored;
    }
    return 'en';
  };
  
  const t = (key: string, params?: Record<string, string>): string => {
    const lang = getLanguage();
    // Ensure the language exists in translations and handle cases where it doesn't
    const currentTranslations = translations[lang] || translations.en;
    let text = currentTranslations[key] || translations.en[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
      });
    }
    
    return text;
  };
  
  return { setLanguage, getLanguage, t };
};

export const i18n = createI18nContext();
