import React from "react";
const Footer: React.FC = () => {
  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-2xl">Habitat Lobby</h3>
          <p className="text-muted-foreground mt-2">Boutique apartments in Trikala, Greece. Book direct for the best experience and personal tips.</p>
        </div>
        <div>
          <h4 className="font-medium">Contact</h4>
          <p className="text-muted-foreground mt-2">hello@habitatlobby.com<br/>+30 210 000 0000</p>
        </div>
        <div>
          <h4 className="font-medium">Follow</h4>
          <p className="text-muted-foreground mt-2">Instagram · Facebook</p>
          <p className="text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} Habitat Lobby. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
