import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wine, Calendar } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(38_70%_50%_/_0.08)_0%,_transparent_70%)]" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5">
          <span className="text-xs font-medium text-primary tracking-wider uppercase">
            Eldoret's Premier Entertainment Club
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="text-gradient-gold">Timba XO</span>
          <br />
          <span className="text-foreground text-3xl md:text-4xl lg:text-5xl font-medium">
            Where Luxury Meets Nightlife
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed">
          Indulge in an unparalleled experience of premium drinks, exquisite dining,
          electrifying events, and world-class VIP hospitality.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/drinks">
            <Button size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2 px-8 h-12 text-base">
              <Wine className="h-5 w-5" />
              Explore Drinks
            </Button>
          </Link>
          <Link to="/reservations">
            <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 gap-2 px-8 h-12 text-base">
              <Calendar className="h-5 w-5" />
              Book VIP Table
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
