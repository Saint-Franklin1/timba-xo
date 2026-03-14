import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTable } from "@/lib/supabase-helpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wine, UtensilsCrossed, Calendar, Briefcase, Building2, LogOut, Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MediaManager from "@/components/admin/MediaManager";

function CrudModule({ table, columns, label }: { table: string; columns: { key: string; label: string; type?: string }[]; label: string }) {
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: [table],
    queryFn: () => fetchTable<Record<string, unknown>>(table, { orderBy: "created_at" }),
  });

  const upsertMutation = useMutation({
    mutationFn: async (item: Record<string, unknown>) => {
      if (item.id) {
        const { error } = await (supabase.from as any)(table).update(item).eq("id", item.id as string);
        if (error) throw error;
      } else {
        const cleaned = { ...item };
        delete cleaned.id;
        const { error } = await (supabase.from as any)(table).insert(cleaned);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      toast.success("Saved successfully");
      setIsOpen(false);
      setEditItem(null);
    },
    onError: (e) => toast.error(`Error: ${e.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from as any)(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      toast.success("Deleted");
    },
    onError: (e) => toast.error(`Error: ${e.message}`),
  });

  const openNew = () => {
    const empty: Record<string, unknown> = {};
    columns.forEach((c) => { empty[c.key] = ""; });
    setEditItem(empty);
    setIsOpen(true);
  };

  const openEdit = (item: Record<string, unknown>) => {
    setEditItem({ ...item });
    setIsOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground">{label}</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-1" onClick={openNew}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editItem?.id ? "Edit" : "Add"} {label}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {columns.map((col) => (
                <div key={col.key}>
                  <Label className="text-xs">{col.label}</Label>
                  {col.type === "textarea" ? (
                    <Textarea value={String(editItem?.[col.key] ?? "")} onChange={(e) => setEditItem({ ...editItem!, [col.key]: e.target.value })} className="bg-secondary border-border" />
                  ) : col.type === "number" ? (
                    <Input type="number" value={String(editItem?.[col.key] ?? "")} onChange={(e) => setEditItem({ ...editItem!, [col.key]: e.target.value ? Number(e.target.value) : "" })} className="bg-secondary border-border" />
                  ) : col.type === "date" ? (
                    <Input type="datetime-local" value={String(editItem?.[col.key] ?? "")} onChange={(e) => setEditItem({ ...editItem!, [col.key]: e.target.value })} className="bg-secondary border-border" />
                  ) : (
                    <Input value={String(editItem?.[col.key] ?? "")} onChange={(e) => setEditItem({ ...editItem!, [col.key]: e.target.value })} className="bg-secondary border-border" />
                  )}
                </div>
              ))}
              <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90" onClick={() => editItem && upsertMutation.mutate(editItem)} disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.slice(0, 4).map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No items yet</TableCell></TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id as string}>
                  {columns.slice(0, 4).map((c) => (
                    <TableCell key={c.key} className="max-w-[200px] truncate">{String(item[c.key] ?? "—")}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(item)}><Edit className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(item.id as string)}><Trash2 className="h-3.5 w-3.5" /></Button>
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

function ReadOnlyTable({ table, columns, label }: { table: string; columns: string[]; label: string }) {
  const { data: items = [] } = useQuery({
    queryKey: [table],
    queryFn: () => fetchTable<Record<string, unknown>>(table, { orderBy: "created_at" }),
  });

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">{label}</h3>
      <div className="rounded-lg border border-border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => <TableHead key={c} className="capitalize">{c.replace(/_/g, " ")}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">No entries yet</TableCell></TableRow>
            ) : (
              items.map((item, i) => (
                <TableRow key={i}>
                  {columns.map((c) => <TableCell key={c} className="max-w-[200px] truncate">{String(item[c] ?? "—")}</TableCell>)}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin-login"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (roles && roles.some((r) => r.role === "admin")) {
        setIsAdmin(true);
      } else {
        navigate("/admin-login");
      }
      setChecking(false);
    };
    check();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Verifying access...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Wine className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-gradient-gold">Timba XO Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 text-muted-foreground">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="drinks" className="w-full">
          <TabsList className="bg-card border border-border w-full flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="drinks" className="gap-1"><Wine className="h-3.5 w-3.5" /> Drinks</TabsTrigger>
            <TabsTrigger value="dining" className="gap-1"><UtensilsCrossed className="h-3.5 w-3.5" /> Dining</TabsTrigger>
            <TabsTrigger value="events" className="gap-1"><Calendar className="h-3.5 w-3.5" /> Events</TabsTrigger>
            <TabsTrigger value="careers" className="gap-1"><Briefcase className="h-3.5 w-3.5" /> Careers</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="venue" className="gap-1"><Building2 className="h-3.5 w-3.5" /> Venue</TabsTrigger>
            <TabsTrigger value="media" className="gap-1"><ImageIcon className="h-3.5 w-3.5" /> Media</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="contacts">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="drinks" className="mt-6">
            <CrudModule table="drinks" columns={[
              { key: "name", label: "Name" }, { key: "brand", label: "Brand" }, { key: "type", label: "Type" },
              { key: "price", label: "Price", type: "number" }, { key: "origin", label: "Origin" },
              { key: "year_manufactured", label: "Year", type: "number" }, { key: "alcohol_content", label: "Alcohol %", type: "number" },
              { key: "bottle_size", label: "Bottle Size" }, { key: "quality", label: "Quality" },
              { key: "stock_status", label: "Stock Status" }, { key: "tasting_notes", label: "Tasting Notes", type: "textarea" },
              { key: "provenance", label: "Provenance", type: "textarea" },
            ]} label="Drinks" />
          </TabsContent>
          <TabsContent value="dining" className="mt-6">
            <CrudModule table="dining" columns={[
              { key: "dish_name", label: "Dish Name" }, { key: "chef", label: "Chef" }, { key: "cuisine_type", label: "Cuisine" },
              { key: "price", label: "Price", type: "number" }, { key: "ingredients", label: "Ingredients", type: "textarea" },
              { key: "description", label: "Description", type: "textarea" },
            ]} label="Dining Menu" />
          </TabsContent>
          <TabsContent value="events" className="mt-6">
            <CrudModule table="events" columns={[
              { key: "name", label: "Name" }, { key: "type", label: "Type" }, { key: "date", label: "Date", type: "date" },
              { key: "venue_section", label: "Venue" }, { key: "description", label: "Description", type: "textarea" },
              { key: "performers", label: "Performers" }, { key: "status", label: "Status" },
            ]} label="Events" />
          </TabsContent>
          <TabsContent value="careers" className="mt-6">
            <CrudModule table="careers" columns={[
              { key: "title", label: "Title" }, { key: "department", label: "Department" },
              { key: "description", label: "Description", type: "textarea" }, { key: "requirements", label: "Requirements", type: "textarea" },
              { key: "deadline", label: "Deadline", type: "date" },
            ]} label="Career Listings" />
          </TabsContent>
          <TabsContent value="services" className="mt-6">
            <CrudModule table="services" columns={[
              { key: "name", label: "Name" }, { key: "description", label: "Description", type: "textarea" },
            ]} label="Services" />
          </TabsContent>
          <TabsContent value="venue" className="mt-6">
            <CrudModule table="venue_sections" columns={[
              { key: "name", label: "Name" }, { key: "description", label: "Description", type: "textarea" },
              { key: "capacity", label: "Capacity", type: "number" },
            ]} label="Venue Sections" />
          </TabsContent>
          <TabsContent value="reservations" className="mt-6">
            <ReadOnlyTable table="reservations" columns={["user_name", "contact", "date", "time", "section", "type", "status"]} label="Reservations" />
          </TabsContent>
          <TabsContent value="applications" className="mt-6">
            <ReadOnlyTable table="applications" columns={["applicant_name", "email", "phone", "cover_letter"]} label="Job Applications" />
          </TabsContent>
          <TabsContent value="contacts" className="mt-6">
            <ReadOnlyTable table="contact_submissions" columns={["name", "email", "type", "subject", "message"]} label="Contact Messages" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
