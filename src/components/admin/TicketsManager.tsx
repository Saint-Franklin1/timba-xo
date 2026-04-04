import { useQuery } from "@tanstack/react-query";
import { fetchTable } from "@/lib/supabase-helpers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

interface Ticket {
  id: string;
  booking_id: string;
  qr_data: string;
  status: string;
  used_at: string | null;
  created_at: string;
}

interface Booking {
  id: string;
  reference: string;
  customer_name: string;
  service_type: string;
  booking_date: string;
}

export default function TicketsManager() {
  const { data: tickets = [] } = useQuery({
    queryKey: ["booking_tickets"],
    queryFn: () => fetchTable<Ticket>("booking_tickets", { orderBy: "created_at" }),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fetchTable<Booking>("bookings", { orderBy: "created_at" }),
  });

  const getBooking = (id: string) => bookings.find(b => b.id === id);

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Generated Tickets</h3>
      <div className="rounded-lg border border-border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>QR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No tickets generated yet</TableCell></TableRow>
            ) : (
              tickets.map(t => {
                const booking = getBooking(t.booking_id);
                let qrParsed: any = {};
                try { qrParsed = JSON.parse(t.qr_data); } catch {}
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">{qrParsed.reference || "—"}</TableCell>
                    <TableCell>{booking?.customer_name || qrParsed.name || "—"}</TableCell>
                    <TableCell className="capitalize">{(booking?.service_type || qrParsed.type || "—").replace("_", " ")}</TableCell>
                    <TableCell>{booking?.booking_date || qrParsed.date || "—"}</TableCell>
                    <TableCell>
                      <Badge className={t.status === "valid" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}>
                        {t.status === "used" ? `Used ${t.used_at ? new Date(t.used_at).toLocaleString() : ""}` : t.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8"><QrCode className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border max-w-xs">
                          <div className="flex flex-col items-center gap-4 p-4">
                            <QRCodeSVG value={t.qr_data} size={200} bgColor="#ffffff" fgColor="#000000" />
                            <p className="text-xs font-mono text-muted-foreground">{qrParsed.reference}</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
