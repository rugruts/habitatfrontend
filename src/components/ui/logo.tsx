import * as React from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white" | "dark"
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = "md", 
  variant = "default" 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-lg",
    md: "w-10 h-10 text-xl", 
    lg: "w-12 h-12 text-2xl"
  }

  const variantClasses = {
    default: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
    white: "bg-white text-primary border border-primary/20",
    dark: "bg-primary text-primary-foreground"
  }

  return (
    <div 
      className={cn(
        "rounded-lg flex items-center justify-center font-serif font-bold shadow-md transition-all duration-300 hover:scale-105",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <span className="tracking-tight">HL</span>
    </div>
  )
}

interface LogoWithTextProps {
  className?: string
  logoSize?: "sm" | "md" | "lg"
  logoVariant?: "default" | "white" | "dark"
  showText?: boolean
}

const LogoWithText: React.FC<LogoWithTextProps> = ({
  className,
  logoSize = "md",
  logoVariant = "default",
  showText = true
}) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Logo size={logoSize} variant={logoVariant} />
      {showText && (
        <div className="flex flex-col">
          <span className="font-serif font-bold text-lg leading-none">
            Habitat Lobby
          </span>
          <span className="text-xs text-muted-foreground font-sans">
            Boutique Stays
          </span>
        </div>
      )}
    </div>
  )
}

export { Logo, LogoWithText }
