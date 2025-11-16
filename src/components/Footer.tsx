import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  ExternalLink,
  Heart,
  Star,
  Shield,
  Award,
  Clock,
  Globe,
  ArrowRight,
  Sparkles,
  Leaf,
  Mountain,
  Coffee,
  Bike,
  Castle,
  CheckCircle,
  Users,
  Calendar
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    accommodation: [
      { name: "All Apartments", href: "/apartments", description: "Browse our premium properties" },
      { name: "Check Availability", href: "/check-availability", description: "Find your perfect dates" },
      { name: "Contact Us", href: "/contact", description: "Get in touch for special requests" },
      { name: "Reviews", href: "/reviews", description: "Read guest experiences" },
    ],
    experiences: [
      { name: "About Trikala", href: "/about-trikala", description: "Discover the city's charm" },
      { name: "Cycling City", href: "/about-trikala/cycling-city", description: "Explore on two wheels" },
      { name: "Meteora Day Trip", href: "/about-trikala/nature-day-trips", description: "Visit the monasteries" },
      { name: "Local Life", href: "/about-trikala/local-life", description: "Authentic Greek experience" },
    ],
    support: [
      { name: "Contact Us", href: "/contact", description: "We're here to help" },
      { name: "FAQ", href: "/faq", description: "Common questions answered" },
      { name: "About Us", href: "/about", description: "Learn about Habitat Lobby" },
      { name: "Policies", href: "/policies", description: "Terms and conditions" },
    ],
    legal: [
      { name: "Policies", href: "/policies", description: "Terms and conditions" },
      { name: "FAQ", href: "/faq", description: "Common questions answered" },
      { name: "Contact", href: "/contact", description: "Get in touch" },
      { name: "Reviews", href: "/reviews", description: "Guest experiences" },
    ],
  };

  const features = [
    {
      icon: MapPin,
      title: t('about.primeLocation'),
      description: "City center, walking distance to everything",
      color: "text-primary",
      badge: "City Center"
    },
    {
      icon: Star,
      title: t('ui.premiumQuality'),
      description: "4.9/5 guest rating, luxury amenities",
      color: "text-accent",
      badge: "4.9/5"
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Instant confirmation, secure payments",
      color: "text-green-600",
      badge: "Secure"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Always here to help you",
      color: "text-blue-600",
      badge: "24/7"
    }
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com/habitatlobby",
      icon: Instagram,
      color: "hover:text-pink-500"
    },
    {
      name: "Facebook",
      href: "https://facebook.com/habitatlobby",
      icon: Facebook,
      color: "hover:text-blue-600"
    },
    {
      name: "Twitter",
      href: "https://twitter.com/habitatlobby",
      icon: Twitter,
      color: "hover:text-blue-400"
    }
  ];

  return (
    <footer className="mobile-footer bg-gradient-to-br from-background via-muted/30 to-background border-t border-border/50">
      {/* Main Footer Content */}
      <div className="mobile-container py-16">
        {/* Enhanced Top Section - Brand & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Enhanced Brand Section */}
          <div className="space-y-8">
                         <div className="flex items-center space-x-4">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                 <img 
                   src="/favicon.svg" 
                   alt="Habitat Lobby Logo" 
                   className="w-full h-full object-cover"
                 />
               </div>
               <div>
                 <h3 className="text-3xl font-display font-bold text-foreground leading-tight">
                   Habitat Lobby
                 </h3>
                 <p className="text-sm text-muted-foreground font-medium">
                   Premium Apartments in Trikala
                 </p>
               </div>
             </div>

            <p className="mobile-text-body text-muted-foreground max-w-lg leading-relaxed">
              Experience authentic Greek hospitality in the heart of Trikala. 
              Our premium apartments offer the perfect blend of modern comfort 
              and traditional charm, with stunning views and local experiences.
            </p>

            {/* Enhanced Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-muted-foreground group">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-medium">Alexandras 59, Trikala 42100, Greece</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-muted-foreground group">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <a 
                    href="tel:+306977690685" 
                    className="text-sm font-medium hover:text-primary transition-colors mobile-focus-ring"
                    aria-label="Call us at +30 697 769 0685"
                  >
                    +30 697 769 0685
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-muted-foreground group">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <a 
                    href="mailto:admin@habitatlobby.com" 
                    className="text-sm font-medium hover:text-primary transition-colors mobile-focus-ring"
                    aria-label="Email us at admin@habitatlobby.com"
                  >
                    admin@habitatlobby.com
                  </a>
                </div>
              </div>
            </div>

            {/* Enhanced Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    className={`w-12 h-12 p-0 rounded-xl hover:bg-primary/10 hover:text-primary mobile-transform-hover mobile-focus-ring ${social.color}`}
                    asChild
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <Icon className="w-5 h-5" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 mobile-transform-hover mobile-focus-ring group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-base text-foreground">
                          {feature.title}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {feature.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-6 capitalize">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors mobile-transform-hover mobile-focus-ring group flex items-start space-x-2"
                      title={link.description}
                    >
                      <ArrowRight className="w-3 h-3 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>



        {/* Enhanced Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex items-center space-x-3 text-muted-foreground group">
                <Icon className={`w-5 h-5 ${feature.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-medium">{feature.title}</span>
              </div>
            );
          })}
        </div>


      </div>

      {/* Enhanced Bottom Bar */}
      <div className="border-t border-border/50 bg-muted/30">
        <div className="mobile-container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <span>© {currentYear} Habitat Lobby. All rights reserved.</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>•</span>
                <span className="flex items-center space-x-1">
                  Made with <Heart className="w-4 h-4 text-red-500" /> in Trikala
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              {footerLinks.legal.slice(0, 3).map((link) => (
                <Link 
                  key={link.name}
                  to={link.href} 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors mobile-transform-hover mobile-focus-ring"
                  title={link.description}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
