import Layout from "@/components/Layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchTable } from "@/lib/supabase-helpers";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, Clock } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

interface Career {
  id: string;
  title: string;
  department: string | null;
  description: string | null;
  requirements: string | null;
  deadline: string | null;
}

export default function Careers() {
  const { data: careers = [] } = useQuery({
    queryKey: ["careers"],
    queryFn: () => fetchTable<Career>("careers", { orderBy: "created_at" }),
  });

  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [form, setForm] = useState({ applicant_name: "", email: "", phone: "", cover_letter: "" });

  const applyMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("applications").insert({
        career_id: selectedJob,
        applicant_name: form.applicant_name,
        email: form.email,
        phone: form.phone,
        cover_letter: form.cover_letter,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      setForm({ applicant_name: "", email: "", phone: "", cover_letter: "" });
      setSelectedJob(null);
    },
    onError: () => toast.error("Failed to submit application."),
  });

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary tracking-wider uppercase">Join Our Team</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 text-gradient-gold">Careers</h1>
          </div>

          {careers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {careers.map((job) => (
                <Card key={job.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground">{job.title}</h3>
                        {job.department && <p className="text-sm text-primary">{job.department}</p>}
                      </div>
                      {job.deadline && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {format(new Date(job.deadline), "MMM dd")}
                        </span>
                      )}
                    </div>
                    {job.description && <p className="text-sm text-muted-foreground mt-3">{job.description}</p>}
                    {job.requirements && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground font-medium">Requirements:</p>
                        <p className="text-sm text-muted-foreground">{job.requirements}</p>
                      </div>
                    )}
                    <Button size="sm" className="mt-4 bg-gradient-gold text-primary-foreground hover:opacity-90" onClick={() => setSelectedJob(job.id)}>
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No open positions at the moment. Check back soon!</p>
            </div>
          )}

          {/* Application form */}
          {selectedJob && (
            <Card className="max-w-lg mx-auto bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">Apply Now</h3>
                <div className="space-y-4">
                  <div><Label>Full Name</Label><Input value={form.applicant_name} onChange={(e) => setForm({ ...form, applicant_name: e.target.value })} className="bg-secondary border-border" /></div>
                  <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary border-border" /></div>
                  <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-secondary border-border" /></div>
                  <div><Label>Cover Letter</Label><Textarea value={form.cover_letter} onChange={(e) => setForm({ ...form, cover_letter: e.target.value })} className="bg-secondary border-border" rows={4} /></div>
                  <div className="flex gap-3">
                    <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90" onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending || !form.applicant_name || !form.email}>
                      {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedJob(null)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
}
