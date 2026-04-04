import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchTable } from "@/lib/supabase-helpers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";
import { useState } from "react";

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

const SERVICE_TYPES = [
  { value: "table", label: "Table" },
  { value: "vip", label: "VIP Section" },
  { value: "vvip", label: "VVIP Section" },
  { value: "dining", label: "Dining" },
  { value: "event_ticket", label: "Event Ticket" },
];

export default function PricingManager() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<PricingItem> | null>(null);

  const { data: items = [] } = useQuery({
    queryKey: ["service_pricing"],
    queryFn: () => fetchTable<PricingItem>("service_pricing", { orderBy: "created_at" }),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchTable<EventItem>("events", { orderBy: "created_at" }),
  });

  const saveMutation = useMutation({
    mutationFn: async (item: Partial<PricingItem>) => {
      if (item.id) {
        const { error } = await (supabase.from as any)("service_pricing").update({
          service_type: item.service_type,
          event_id: item.event_id || null,
          price: item.price,
          is_available: item.is_available,
          label: item.label || null,
        }).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from as any)("service_pricing").insert({
          service_type: item.service_type,
          event_id: item.event_id || null,
          price: item.price,
          is_available: item.is_available ?? true,
          label: item.label || null,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_pricing"] });
      toast.success("Pricing saved");
      setIsOpen(false);
      setEditItem(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from as any)("service_pricing").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_pricing"] });
      toast.success("Deleted");
    },
    onError: (e) => toast.error(e.message),
  });

  const toggleAvailability = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => {
      const { error } = await (supabase.from as any)("service_pricing").update({ is_available: val }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_pricing"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const openNew = () => {
    setEditItem({ service_type: "table", price: 0, is_available: true, label: "" });
    setIsOpen(true);
  };

  const getEventName = (id: string | null) => {
    if (!id) return "—";
    return events.find(e => e.id === id)?.name || "—";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground">Service Pricing</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-1" onClick={openNew}>
              <Plus className="h-4 w-4" /> Add Price
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="font-display">{editItem?.id ? "Edit" : "Add"} Pricing</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Service Type</Label>
                <Select value={editItem?.service_type || ""} onValueChange={v => setEditItem(e => ({ ...e!, service_type: v }))}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {editItem?.service_type === "event_ticket" && (
                <div>
                  <Label>Event (optional)</Label>
                  <Select value={editItem?.event_id || ""} onValueChange={v => setEditItem(e => ({ ...e!, event_id: v }))}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select event" /></SelectTrigger>
                    <SelectContent>
                      {events.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label>Label (optional description)</Label>
                <Input value={editItem?.label || ""} onChange={e => setEditItem(ei => ({ ...ei!, label: e.target.value }))} className="bg-secondary border-border" placeholder="e.g. Weekend rate" />
              </div>
              <div>
                <Label>Price (KES)</Label>
                <Input type="number" value={editItem?.price ?? 0} onChange={e => setEditItem(ei => ({ ...ei!, price: Number(e.target.value) }))} className="bg-secondary border-border" />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={editItem?.is_available ?? true} onCheckedChange={v => setEditItem(e => ({ ...e!, is_available: v }))} />
                <Label>{editItem?.is_available ? "Available" : "Full"}</Label>
              </div>
              <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90" onClick={() => editItem && saveMutation.mutate(editItem)} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Price (KES)</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No pricing set</TableCell></TableRow>
            ) : (
              items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="capitalize">{item.service_type.replace("_", " ")}</TableCell>
                  <TableCell>{getEventName(item.event_id)}</TableCell>
                  <TableCell>{item.label || "—"}</TableCell>
                  <TableCell className="font-mono">KES {item.price?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Switch checked={item.is_available} onCheckedChange={v => toggleAvailability.mutate({ id: item.id, val: v })} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditItem(item); setIsOpen(true); }}><Edit className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
