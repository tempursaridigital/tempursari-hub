import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layanan from "./pages/Layanan";
import LayananMandiri from "./pages/LayananMandiri";
import Informasi from "./pages/Informasi";
import Toko from "./pages/Toko";
import OperatorDashboard from "./pages/OperatorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/layanan-mandiri" element={<LayananMandiri />} />
          <Route path="/informasi" element={<Informasi />} />
          <Route path="/toko" element={<Toko />} />
          <Route path="/operator" element={<OperatorDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
