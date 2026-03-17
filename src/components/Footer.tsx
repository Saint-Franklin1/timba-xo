import { Link } from "react-router-dom";
import { Wine, Phone, Mail, Instagram, Facebook, Twitter, ExternalLink, Github, Code } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const quickLinks = [
  { label: "Landing Page", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Events & Activities", to: "/events" },
  { label: "Drinks Cellar", to: "/drinks" },
  { label: "Dining", to: "/dining" },
  { label: "Awards & Certifications", to: "/awards" },
  { label: "Careers", to: "/careers" },
  { label: "Impact", to: "/impact" },
  { label: "Contact", to: "/contact" },
];

const socials = [
  {
    icon: Facebook,
    label: "Timba-XO",
    handle: "@XOTimba",
    href: "https://facebook.com/XOTimba",
    key: "facebook",
  },
  {
    icon: Instagram,
    label: "TIMBA XO",
    handle: "@timbaxo",
    href: "https://instagram.com/timbaxo",
    key: "instagram",
  },
  {
    icon: Twitter,
    label: "Twitter",
    handle: "@XOTimba",
    href: "https://twitter.com/XOTimba",
    key: "twitter",
  },
];

export default function Footer() {
  const { data: partners } = useQuery({
    queryKey: ["partner-logos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("media_assets")
        .select("*")
        .eq("category", "partner")
        .eq("is_hidden", false);
      return data ?? [];
    },
  });

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1 — Identity */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wine className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold text-gradient-gold">
                Timba XO
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium Entertainment &amp; Lifestyle Destination in Eldoret.
              A luxury entertainment complex combining nightlife, premium
              drinks, fine dining, and unforgettable events.
            </p>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              Contact Information
            </h4>
            <div className="flex flex-col gap-4 text-sm text-muted-foreground">
              <div>
                <span className="block text-foreground font-medium mb-0.5">
                  Job Applications
                </span>
                <a
                  href="mailto:officialtimbaxo@gmail.com"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  officialtimbaxo@gmail.com
                </a>
              </div>
              <div>
                <span className="block text-foreground font-medium mb-0.5">
                  Official Inquiries
                </span>
                <a
                  href="mailto:info@timbaxo.com"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  info@timbaxo.com
                </a>
              </div>
              <div>
                <span className="block text-foreground font-medium mb-0.5">
                  Human Resources
                </span>
                <a
                  href="mailto:hr@timbaxo.com"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  hr@timbaxo.com
                </a>
              </div>
              <div>
                <span className="block text-foreground font-medium mb-0.5">
                  Phone
                </span>
                <a
                  href="tel:+254792611998"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  0792 611 998
                </a>
              </div>
            </div>
          </div>

          {/* Column 4 — Social */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              Follow Us
            </h4>
            <div className="flex flex-col gap-4">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="block text-foreground font-medium text-sm">
                      {s.label}
                    </span>
                    <span className="text-xs">{s.handle}</span>
                  </div>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 5 — Developer */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              Developer
            </h4>
            <div className="flex flex-col gap-4 text-sm text-muted-foreground">
              <a
                href="https://github.com/Saint-Franklin1"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4 text-primary flex-shrink-0" />
                GitHub
                <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://franklineportfolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Code className="h-4 w-4 text-primary flex-shrink-0" />
                Portfolio
                <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="mailto:franklinekimtai12@gmail.com"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                franklinekimtai12@gmail.com
              </a>
              <a
                href="tel:+254768711528"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                +254 768 711 528
              </a>
            </div>
          </div>
        </div>

        {/* Partner Logos */}
        {partners && partners.length > 0 && (
          <div className="border-t border-border mt-10 pt-8">
            <h5 className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-6">
              Our Partners
            </h5>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {partners.map((p) => (
                <img
                  key={p.id}
                  src={p.image_url ?? ""}
                  alt={p.title ?? "Partner"}
                  className="h-10 object-contain opacity-60 hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Timba XO. All Rights Reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
