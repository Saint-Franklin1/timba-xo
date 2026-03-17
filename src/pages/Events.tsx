import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { fetchTable } from "@/lib/supabase-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { getImageUrl } from "@/lib/image-utils";
import { format } from "date-fns";

interface Event {
  id: string;
  name: string;
  type: string | null;
  date: string | null;
  venue_section: string | null;
  description: string | null;
  performers: string | null;
  images: string[] | null;
  status: string | null;
}

export default function Events() {
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchTable<Event>("events", { orderBy: "date", ascending: true }),
  });

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">What's Happening</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">Events & Activities</h1>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="bg-card border-border hover:border-primary/40 transition-all overflow-hidden">
                  <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                    {event.images && (event.images as string[]).length > 0 ? (
                      <img src={(event.images as string[])[0]} alt={event.name} className="w-full h-full object-cover" />
                    ) : (
                      <Calendar className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-xs text-primary mb-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {event.date ? format(new Date(event.date), "EEEE, MMM dd yyyy • h:mm a") : "TBA"}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{event.name}</h3>
                    {event.venue_section && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5" /> {event.venue_section}
                      </div>
                    )}
                    {event.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{event.description}</p>}
                    {event.performers && <p className="text-xs text-primary mt-2">Featuring: {event.performers}</p>}
                    <Button size="sm" className="mt-4 bg-gradient-gold text-primary-foreground hover:opacity-90">RSVP</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No events scheduled yet. Stay tuned for exciting announcements!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
