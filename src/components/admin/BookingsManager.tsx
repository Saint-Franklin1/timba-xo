import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTable } from "@/lib/supabase-helpers";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Booking {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  drink_name: string;
  reservation_date: string;
  status: string;
  created_at: string;
}

export default function BookingsManager() {
  const queryClient = useQueryClient();

  const { data: bookings = [] } = useQuery({
    queryKey: ["drink_bookings"],
    queryFn: () => fetchTable<Booking>("drink_bookings", { orderBy: "created_at" }),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await (supabase.from as any)("drink_bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drink_bookings"] });
      toast.success("Status updated");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Drink Bookings</h3>
      <div className="rounded-lg border border-border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Drink</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No bookings yet</TableCell></TableRow>
            ) : (
              bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.customer_name}</TableCell>
                  <TableCell>{b.phone || "—"}</TableCell>
                  <TableCell>{b.email}</TableCell>
                  <TableCell>{b.drink_name}</TableCell>
                  <TableCell>{new Date(b.reservation_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select value={b.status} onValueChange={(v) => statusMutation.mutate({ id: b.id, status: v })}>
                      <SelectTrigger className="w-28 h-8 text-xs bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
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
