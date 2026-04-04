import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { fetchTable } from "@/lib/supabase-helpers";
import { CheckCircle, CreditCard, ArrowRight, Copy } from "lucide-react";

const MPESA_TILL = "XXXXXXX"; // Placeholder — admin will update

type Step = "form" | "payment" | "confirm" | "done";

interface PricingItem {
  id: string;
  service_type: string;
  event_id: string | null;
  price: number;
  is_available: boolean;
  label: string | null;
}

interface EventItem {
  id: string;
  name: string;
}

export default function BookingPage() {
  const [step, setStep] = useState<Step>("form");
  const [bookingRef, setBookingRef] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [form, setForm] = useState({
    customer_name: "", email: "", phone: "", network: "Safaricom",
    service_type: "", event_id: "", guests: "1", booking_date: "",
  });
  const [txCode, setTxCode] = useState("");
  const [amount, setAmount] = useState(0);

  const { data: pricing = [] } = useQuery({
    queryKey: ["service_pricing"],
    queryFn: () => fetchTable<PricingItem>("service_pricing", { orderBy: "created_at" }),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchTable<EventItem>("events", { orderBy: "created_at" }),
  });

  // Get available pricing for selected service type
  const availablePricing = pricing.filter(p => p.is_available);
  const serviceTypes = [...new Set(availablePricing.map(p => p.service_type))];

  // Auto-populate price when service type changes
  const handleServiceChange = (val: string) => {
    setForm(f => ({ ...f, service_type: val, event_id: "" }));
    const match = availablePricing.find(p => p.service_type === val && !p.event_id);
    if (match) setAmount(match.price);
  };

  const handleEventChange = (val: string) => {
    setForm(f => ({ ...f, event_id: val }));
    const match = availablePricing.find(p => p.service_type === form.service_type && p.event_id === val);
    if (match) setAmount(match.price);
  };

  const showEventSelect = form.service_type === "event_ticket";

  const bookingMutation = useMutation({
    mutationFn: async () => {
      // Generate reference
      const { data: ref, error: refErr } = await supabase.rpc("generate_booking_reference");
      if (refErr) throw refErr;

      const { data, error } = await (supabase.from as any)("bookings")
        .insert({
          reference: ref,
          customer_name: form.customer_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          network: form.network,
          service_type: form.service_type,
          event_id: form.event_id || null,
          guests: parseInt(form.guests) || 1,
          booking_date: form.booking_date,
          amount,
        })
        .select("id, reference")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data: { id: string; reference: string }) => {
      setBookingRef(data.reference);
      setBookingId(data.id);
      setStep("payment");
    },
    onError: (e) => toast.error(`Booking failed: ${e.message}`),
  });

  const confirmMutation = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase.from as any)("payment_confirmations")
        .insert({
          booking_id: bookingId,
          transaction_code: txCode.trim().toUpperCase(),
        });
      if (error) throw error;
    },
    onSuccess: () => {
      setStep("done");
      toast.success("Payment confirmation submitted!");
    },
    onError: (e) => toast.error(`Failed: ${e.message}`),
  });

  const isFormValid = form.customer_name && form.email && form.phone && form.service_type && form.booking_date && amount > 0;
  const isTxValid = /^[A-Z0-9]{8,12}$/i.test(txCode.trim());

  const serviceLabels: Record<string, string> = {
    table: "Table", vip: "VIP Section", vvip: "VVIP Section",
    dining: "Dining", event_ticket: "Event Ticket",
  };

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">Reserve & Pay</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">Book Your Experience</h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Reserve a table, VIP section, dining, or event ticket at Timba XO.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8 text-xs font-medium">
            {["Details", "Pay", "Confirm", "Done"].map((s, i) => {
              const stepIdx = ["form", "payment", "confirm", "done"].indexOf(step);
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= stepIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {i < stepIdx ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={i <= stepIdx ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                  {i < 3 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                </div>
              );
            })}
          </div>

          <Card className="max-w-xl mx-auto bg-card border-border">
            <CardContent className="p-8">

              {/* STEP 1: Booking Form */}
              {step === "form" && (
                <div className="space-y-4">
                  <div><Label>Full Name *</Label><Input value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} className="bg-secondary border-border" placeholder="Your full name" /></div>
                  <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-secondary border-border" placeholder="you@email.com" /></div>
                  <div><Label>Phone *</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-secondary border-border" placeholder="+254..." /></div>
                  <div>
                    <Label>Network</Label>
                    <Select value={form.network} onValueChange={v => setForm(f => ({ ...f, network: v }))}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Safaricom">Safaricom</SelectItem>
                        <SelectItem value="Airtel">Airtel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Service Type *</Label>
                    <Select value={form.service_type} onValueChange={handleServiceChange}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select service" /></SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(t => (
                          <SelectItem key={t} value={t}>{serviceLabels[t] || t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {showEventSelect && (
                    <div>
                      <Label>Event</Label>
                      <Select value={form.event_id} onValueChange={handleEventChange}>
                        <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select event" /></SelectTrigger>
                        <SelectContent>
                          {events.map(e => (
                            <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Guests</Label><Input type="number" min="1" value={form.guests} onChange={e => setForm(f => ({ ...f, guests: e.target.value }))} className="bg-secondary border-border" /></div>
                    <div><Label>Date *</Label><Input type="date" value={form.booking_date} onChange={e => setForm(f => ({ ...f, booking_date: e.target.value }))} className="bg-secondary border-border" /></div>
                  </div>
                  {amount > 0 && (
                    <div className="bg-secondary rounded-lg p-4 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-display text-2xl font-bold text-foreground">KES {amount.toLocaleString()}</span>
                    </div>
                  )}
                  <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 h-12 text-base" disabled={!isFormValid || bookingMutation.isPending} onClick={() => bookingMutation.mutate()}>
                    {bookingMutation.isPending ? "Creating Booking..." : "Proceed to Payment"}
                  </Button>
                </div>
              )}

              {/* STEP 2: Payment Instructions */}
              {step === "payment" && (
                <div className="space-y-6 text-center">
                  <CreditCard className="h-12 w-12 text-primary mx-auto" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Your booking reference:</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-display text-2xl font-bold text-foreground">{bookingRef}</span>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { navigator.clipboard.writeText(bookingRef); toast.success("Copied!"); }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-secondary rounded-lg p-6 text-left space-y-3">
                    <h3 className="font-display font-semibold text-foreground text-lg">Pay KES {amount.toLocaleString()} via M-Pesa</h3>
                    <p className="text-sm text-muted-foreground font-semibold">Till Number: {MPESA_TILL}</p>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li>Go to M-Pesa on your phone</li>
                      <li>Select <strong>Lipa na M-Pesa</strong></li>
                      <li>Select <strong>Buy Goods and Services</strong></li>
                      <li>Enter Till Number: <strong>{MPESA_TILL}</strong></li>
                      <li>Enter Amount: <strong>KES {amount.toLocaleString()}</strong></li>
                      <li>Enter your M-Pesa PIN and confirm</li>
                    </ol>
                  </div>
                  <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 h-12 text-base" onClick={() => setStep("confirm")}>
                    I Have Paid
                  </Button>
                </div>
              )}

              {/* STEP 3: Transaction Code */}
              {step === "confirm" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="font-display text-xl font-semibold text-foreground">Confirm Payment</h3>
                    <p className="text-sm text-muted-foreground mt-1">Enter the M-Pesa transaction code from your confirmation SMS</p>
                  </div>
                  <div>
                    <Label>M-Pesa Transaction Code *</Label>
                    <Input value={txCode} onChange={e => setTxCode(e.target.value.toUpperCase())} className="bg-secondary border-border text-center text-lg font-mono tracking-wider" placeholder="e.g. SBJ7ABCDEF" maxLength={12} />
                    {txCode && !isTxValid && <p className="text-xs text-destructive mt-1">Enter a valid transaction code (8-12 alphanumeric characters)</p>}
                  </div>
                  <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 h-12 text-base" disabled={!isTxValid || confirmMutation.isPending} onClick={() => confirmMutation.mutate()}>
                    {confirmMutation.isPending ? "Submitting..." : "Submit Payment Confirmation"}
                  </Button>
                </div>
              )}

              {/* STEP 4: Done */}
              {step === "done" && (
                <div className="text-center space-y-4 py-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <h3 className="font-display text-2xl font-bold text-foreground">Booking Submitted!</h3>
                  <p className="text-muted-foreground">Your payment is under verification. You will receive your ticket via email shortly after confirmation.</p>
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Reference</p>
                    <p className="font-display text-xl font-bold text-foreground">{bookingRef}</p>
                  </div>
                  <Button variant="outline" onClick={() => { setStep("form"); setForm({ customer_name: "", email: "", phone: "", network: "Safaricom", service_type: "", event_id: "", guests: "1", booking_date: "" }); setAmount(0); setTxCode(""); }}>
                    Make Another Booking
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
