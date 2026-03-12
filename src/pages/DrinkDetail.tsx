import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { fetchById } from "@/lib/supabase-helpers";
import { Button } from "@/components/ui/button";
import { Wine, ArrowLeft } from "lucide-react";

interface Drink {
  id: string;
  name: string;
  brand: string | null;
  type: string | null;
  origin: string | null;
  year_manufactured: number | null;
  alcohol_content: number | null;
  bottle_size: string | null;
  quality: string | null;
  price: number;
  images: string[] | null;
  stock_status: string | null;
  tasting_notes: string | null;
  provenance: string | null;
}

export default function DrinkDetail() {
  const { id } = useParams();
  const { data: drink, isLoading } = useQuery({
    queryKey: ["drink", id],
    queryFn: () => fetchById<Drink>("drinks", id!),
    enabled: !!id,
  });

  if (isLoading) return <Layout><div className="py-20 text-center text-muted-foreground">Loading...</div></Layout>;
  if (!drink) return <Layout><div className="py-20 text-center text-muted-foreground">Drink not found</div></Layout>;

  const details = [
    { label: "Brand", value: drink.brand },
    { label: "Type", value: drink.type },
    { label: "Origin", value: drink.origin },
    { label: "Year", value: drink.year_manufactured },
    { label: "Alcohol", value: drink.alcohol_content ? `${drink.alcohol_content}%` : null },
    { label: "Bottle Size", value: drink.bottle_size },
    { label: "Quality", value: drink.quality },
  ].filter((d) => d.value);

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Link to="/drinks" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Drinks
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square rounded-2xl bg-secondary/50 border border-border flex items-center justify-center overflow-hidden">
              {drink.images && (drink.images as string[]).length > 0 ? (
                <img src={(drink.images as string[])[0]} alt={drink.name} className="w-full h-full object-cover" />
              ) : (
                <Wine className="h-24 w-24 text-muted-foreground/30" />
              )}
            </div>

            <div>
              <p className="text-xs text-primary font-medium uppercase tracking-wider">{drink.type || "Spirit"}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">{drink.name}</h1>
              <p className="text-3xl font-bold text-primary mt-4">KSh {drink.price.toLocaleString()}</p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {details.map((d) => (
                  <div key={d.label} className="p-3 rounded-lg bg-card border border-border">
                    <p className="text-xs text-muted-foreground">{d.label}</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{d.value}</p>
                  </div>
                ))}
              </div>

              {drink.tasting_notes && (
                <div className="mt-8">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">Tasting Notes</h3>
                  <p className="text-muted-foreground leading-relaxed">{drink.tasting_notes}</p>
                </div>
              )}

              {drink.provenance && (
                <div className="mt-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">Provenance</h3>
                  <p className="text-muted-foreground leading-relaxed">{drink.provenance}</p>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <Link to="/reservations">
                  <Button size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90">
                    Reserve in VIP
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
