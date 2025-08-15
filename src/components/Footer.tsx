import React from "react";
import { Link } from "react-router-dom";
import { LogoWithText } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import InstagramFeed from "@/components/InstagramFeed";
import ViberIcon from "@/components/ui/viber-icon";

const Footer: React.FC = () => {
  const openViber = () => {
    // Replace 'stefanos_habitat' with the actual Viber username
    window.open('viber://chat?number=stefanos_habitat', '_blank');
    // Fallback for desktop
    setTimeout(() => {
      window.open('https://viber.com/stefanos_habitat', '_blank');
    }, 1000);
  };

  return (
    <footer className="bg-primary text-white">
      <div className="container py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <LogoWithText
              logoVariant="white"
              className="text-white mb-4"
            />
            <p className="text-white/80 mb-6 leading-relaxed max-w-md">
              Boutique apartments in Trikala, Greece. Book direct for the best experience, personal tips, and authentic local insights from your host Stefanos.
            </p>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Link to="/about-trikala" className="text-white/80 hover:text-white transition-colors block mb-2">
                  About Trikala
                </Link>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors block mb-2">
                  About Habitat Lobby
                </Link>
                <Link to="/faq" className="text-white/80 hover:text-white transition-colors block">
                  FAQ
                </Link>
              </div>
              <div>
                <Link to="/apartments" className="text-white/80 hover:text-white transition-colors block mb-2">
                  Our Apartments
                </Link>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors block mb-2">
                  Contact Us
                </Link>
                <Link to="/policies" className="text-white/80 hover:text-white transition-colors block">
                  Policies
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg mb-4 text-accent">Contact</h4>
            <div className="space-y-3 text-white/80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:info@habitatlobby.com"
                  className="hover:text-white transition-colors"
                >
                  info@habitatlobby.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a
                  href="tel:+302431234567"
                  className="hover:text-white transition-colors"
                >
                  +30 243 123 4567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Trikala, Greece</span>
              </div>

              {/* Viber CTA */}
              <div className="pt-2">
                <Button
                  onClick={openViber}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-2 h-auto"
                >
                  <ViberIcon className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Chat on Viber</div>
                    <div className="text-xs text-white/60">@stefanos_habitat</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Instagram Gallery & Social */}
          <div>
            <h4 className="font-serif text-lg mb-4 text-accent">Follow Us</h4>
            <InstagramFeed
              maxPosts={6}
              instagramUsername="habitatlobby"
              accessToken={import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Habitat Lobby. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/policies" className="text-white/80 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/policies" className="text-white/80 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
