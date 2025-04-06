
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Cursos from "./pages/Cursos";
import DetalheCurso from "./pages/DetalheCurso";
import Checkout from "./pages/Checkout";
import Confirmacao from "./pages/Confirmacao";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:categoria" element={<Cursos />} />
          <Route path="/curso/:id" element={<DetalheCurso />} />
          <Route path="/matricula/checkout/:id" element={<Checkout />} />
          <Route path="/confirmacao-sucesso" element={<Confirmacao />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes (will add auth protection later) */}
          <Route path="/dashboard/*" element={<Dashboard />} />
          
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
