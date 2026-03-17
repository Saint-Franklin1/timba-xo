import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchTable } from "@/lib/supabase-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wine, ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/image-utils";

interface Drink {
  id: string;
  name: string;
  brand: string | null;
  type: string | null;
  price: number;
  images: string[] | null;
  stock_status: string | null;
}

export default function FeaturedDrinks() {
  const { data: drinks = [] } = useQuery({
    queryKey: ["drinks", "featured"],
    queryFn: () => fetchTable<Drink>("drinks", { limit: 4, orderBy: "created_at" }),
  });

  return (
    <section className="py-20 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-medium text-primary tracking-wider uppercase">Our Collection</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-gradient-gold">Featured Drinks</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Discover our curated selection of premium spirits, fine wines, and craft cocktails.
          </p>
        </div>

        {drinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {drinks.map((drink) => (
              <Link key={drink.id} to={`/drinks/${drink.id}`}>
                <Card className="bg-card border-border hover:border-primary/40 transition-all group cursor-pointer h-full">
                  <div className="aspect-square bg-secondary/50 rounded-t-lg flex items-center justify-center overflow-hidden">
                    {drink.images && (drink.images as string[]).length > 0 ? (
                      <img src={(drink.images as string[])[0]} alt={drink.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <Wine className="h-16 w-16 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-primary font-medium uppercase">{drink.type || "Spirit"}</p>
                    <h3 className="font-display text-lg font-semibold mt-1 text-foreground">{drink.name}</h3>
                    {drink.brand && <p className="text-sm text-muted-foreground">{drink.brand}</p>}
                    <p className="text-primary font-bold mt-2">KSh {drink.price.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Wine className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Premium drinks coming soon. Check back shortly!</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/drinks">
            <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 gap-2">
              View Full Collection <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
