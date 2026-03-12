import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Drinks", to: "/drinks" },
  { label: "Dining", to: "/dining" },
  { label: "Events", to: "/events" },
  { label: "Venue", to: "/venue" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Wine className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-gradient-gold">Timba XO</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === l.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/reservations">
            <Button size="sm" className="ml-2 bg-gradient-gold text-primary-foreground hover:opacity-90">
              Reserve Table
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === l.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/reservations" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full bg-gradient-gold text-primary-foreground">
                Reserve Table
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
