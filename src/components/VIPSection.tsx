import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, Star } from "lucide-react";
import vipImage from "@/assets/vip-experience.jpg";

export default function VIPSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(38_70%_50%_/_0.06)_0%,_transparent_60%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden order-2 lg:order-1">
            <img src={vipImage} alt="Timba XO VIP Experience - luxury lounge seating" className="w-full h-full object-cover" loading="lazy" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
              <Star className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary tracking-wider uppercase">Exclusive</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-4">
              The VIP Experience
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Elevate your night at Timba XO with our exclusive VIP and VVIP sections. 
              Enjoy premium bottle service, private booths, dedicated hosts, and an atmosphere 
              designed for those who demand nothing but the best.
            </p>
            <ul className="space-y-2 mb-8">
              {["Private VIP & VVIP booths", "Premium bottle service", "Dedicated personal hosts", "Priority event access"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/reservations">
              <Button size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2 px-8">
                <Crown className="h-5 w-5" />
                Reserve VIP Table
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
