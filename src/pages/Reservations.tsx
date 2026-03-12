import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar, Clock, Crown } from "lucide-react";

const sections = ["Main Club Floor", "VIP Lounge", "VVIP Suite", "Terrace Lounge", "Timber Outdoor & Arena"];
const types = ["Standard", "VIP", "VVIP", "Birthday", "Corporate", "Private Party"];

export default function Reservations() {
  const [form, setForm] = useState({
    user_name: "", contact: "", date: "", time: "", section: "", type: "",
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reservations").insert({
        user_name: form.user_name,
        contact: form.contact,
        date: form.date,
        time: form.time,
        section: form.section,
        type: form.type,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Reservation submitted! We'll confirm shortly.");
      setForm({ user_name: "", contact: "", date: "", time: "", section: "", type: "" });
    },
    onError: () => toast.error("Failed to submit reservation."),
  });

  const isValid = form.user_name && form.contact && form.date && form.time && form.section && form.type;

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">Book Your Spot</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">Reservations</h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Secure your table for an unforgettable experience at Timba XO.
            </p>
          </div>

          <Card className="max-w-xl mx-auto bg-card border-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="h-6 w-6 text-primary" />
                <h3 className="font-display text-xl font-semibold text-foreground">Reserve a Table</h3>
              </div>

              <div className="space-y-4">
                <div><Label>Full Name</Label><Input value={form.user_name} onChange={(e) => setForm({ ...form, user_name: e.target.value })} className="bg-secondary border-border" placeholder="Your name" /></div>
                <div><Label>Phone / Email</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="bg-secondary border-border" placeholder="Contact info" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Date</Label>
                    <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-secondary border-border" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Time</Label>
                    <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="bg-secondary border-border" />
                  </div>
                </div>
                <div>
                  <Label>Section</Label>
                  <Select value={form.section} onValueChange={(v) => setForm({ ...form, section: v })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select section" /></SelectTrigger>
                    <SelectContent>
                      {sections.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Reservation Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 h-12 text-base" onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending || !isValid}>
                  {submitMutation.isPending ? "Submitting..." : "Submit Reservation"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
