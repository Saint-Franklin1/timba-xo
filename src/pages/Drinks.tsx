import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { fetchTable } from "@/lib/supabase-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Wine, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { getImageUrl } from "@/lib/image-utils";

interface Drink {
  id: string;
  name: string;
  brand: string | null;
  type: string | null;
  price: number;
  alcohol_content: number | null;
  year_manufactured: number | null;
  images: string[] | null;
  stock_status: string | null;
}

export default function Drinks() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: drinks = [] } = useQuery({
    queryKey: ["drinks"],
    queryFn: () => fetchTable<Drink>("drinks", { orderBy: "created_at" }),
  });

  const types = useMemo(() => [...new Set(drinks.map((d) => d.type).filter(Boolean))], [drinks]);

  const filtered = useMemo(() => {
    return drinks.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || (d.brand?.toLowerCase().includes(search.toLowerCase()));
      const matchesType = typeFilter === "all" || d.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [drinks, search, typeFilter]);

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">The Collection</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">Drinks Cellar</h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Browse our premium selection of spirits, wines, and cocktails.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search drinks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card border-border" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-card border-border">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t!}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((drink) => (
                <Link key={drink.id} to={`/drinks/${drink.id}`}>
                  <Card className="bg-card border-border hover:border-primary/40 transition-all group cursor-pointer h-full">
                    <div className="aspect-square bg-secondary/50 rounded-t-lg flex items-center justify-center overflow-hidden">
                      {getImageUrl(drink.images) ? (
                        <img src={getImageUrl(drink.images)!} alt={drink.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                      ) : (
                        <Wine className="h-16 w-16 text-muted-foreground/30" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-primary font-medium uppercase">{drink.type || "Spirit"}</p>
                      <h3 className="font-display text-lg font-semibold mt-1 text-foreground">{drink.name}</h3>
                      {drink.brand && <p className="text-sm text-muted-foreground">{drink.brand}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-primary font-bold">KSh {drink.price.toLocaleString()}</p>
                        {drink.stock_status && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${drink.stock_status === 'in_stock' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {drink.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Wine className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No drinks found. {drinks.length === 0 ? "Check back soon for our premium collection!" : "Try adjusting your filters."}</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
