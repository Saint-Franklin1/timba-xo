import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, CameraOff, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ScanResult {
  status: "valid" | "used" | "invalid" | "not_approved";
  message: string;
  data?: {
    reference: string;
    name: string;
    type: string;
    date: string;
  };
}

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanning(true);
      // Poll for QR codes using BarcodeDetector if available
      if ("BarcodeDetector" in window) {
        const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
        intervalRef.current = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const raw = barcodes[0].rawValue;
              stopCamera();
              await validateQR(raw);
            }
          } catch { /* ignore detection errors */ }
        }, 500);
      } else {
        toast.info("Your browser doesn't support camera QR scanning. Use manual entry instead.");
      }
    } catch (err) {
      toast.error("Could not access camera. Please allow camera permissions.");
    }
  };

  const validateQR = async (raw: string) => {
    setProcessing(true);
    try {
      let parsed: { reference: string; name: string; type: string; date: string; status: string };
      try {
        parsed = JSON.parse(raw);
      } catch {
        setResult({ status: "invalid", message: "Invalid QR code format" });
        return;
      }

      // Find ticket by reference in qr_data
      const { data: tickets, error } = await (supabase.from as any)("booking_tickets")
        .select("*")
        .filter("qr_data", "cs", `{"reference":"${parsed.reference}"}`);
      
      if (error || !tickets || tickets.length === 0) {
        setResult({ status: "invalid", message: "Ticket not found" });
        return;
      }

      const ticket = tickets[0];

      if (ticket.status === "used") {
        setResult({ status: "used", message: "This ticket has already been used!", data: parsed });
        return;
      }

      // Check booking is approved
      const { data: booking } = await (supabase.from as any)("bookings")
        .select("payment_status")
        .eq("id", ticket.booking_id)
        .single();

      if (!booking || booking.payment_status !== "paid") {
        setResult({ status: "not_approved", message: "Booking payment not approved", data: parsed });
        return;
      }

      // Mark as used
      await (supabase.from as any)("booking_tickets")
        .update({ status: "used", used_at: new Date().toISOString() })
        .eq("id", ticket.id);

      setResult({ status: "valid", message: "VALID ENTRY", data: parsed });
      toast.success("Entry validated!");
    } catch (err: any) {
      setResult({ status: "invalid", message: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleManualValidate = () => {
    if (!manualCode.trim()) return;
    // Try to find ticket by reference
    const searchQR = async () => {
      setProcessing(true);
      try {
        const { data: tickets } = await (supabase.from as any)("booking_tickets")
          .select("*");
        
        const match = tickets?.find((t: any) => {
          try {
            const d = JSON.parse(t.qr_data);
            return d.reference === manualCode.trim().toUpperCase();
          } catch { return false; }
        });

        if (!match) {
          setResult({ status: "invalid", message: "Reference not found" });
          return;
        }

        await validateQR(match.qr_data);
      } catch (err: any) {
        setResult({ status: "invalid", message: err.message });
      } finally {
        setProcessing(false);
      }
    };
    searchQR();
  };

  const resultIcon = () => {
    if (!result) return null;
    if (result.status === "valid") return <CheckCircle className="h-16 w-16 text-green-500" />;
    if (result.status === "used") return <AlertTriangle className="h-16 w-16 text-yellow-500" />;
    return <XCircle className="h-16 w-16 text-red-500" />;
  };

  const resultColor = () => {
    if (!result) return "";
    if (result.status === "valid") return "border-green-500/50 bg-green-500/10";
    if (result.status === "used") return "border-yellow-500/50 bg-yellow-500/10";
    return "border-red-500/50 bg-red-500/10";
  };

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">QR Ticket Scanner</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Camera / Scanner */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="aspect-video bg-secondary rounded-lg overflow-hidden relative">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
                {!scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CameraOff className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button className="w-full gap-2" onClick={scanning ? stopCamera : startCamera}>
                <Camera className="h-4 w-4" />
                {scanning ? "Stop Camera" : "Start Camera Scanner"}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or enter reference manually</span></div>
              </div>
              <div className="flex gap-2">
                <Input value={manualCode} onChange={e => setManualCode(e.target.value.toUpperCase())} className="bg-secondary border-border font-mono" placeholder="TXO-2026-000001" />
                <Button onClick={handleManualValidate} disabled={processing}>Validate</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className={`bg-card border-border ${resultColor()}`}>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
            {processing ? (
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : result ? (
              <div className="text-center space-y-4">
                {resultIcon()}
                <h3 className="font-display text-2xl font-bold">{result.message}</h3>
                {result.data && (
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Customer:</strong> {result.data.name}</p>
                    <p><strong>Service:</strong> {result.data.type}</p>
                    <p><strong>Date:</strong> {result.data.date}</p>
                    <p><strong>Reference:</strong> {result.data.reference}</p>
                  </div>
                )}
                <Button variant="outline" onClick={() => { setResult(null); setManualCode(""); }}>
                  Scan Next
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Scan a QR code or enter a reference to validate</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
