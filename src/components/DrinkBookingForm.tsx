import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wine } from "lucide-react";

interface DrinkBookingFormProps {
  drinkId: string;
  drinkName: string;
  trigger?: React.ReactNode;
}

export default function DrinkBookingForm({ drinkId, drinkName, trigger }: DrinkBookingFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase.from as any)("drink_bookings").insert({
        customer_name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        drink_id: drinkId,
        drink_name: drinkName,
        reservation_date: new Date(date).toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Booking submitted! We'll confirm your reservation shortly.");
      setOpen(false);
      setName(""); setEmail(""); setPhone(""); setDate("");
    },
    onError: (e) => toast.error(`Booking failed: ${e.message}`),
  });

  const isValid = name.trim() && email.trim() && date;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2">
            <Wine className="h-4 w-4" /> Reserve This Drink
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-gradient-gold">Reserve: {drinkName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-xs text-muted-foreground">Full Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email *</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254..." className="bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Reservation Date *</Label>
            <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="bg-secondary border-border" />
          </div>
          <Button
            className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90"
            disabled={!isValid || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Submitting..." : "Submit Reservation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
