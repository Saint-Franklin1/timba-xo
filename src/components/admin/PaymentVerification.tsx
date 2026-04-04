import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchTable } from "@/lib/supabase-helpers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface Booking {
  id: string;
  reference: string;
  customer_name: string;
  phone: string;
  email: string;
  service_type: string;
  booking_date: string;
  amount: number;
  payment_status: string;
  created_at: string;
}

interface PaymentConfirmation {
  id: string;
  booking_id: string;
  transaction_code: string;
  status: string;
  created_at: string;
}

export default function PaymentVerification() {
  const queryClient = useQueryClient();

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fetchTable<Booking>("bookings", { orderBy: "created_at" }),
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["payment_confirmations"],
    queryFn: () => fetchTable<PaymentConfirmation>("payment_confirmations", { orderBy: "created_at" }),
  });

  const approveMutation = useMutation({
    mutationFn: async ({ bookingId, paymentId, booking }: { bookingId: string; paymentId: string; booking: Booking }) => {
      // Update payment status
      const { error: pErr } = await (supabase.from as any)("payment_confirmations")
        .update({ status: "approved" }).eq("id", paymentId);
      if (pErr) throw pErr;

      // Update booking status
      const { error: bErr } = await (supabase.from as any)("bookings")
        .update({ payment_status: "paid" }).eq("id", bookingId);
      if (bErr) throw bErr;

      // Generate QR data
      const qrData = JSON.stringify({
        reference: booking.reference,
        name: booking.customer_name,
        type: booking.service_type,
        date: booking.booking_date,
        status: "approved",
      });

      // Store ticket
      const { error: tErr } = await (supabase.from as any)("booking_tickets")
        .insert({ booking_id: bookingId, qr_data: qrData });
      if (tErr) throw tErr;

      // Log verification
      const { data: { user } } = await supabase.auth.getUser();
      await (supabase.from as any)("verification_logs").insert({
        reference: booking.reference,
        action: "approved",
        admin_id: user?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["payment_confirmations"] });
      queryClient.invalidateQueries({ queryKey: ["booking_tickets"] });
      toast.success("Payment approved & ticket generated!");
    },
    onError: (e) => toast.error(e.message),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ bookingId, paymentId, reference }: { bookingId: string; paymentId: string; reference: string }) => {
      const { error: pErr } = await (supabase.from as any)("payment_confirmations")
        .update({ status: "rejected" }).eq("id", paymentId);
      if (pErr) throw pErr;

      const { error: bErr } = await (supabase.from as any)("bookings")
        .update({ payment_status: "rejected" }).eq("id", bookingId);
      if (bErr) throw bErr;

      const { data: { user } } = await supabase.auth.getUser();
      await (supabase.from as any)("verification_logs").insert({
        reference,
        action: "rejected",
        admin_id: user?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["payment_confirmations"] });
      toast.success("Payment rejected");
    },
    onError: (e) => toast.error(e.message),
  });

  // Merge bookings with their payment confirmations
  const enriched = bookings.map(b => {
    const payment = payments.find(p => p.booking_id === b.id);
    return { ...b, payment };
  }).sort((a, b) => {
    // Pending first
    if (a.payment_status === "pending" && b.payment_status !== "pending") return -1;
    if (b.payment_status === "pending" && a.payment_status !== "pending") return 1;
    return 0;
  });

  const statusColor = (s: string) => {
    if (s === "paid") return "bg-green-500/20 text-green-400";
    if (s === "rejected") return "bg-red-500/20 text-red-400";
    return "bg-yellow-500/20 text-yellow-400";
  };

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Payment Verification</h3>
      <div className="rounded-lg border border-border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>M-Pesa Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enriched.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No bookings yet</TableCell></TableRow>
            ) : (
              enriched.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.reference}</TableCell>
                  <TableCell className="font-medium">{b.customer_name}</TableCell>
                  <TableCell>{b.phone}</TableCell>
                  <TableCell className="capitalize">{b.service_type.replace("_", " ")}</TableCell>
                  <TableCell>KES {b.amount?.toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-xs">{b.payment?.transaction_code || "—"}</TableCell>
                  <TableCell><Badge className={statusColor(b.payment_status)}>{b.payment_status}</Badge></TableCell>
                  <TableCell>
                    {b.payment_status === "pending" && b.payment && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="gap-1 text-green-400 hover:text-green-300" onClick={() => approveMutation.mutate({ bookingId: b.id, paymentId: b.payment!.id, booking: b })} disabled={approveMutation.isPending}>
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button size="sm" variant="ghost" className="gap-1 text-red-400 hover:text-red-300" onClick={() => rejectMutation.mutate({ bookingId: b.id, paymentId: b.payment!.id, reference: b.reference })} disabled={rejectMutation.isPending}>
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </div>
                    )}
                    {b.payment_status === "pending" && !b.payment && <span className="text-xs text-muted-foreground">Awaiting payment</span>}
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
