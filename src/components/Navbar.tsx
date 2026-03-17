import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Wine, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Drinks", to: "/drinks" },
  { label: "Dining", to: "/dining" },
  { label: "Events", to: "/events" },
  { label: "Venue", to: "/venue" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

const SAVED_CREDS_KEY = "timba_admin_saved";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
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
    if (rememberMe) {
      localStorage.setItem(SAVED_CREDS_KEY, JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem(SAVED_CREDS_KEY);
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Auth error"); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    if (roles && roles.some((r) => r.role === "admin")) {
      setLoginOpen(false);
      navigate("/admin");
    } else {
      toast.error("You do not have admin access");
      await supabase.auth.signOut();
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none"
          >
            <Wine className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-gradient-gold">Timba XO</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === l.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/reservations">
              <Button size="sm" className="ml-2 bg-gradient-gold text-primary-foreground hover:opacity-90">
                Reserve Table
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-background border-b border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === l.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/reservations" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full bg-gradient-gold text-primary-foreground">
                  Reserve Table
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Admin Login Dialog */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-sm bg-card border-border">
          <DialogHeader className="text-center">
            <div className="flex flex-col items-center gap-2 mb-2">
              <Wine className="h-10 w-10 text-primary" />
              <DialogTitle className="font-display text-2xl font-bold text-gradient-gold">Admin Login</DialogTitle>
              <p className="text-sm text-muted-foreground">Timba XO Dashboard</p>
            </div>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-border" required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary border-border" required />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember-nav" checked={rememberMe} onCheckedChange={(c) => setRememberMe(!!c)} />
              <Label htmlFor="remember-nav" className="text-sm text-muted-foreground cursor-pointer">Remember me</Label>
            </div>
            <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2" disabled={loading}>
              <Lock className="h-4 w-4" /> {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
