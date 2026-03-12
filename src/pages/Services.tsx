import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { fetchTable } from "@/lib/supabase-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Moon, UtensilsCrossed, Wine, PartyPopper, Gamepad2 } from "lucide-react";

const defaultServices = [
  { name: "Nightlife", description: "Experience Eldoret's most electrifying nightlife with world-class DJs, live performances, and an atmosphere that never sleeps.", icon: Moon },
  { name: "Dining", description: "Savor exquisite cuisine prepared by our talented chefs, featuring local and international dishes crafted with the finest ingredients.", icon: UtensilsCrossed },
  { name: "Premium Drinks", description: "Explore our extensive cellar of premium spirits, fine wines, champagnes, and signature cocktails curated for discerning tastes.", icon: Wine },
  { name: "Catering & Events", description: "From corporate gatherings to private celebrations, our catering team delivers bespoke experiences tailored to your vision.", icon: PartyPopper },
  { name: "Gaming & Entertainment", description: "Enjoy pool tournaments, gaming nights, and interactive entertainment activities in our dedicated recreation zones.", icon: Gamepad2 },
];

interface Service {
  id: string;
  name: string;
  description: string | null;
  images: string[] | null;
}

export default function Services() {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchTable<Service>("services"),
  });

  const displayServices = services && services.length > 0
    ? services.map((s) => ({ ...s, icon: Moon }))
    : defaultServices;

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">What We Offer</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">Our Services</h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              From nightlife to fine dining, every detail is crafted for an extraordinary experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((service, i) => (
              <Card key={i} className="bg-card border-border hover:border-primary/40 transition-all group">
                <CardContent className="p-6">
                  <service.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">{service.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                  <Link to="/reservations">
                    <Button size="sm" className="bg-gradient-gold text-primary-foreground hover:opacity-90">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
