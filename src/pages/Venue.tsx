import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { fetchTable } from "@/lib/supabase-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Users } from "lucide-react";
import { getImageUrl } from "@/lib/image-utils";

interface VenueSection {
  id: string;
  name: string;
  description: string | null;
  capacity: number | null;
  images: string[] | null;
}

const defaultSections = [
  { name: "Main Club Floor", description: "The heart of Timba XO — a sprawling dance floor with state-of-the-art sound and lighting.", capacity: 500 },
  { name: "VIP Lounge", description: "Exclusive seating with premium bottle service and dedicated hosts.", capacity: 50 },
  { name: "VVIP Suite", description: "Ultra-private suites for the most discerning guests. Full privacy, full luxury.", capacity: 20 },
  { name: "Terrace Lounge", description: "An open-air retreat with ambient lighting and panoramic views.", capacity: 100 },
  { name: "Timber Outdoor & Arena", description: "Our signature outdoor space for large events, concerts, and community gatherings.", capacity: 1000 },
];

export default function Venue() {
  const { data: sections } = useQuery({
    queryKey: ["venue_sections"],
    queryFn: () => fetchTable<VenueSection>("venue_sections"),
  });

  const displaySections = sections && sections.length > 0 ? sections : defaultSections;

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">Our Spaces</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">Venue Sections</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySections.map((section, i) => (
              <Card key={i} className="bg-card border-border hover:border-primary/40 transition-all overflow-hidden">
                <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                  {'images' in section && getImageUrl(section.images) ? (
                    <img src={getImageUrl(section.images)!} alt={section.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <Building2 className="h-12 w-12 text-muted-foreground/30" />
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-display text-xl font-semibold text-foreground">{section.name}</h3>
                  {section.description && <p className="text-sm text-muted-foreground mt-2">{section.description}</p>}
                  {section.capacity && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                      <Users className="h-3.5 w-3.5" /> Capacity: {section.capacity}
                    </div>
                  )}
                  <Link to="/reservations">
                    <Button size="sm" className="mt-4 bg-gradient-gold text-primary-foreground hover:opacity-90">Reserve Table</Button>
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
