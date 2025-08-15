import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogoWithText } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/apartments", label: "Apartments" },
  { to: "/about-trikala", label: "About Trikala" },
  { to: "/about", label: "About Habitat Lobby" },
  { to: "/contact", label: "Contact" },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300 border-b shadow-sm",
      isScrolled
        ? "bg-primary/95 backdrop-blur-md supports-[backdrop-filter]:bg-primary/90"
        : "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80"
    )}>
      <div className="container h-16 flex items-center justify-between">
        <Link to="/" className="hover-scale">
          <LogoWithText
            logoSize="md"
            logoVariant={isScrolled ? "white" : "default"}
            className={isScrolled ? "text-white" : ""}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-all duration-200 relative py-2",
                  isScrolled
                    ? isActive
                      ? "text-accent"
                      : "text-white/90 hover:text-white hover:scale-105"
                    : isActive
                      ? "text-primary"
                      : "text-foreground/80 hover:text-foreground hover:scale-105"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            variant={isScrolled ? "ghost" : "outline"}
            size="sm"
            asChild
            className={isScrolled ? "text-white hover:bg-white/10" : ""}
          >
            <Link to="/contact">
              <Phone className="h-4 w-4" />
              Contact
            </Link>
          </Button>
          <Button variant="accent" size="sm" asChild className="bg-accent hover:bg-accent/90">
            <Link to="/apartments">Check Availability</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <LogoWithText logoSize="md" />
                </Link>
              </div>

              <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      [
                        "text-lg font-medium py-3 px-4 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary border-l-4 border-primary"
                          : "text-foreground/80 hover:text-foreground hover:bg-secondary",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="space-y-3 pt-6 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contact" onClick={() => setIsOpen(false)}>
                    <Phone className="h-4 w-4" />
                    Contact Us
                  </Link>
                </Button>
                <Button variant="accent" className="w-full bg-accent hover:bg-accent/90" asChild>
                  <Link to="/apartments" onClick={() => setIsOpen(false)}>
                    Check Availability
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
