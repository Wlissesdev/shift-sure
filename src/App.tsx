import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Registrar from "./pages/Registrar";
import Entrar from "./pages/Entrar";
import Dashboard from "./pages/Dashboard";
import BuscarPlantoes from "./pages/BuscarPlantoes";
import MeusPlantoes from "./pages/MeusPlantoes";
import NovoPlantao from "./pages/NovoPlantao";
import PlantaoDetalhe from "./pages/PlantaoDetalhe";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/buscar" element={<BuscarPlantoes />} />
            <Route path="/meus-plantoes" element={<MeusPlantoes />} />
            <Route path="/novo-plantao" element={<NovoPlantao />} />
            <Route path="/plantao/:id" element={<PlantaoDetalhe />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
