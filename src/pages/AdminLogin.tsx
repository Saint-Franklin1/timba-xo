import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Wine, Lock } from "lucide-react";
import { toast } from "sonner";

const SAVED_CREDS_KEY = "timba_admin_saved";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(SAVED_CREDS_KEY);
    if (saved) {
      try {
        const { email: e, password: p } = JSON.parse(saved);
        setEmail(e || "");
        setPassword(p || "");
        setRememberMe(true);
      } catch {}
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Invalid credentials");
      return;
    }
    // Save or clear credentials
    if (rememberMe) {
      localStorage.setItem(SAVED_CREDS_KEY, JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem(SAVED_CREDS_KEY);
    }
    // Check admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Auth error"); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    if (roles && roles.some((r) => r.role === "admin")) {
      navigate("/admin");
    } else {
      toast.error("You do not have admin access");
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm bg-card border-border">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <Wine className="h-10 w-10 text-primary mx-auto mb-2" />
            <h1 className="font-display text-2xl font-bold text-gradient-gold">Admin Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Timba XO Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-border" required /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary border-border" required /></div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(c) => setRememberMe(!!c)} />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me</Label>
            </div>
            <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2" disabled={loading}>
              <Lock className="h-4 w-4" /> {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
