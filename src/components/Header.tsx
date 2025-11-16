import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Star,
  Heart,
  Search,
  User,
  Calendar,
  Home,
  Building2,
  Info,
  MessageCircle,
  Globe,
  Sun,
  Moon,
  ChevronRight,
  ChevronDown,
  Sparkles,
  FileText,
  HelpCircle
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import WeatherWidget from "@/components/WeatherWidget";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle scroll effect with better performance
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Check if current page is active
  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  // Navigation items - moved inside component to ensure t() is available
  const navigationItems = [
    { href: "/", label: t('nav.home'), icon: Home, description: "Discover our premium apartments" },
    { href: "/apartments", label: t('nav.apartments'), icon: Building2, description: "Browse available properties" },
    { href: "/reviews", label: t('reviews.title'), icon: Star, description: "Read guest experiences" },
    { href: "/about-trikala", label: t('aboutTrikala.title'), icon: MapPin, description: "Discover Trikala" },
  ];

  // Submenu for Habitat Lobby
  const habitatLobbySubmenu = [
    { href: "/about", label: t('pages.about.title'), icon: Info, description: t('pages.about.subtitle') },
    { href: "/policies", label: t('footer.policies'), icon: FileText, description: t('pages.contact.getInTouchDesc') },
    { href: "/faq", label: t('footer.faq'), icon: HelpCircle, description: t('pages.contact.getInTouchDesc') },
  ];

  const quickActions = [
    {
      title: t('booking.title'),
      description: t('pages.home.description'),
      icon: Calendar,
      href: "/apartments",
      variant: "accent" as const
    }
  ];

  const features = [
    {
      icon: MapPin,
      title: t('about.primeLocation'),
      description: t('about.primeLocationDesc'),
      color: "text-primary"
    },
    {
      icon: Star,
      title: t('about.fiveStarSatisfaction'),
      description: t('trust.bestRateGuarantee'),
      color: "text-accent"
    },
    {
      icon: Heart,
      title: t('about.localExperience'),
      description: t('about.localExperienceDesc'),
      color: "text-red-500"
    }
  ];

  return (
    <>
      {/* Enhanced Mobile Header */}
      <header className={cn(
        "mobile-header transition-all duration-500 mobile-gpu-accelerated",
        isScrolled 
          ? "shadow-xl bg-background/95 backdrop-blur-xl border-b border-border/50" 
          : "bg-background/80 backdrop-blur-sm shadow-sm"
      )}>
        <div className="flex items-center justify-between h-full px-5">
          {/* Enhanced Logo with better touch target */}
          <Link 
            to="/" 
            className="mobile-transform-hover mobile-touch-target mobile-focus-ring"
            aria-label="Habitat Lobby - Home"
          >
            <Logo size="lg" />
          </Link>

          {/* Enhanced Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-6">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "text-sm font-semibold transition-all duration-300 mobile-transform-hover mobile-focus-ring relative group px-3 py-2 rounded-md",
                        isActivePage(item.href)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-label={item.label}
                    >
                      {item.label}
                      {isActivePage(item.href) && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              
              {/* Habitat Lobby Submenu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "text-sm font-semibold transition-all duration-300 mobile-transform-hover mobile-focus-ring",
                    (isActivePage("/about") || isActivePage("/policies") || isActivePage("/faq"))
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t('pages.about.title')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-80">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                          <Building2 className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            {t('pages.about.title')}
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            {t('footer.description')}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </div>
                    <div className="grid gap-1">
                      {habitatLobbySubmenu.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center space-x-2">
                                <Icon className="h-4 w-4" />
                                <div className="text-sm font-medium leading-none">{item.label}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        );
                      })}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Enhanced Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Weather Widget */}
            <div className="mobile-transform-hover">
              <WeatherWidget />
            </div>
            


            {/* Enhanced Book Now Button */}
            <Button 
              size="sm" 
              asChild 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl mobile-transform-hover mobile-focus-ring border-0 px-6 py-2.5 rounded-full font-semibold"
            >
              <Link to="/apartments">
                <Calendar className="h-4 w-4 mr-2" />
                {t('booking.title')}
                <Sparkles className="h-3 w-3 ml-1" />
              </Link>
            </Button>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Enhanced Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mobile-touch-target mobile-focus-ring"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0 overflow-hidden">
              {/* Enhanced Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center space-x-3">
                  <Logo size="md" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-touch-target mobile-focus-ring"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Enhanced Mobile Navigation */}
              <nav className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-3">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 mobile-transform-hover mobile-focus-ring group",
                          isActivePage(item.href)
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label={`Navigate to ${item.label}`}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                          isActivePage(item.href)
                            ? "bg-primary/20"
                            : "bg-muted/50 group-hover:bg-primary/10"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-base">{item.label}</span>
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        {isActivePage(item.href) && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Link>
                    );
                  })}
                  
                  {/* Habitat Lobby Section */}
                  <div className="pt-4 border-t border-border/50">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-2">
                      {t('pages.about.title')}
                    </h3>
                    {habitatLobbySubmenu.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={cn(
                            "flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 mobile-transform-hover mobile-focus-ring group",
                            isActivePage(item.href)
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                          aria-label={`Navigate to ${item.label}`}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                            isActivePage(item.href)
                              ? "bg-primary/20"
                              : "bg-muted/50 group-hover:bg-primary/10"
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-base">{item.label}</span>
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          </div>
                          {isActivePage(item.href) && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Enhanced Mobile Quick Actions */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                    {t('ui.quickActions')}
                  </h3>
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button 
                        key={action.title}
                        variant={action.variant}
                        className="w-full mobile-button-accent mobile-transform-hover mobile-focus-ring h-16"
                        asChild
                      >
                        <Link to={action.href} onClick={() => setIsMobileMenuOpen(false)}>
                          <Icon className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">{action.title}</div>
                            <div className="text-xs opacity-90">{action.description}</div>
                          </div>
                        </Link>
                      </Button>
                    );
                  })}
                </div>

                {/* Enhanced Mobile Features */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                    {t('pages.home.whyChooseUs')}
                  </h3>
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div 
                        key={feature.title}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 mobile-transform-hover"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${feature.color}`} />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-foreground">{feature.title}</span>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {feature.title === t('ui.premiumQuality') ? "4.9/5" :
                           feature.title === t('about.primeLocation') ? "City Center" : "Local"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </nav>

              {/* Enhanced Mobile Menu Footer */}
              <div className="p-6 border-t border-border/50 space-y-4 bg-gradient-to-r from-primary/5 to-accent/5">
                {/* Weather Widget */}
                <div className="flex justify-center">
                  <WeatherWidget />
                </div>

                {/* Language Switcher */}
                <LanguageSwitcher className="w-full justify-center" />

                {/* Enhanced Contact Info */}
                <div className="text-center space-y-3">
                  <p className="text-xs text-muted-foreground font-medium">
                    {t('ui.needHelp')}
                  </p>
                  <div className="flex items-center justify-center space-x-6 text-sm">
                    <a 
                      href="tel:+306977690685" 
                      className="flex items-center space-x-2 text-primary hover:text-primary/80 mobile-transform-hover mobile-focus-ring"
                      aria-label="Call us at +30 697 769 0685"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="font-semibold">+30 697 769 0685</span>
                    </a>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Alexandras 59, Trikala 42100, Greece</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Enhanced Mobile Bottom Navigation */}
      <nav className="mobile-nav lg:hidden">
        <div className="flex items-center justify-around h-full px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "mobile-nav-item mobile-touch-target mobile-focus-ring mobile-tap-highlight",
                  isActivePage(item.href) && "active"
                )}
                aria-label={`Navigate to ${item.label}`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActivePage(item.href) && (
                  <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
          
          {/* Enhanced Quick Book Button */}
          <Link
            to="/apartments"
            className="mobile-nav-item mobile-touch-target mobile-focus-ring mobile-tap-highlight text-accent relative"
            aria-label="Book your stay"
          >
            <div className="relative">
              <Calendar className="h-6 w-6 mb-1" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-semibold">Book</span>
          </Link>
        </div>
      </nav>

      {/* Enhanced Mobile Progress Bar */}
      <div className="mobile-progress lg:hidden">
        <div 
          className="mobile-progress-bar" 
          style={{ 
            width: `${Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%` 
          }}
        />
      </div>
    </>
  );
};

export default Header;
