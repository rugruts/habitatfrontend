import { useState, useEffect } from 'react';
import { i18n, type Language } from '@/lib/i18n';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18n.getLanguage());

  // Force re-render when language changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'habitat-language') {
        setCurrentLanguage(i18n.getLanguage());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = (key: string, params?: Record<string, string>): string => {
    return i18n.t(key, params);
  };

  const changeLanguage = (lang: Language) => {
    i18n.setLanguage(lang);
    setCurrentLanguage(lang);
    // Force re-render of the entire app
    window.location.reload();
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    getLanguage: i18n.getLanguage,
  };
};
