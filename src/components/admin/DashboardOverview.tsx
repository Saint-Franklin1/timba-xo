import { useQuery } from "@tanstack/react-query";
import { fetchTable } from "@/lib/supabase-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wine, Calendar, MessageSquare, Image, BookOpen } from "lucide-react";

export default function DashboardOverview() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["drink_bookings"],
    queryFn: () => fetchTable<Record<string, unknown>>("drink_bookings", { orderBy: "created_at" }),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchTable<Record<string, unknown>>("events", { orderBy: "created_at" }),
  });

  const { data: drinks = [] } = useQuery({
    queryKey: ["drinks"],
    queryFn: () => fetchTable<Record<string, unknown>>("drinks", { orderBy: "created_at" }),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["contact_submissions"],
    queryFn: () => fetchTable<Record<string, unknown>>("contact_submissions", { orderBy: "created_at" }),
  });

  const { data: media = [] } = useQuery({
    queryKey: ["media_assets_overview"],
    queryFn: () => fetchTable<Record<string, unknown>>("media_assets", { orderBy: "uploaded_at" }),
  });

  const stats = [
    { label: "Total Drinks", value: drinks.length, icon: Wine, color: "text-primary" },
    { label: "Upcoming Events", value: events.length, icon: Calendar, color: "text-blue-400" },
    { label: "Drink Bookings", value: bookings.length, icon: BookOpen, color: "text-green-400" },
    { label: "Media Assets", value: media.length, icon: Image, color: "text-purple-400" },
    { label: "Messages", value: messages.length, icon: MessageSquare, color: "text-amber-400" },
  ];

  const recentBookings = bookings.slice(0, 5);
  const recentMessages = messages.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <s.icon className={`h-6 w-6 ${s.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Recent Drink Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{String(b.customer_name)}</p>
                      <p className="text-xs text-muted-foreground">{String(b.drink_name)}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      b.status === "confirmed" ? "bg-green-500/10 text-green-400" :
                      b.status === "completed" ? "bg-blue-500/10 text-blue-400" :
                      "bg-amber-500/10 text-amber-400"
                    }`}>{String(b.status)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet</p>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((m, i) => (
                  <div key={i} className="border-b border-border pb-2 last:border-0">
                    <p className="text-sm font-medium text-foreground">{String(m.name)}</p>
                    <p className="text-xs text-muted-foreground truncate">{String(m.message)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
