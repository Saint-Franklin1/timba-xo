import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, Target, TrendingUp, Building2 } from "lucide-react";

export default function About() {
  const stats = [
    { icon: Building2, label: "Established", value: "2024" },
    { icon: TrendingUp, label: "Investment", value: "Premium" },
    { icon: Eye, label: "Vision", value: "World-Class" },
    { icon: Target, label: "Mission", value: "Excellence" },
  ];

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">Our Story</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">About Timba XO</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">The Brand Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Timba XO is Eldoret's most prestigious entertainment destination, born from a vision to 
                create a world-class nightlife and dining experience in the heart of Kenya's North Rift. 
                Our establishment combines luxury hospitality with vibrant entertainment.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                With a substantial investment in state-of-the-art facilities, premium interiors, and 
                top-tier service staff, Timba XO sets the gold standard for entertainment venues in the region.
              </p>
              <Link to="/services">
                <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90">
                  Explore Our Services
                </Button>
              </Link>
            </div>
            <div className="aspect-[4/3] rounded-2xl bg-secondary/50 border border-border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Brand Image</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-6 rounded-xl bg-card border border-border">
                <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-card border border-border">
              <Eye className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading entertainment and hospitality destination in East Africa, setting 
                unmatched standards in luxury nightlife, dining, and event experiences.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-card border border-border">
              <Target className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To deliver exceptional entertainment experiences through premium service, curated events, 
                world-class beverages, and an atmosphere that celebrates sophistication and joy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
