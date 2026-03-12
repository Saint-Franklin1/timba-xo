import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Services from "./pages/Services";
import Drinks from "./pages/Drinks";
import DrinkDetail from "./pages/DrinkDetail";
import Dining from "./pages/Dining";
import Events from "./pages/Events";
import Venue from "./pages/Venue";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Reservations from "./pages/Reservations";
import Awards from "./pages/Awards";
import Impact from "./pages/Impact";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/drinks" element={<Drinks />} />
          <Route path="/drinks/:id" element={<DrinkDetail />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/events" element={<Events />} />
          <Route path="/venue" element={<Venue />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
