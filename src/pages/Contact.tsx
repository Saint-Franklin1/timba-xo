import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", type: "feedback" });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("contact_submissions").insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "", type: "feedback" });
    },
    onError: () => toast.error("Failed to send message."),
  });

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">Get in Touch</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">Contact Us</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="space-y-6 mb-8">
                {[
                  { icon: MapPin, label: "Location", value: "Eldoret, Kenya" },
                  { icon: Phone, label: "Primary Phone / WhatsApp", value: "+254 792 611998" },
                  { icon: Phone, label: "Alternative Phone", value: "+254 791 888057" },
                  { icon: Mail, label: "Email", value: "officialtimbaxo@gmail.com" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="aspect-video rounded-xl bg-secondary/50 border border-border flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Map - Eldoret, Kenya</p>
              </div>
            </div>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">Send us a Message</h3>
                <div className="space-y-4">
                  <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary border-border" /></div>
                  <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary border-border" /></div>
                  <div>
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="recognition">Recognition</SelectItem>
                        <SelectItem value="inquiry">Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="bg-secondary border-border" /></div>
                  <div><Label>Message</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-secondary border-border" rows={4} /></div>
                  <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90" onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending || !form.name || !form.email || !form.message}>
                    {submitMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
