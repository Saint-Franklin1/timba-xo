import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { fetchTable } from "@/lib/supabase-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UtensilsCrossed, ChefHat } from "lucide-react";
import { getImageUrl } from "@/lib/image-utils";

interface Dish {
  id: string;
  dish_name: string;
  chef: string | null;
  cuisine_type: string | null;
  ingredients: string | null;
  description: string | null;
  price: number;
  availability: boolean;
  images: string[] | null;
}

export default function Dining() {
  const { data: dishes = [] } = useQuery({
    queryKey: ["dining"],
    queryFn: () => fetchTable<Dish>("dining", { orderBy: "created_at" }),
  });

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">Culinary Excellence</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">Dining & Cuisine</h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Savor exquisite dishes crafted by our world-class chefs.
            </p>
          </div>

          {dishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes.map((dish) => (
                <Card key={dish.id} className="bg-card border-border hover:border-primary/40 transition-all overflow-hidden">
                  <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                    {getImageUrl(dish.images) ? (
                      <img src={getImageUrl(dish.images)!} alt={dish.dish_name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <UtensilsCrossed className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    {dish.cuisine_type && <p className="text-xs text-primary font-medium uppercase">{dish.cuisine_type}</p>}
                    <h3 className="font-display text-xl font-semibold text-foreground mt-1">{dish.dish_name}</h3>
                    {dish.chef && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <ChefHat className="h-3.5 w-3.5" /> Chef {dish.chef}
                      </div>
                    )}
                    {dish.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{dish.description}</p>}
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-primary font-bold">KSh {dish.price.toLocaleString()}</p>
                      <Link to="/reservations">
                        <Button size="sm" className="bg-gradient-gold text-primary-foreground hover:opacity-90">Book Table</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Our menu is being prepared. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
