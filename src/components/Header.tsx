import React from "react";
import { NavLink, Link } from "react-router-dom";

const navItems = [
  { to: "/apartments", label: "Apartments" },
  { to: "/about", label: "About Trikala" },
  { to: "/experiences", label: "Experiences" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
  { to: "/policies", label: "Policies" },
];

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container h-14 flex items-center justify-between">
        <Link to="/" className="font-display text-lg">Habitat Lobby</Link>
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "text-sm hover-scale",
                  isActive ? "text-primary font-medium" : "text-foreground/80 hover:text-foreground",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link to="/#apartments" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover-scale">
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
