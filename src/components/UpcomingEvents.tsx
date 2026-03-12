import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchTable } from "@/lib/supabase-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  name: string;
  type: string | null;
  date: string | null;
  venue_section: string | null;
  description: string | null;
  images: string[] | null;
  status: string | null;
}

export default function UpcomingEvents() {
  const { data: events = [] } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: () => fetchTable<Event>("events", { limit: 3, orderBy: "date", ascending: true, filters: { status: "upcoming" } }),
  });

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-medium text-primary tracking-wider uppercase">What's On</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-gradient-gold">Upcoming Events</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Join us for unforgettable nights, live performances, and exclusive gatherings.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="bg-card border-border hover:border-primary/40 transition-all group overflow-hidden">
                <div className="aspect-video bg-secondary/50 flex items-center justify-center overflow-hidden">
                  {event.images && (event.images as string[]).length > 0 ? (
                    <img src={(event.images as string[])[0]} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <Calendar className="h-12 w-12 text-muted-foreground/30" />
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-xs text-primary mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {event.date ? format(new Date(event.date), "MMM dd, yyyy") : "TBA"}
                    {event.venue_section && (
                      <>
                        <span className="text-border">•</span>
                        <MapPin className="h-3.5 w-3.5" />
                        {event.venue_section}
                      </>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">{event.name}</h3>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{event.description}</p>
                  )}
                  <Link to={`/events`}>
                    <Button size="sm" className="mt-4 bg-gradient-gold text-primary-foreground hover:opacity-90">
                      RSVP Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Exciting events coming soon. Stay tuned!</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/events">
            <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 gap-2">
              View All Events <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
