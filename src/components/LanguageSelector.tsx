import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { type Language } from '@/lib/i18n';

interface LanguageSelectorProps {
  variant?: 'button' | 'select';
  className?: string;
}

const languageNames: Record<Language, string> = {
  en: 'English',
  el: 'Ελληνικά',
  de: 'Deutsch',
};

const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  el: '🇬🇷',
  de: '🇩🇪',
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'select', 
  className = '' 
}) => {
  const { currentLanguage, changeLanguage } = useTranslation();

  if (variant === 'button') {
    return (
      <div className={`flex gap-1 ${className}`}>
        {Object.entries(languageNames).map(([code, name]) => (
          <Button
            key={code}
            variant={currentLanguage === code ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeLanguage(code as Language)}
            className="flex items-center gap-1 min-w-0 px-2"
          >
            <span className="text-sm">{languageFlags[code as Language]}</span>
            <span className="hidden sm:inline text-xs">{name}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <Select value={currentLanguage} onValueChange={(value) => changeLanguage(value as Language)}>
      <SelectTrigger className={`w-auto min-w-[120px] ${className}`}>
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languageNames).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            <div className="flex items-center gap-2">
              <span>{languageFlags[code as Language]}</span>
              <span>{name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
