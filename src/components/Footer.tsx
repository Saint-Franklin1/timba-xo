import { Link } from "react-router-dom";
import { Wine, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

const quickLinks = [
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Drinks Cellar", to: "/drinks" },
  { label: "Events", to: "/events" },
  { label: "Careers", to: "/careers" },
  { label: "Awards", to: "/awards" },
  { label: "Impact", to: "/impact" },
  { label: "Reservations", to: "/reservations" },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wine className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold text-gradient-gold">Timba XO</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Eldoret's premier high-end entertainment club. Experience luxury nightlife, premium drinks, and unforgettable events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {quickLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Eldoret, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>info@timbaxo.com</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Timba XO. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
