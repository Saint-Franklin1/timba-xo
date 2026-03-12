import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

const awards = [
  { title: "Best Entertainment Venue", org: "Kenya Hospitality Awards", year: "2024" },
  { title: "Premium Nightlife Experience", org: "East Africa Leisure Awards", year: "2024" },
  { title: "Excellence in Hospitality", org: "Eldoret Business Awards", year: "2024" },
  { title: "Top VIP Experience", org: "Nightlife Excellence Awards", year: "2025" },
];

export default function Awards() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">Recognition</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">Awards & Certifications</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((a, i) => (
              <Card key={i} className="bg-card border-border text-center hover:border-primary/40 transition-all">
                <CardContent className="p-6">
                  <Award className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{a.org}</p>
                  <p className="text-xs text-primary mt-1">{a.year}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
