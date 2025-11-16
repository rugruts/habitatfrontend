import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { i18n, type Language } from "@/lib/i18n";

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const [currentLang, setCurrentLang] = React.useState<Language>(i18n.getLanguage());

  const handleLanguageChange = (lang: Language) => {
    i18n.setLanguage(lang);
    setCurrentLang(lang);
    // Force re-render of the entire app
    window.location.reload();
  };

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'el' as Language, name: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{currentLanguage?.name}</span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLang === lang.code ? 'bg-accent/10' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
