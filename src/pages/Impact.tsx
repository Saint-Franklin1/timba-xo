import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Heart, Briefcase } from "lucide-react";

const stats = [
  { icon: Briefcase, value: "50+", label: "Employees" },
  { icon: Calendar, value: "200+", label: "Events Hosted" },
  { icon: Users, value: "100K+", label: "Guests Served" },
  { icon: Heart, value: "20+", label: "Community Projects" },
];

const testimonials = [
  { name: "James K.", text: "Timba XO is the best entertainment venue in the Rift Valley. The VIP experience is unmatched!", role: "Regular Patron" },
  { name: "Sarah M.", text: "An incredible atmosphere, premium drinks, and world-class service. Highly recommended!", role: "Event Organizer" },
  { name: "David O.", text: "Working at Timba XO has been transformative. The team culture is exceptional.", role: "Staff Member" },
];

export default function Impact() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">Making a Difference</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">Our Impact</h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((s, i) => (
              <Card key={i} className="bg-card border-border text-center">
                <CardContent className="p-6">
                  <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-display text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-6">
                  <p className="text-muted-foreground italic leading-relaxed">"{t.text}"</p>
                  <div className="mt-4">
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-primary">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
