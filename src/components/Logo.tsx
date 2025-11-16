import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showText = true, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden`}>
        <img 
          src="/favicon.svg" 
          alt="Habitat Lobby Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <div className="hidden sm:block">
          <h1 className={`${textSizes[size]} font-bold text-foreground leading-tight`}>
            Habitat Lobby
          </h1>
          <p className="text-xs text-muted-foreground -mt-1 font-medium">
            Premium Apartments in Trikala
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
