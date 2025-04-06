
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/use-auth";

import MainLayout from "./components/layout/MainLayout";
import AlunoLayout from "./components/layout/AlunoLayout";
import AdminLayout from "./components/layout/AdminLayout";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Cursos from "./pages/Cursos";
import DetalheCurso from "./pages/DetalheCurso";
import Checkout from "./pages/Checkout";
import Confirmacao from "./pages/Confirmacao";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AlunoDashboard from "./pages/aluno/Dashboard";
import CursosAluno from "./pages/aluno/CursosAluno";
import FinanceiroAluno from "./pages/aluno/FinanceiroAluno";
import DocumentosAluno from "./pages/aluno/DocumentosAluno";
import CarteiraAluno from "./pages/aluno/CarteiraAluno";
import RotaAprendizagem from "./pages/aluno/RotaAprendizagem";
import Certificados from "./pages/aluno/Certificados";
import Comunicacao from "./pages/aluno/Comunicacao";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";

// Páginas do Portal Administrativo
import PortalAdministrativo from "./pages/admin/PortalAdministrativo";
import ModuloChat from "./pages/admin/ModuloChat";
import ModuloContabilidade from "./pages/admin/ModuloContabilidade";
import ModuloFinanceiro from "./pages/admin/ModuloFinanceiro";
import ModuloMaterial from "./pages/admin/ModuloMaterial";
import ModuloMatriculas from "./pages/admin/ModuloMatriculas";
import ModuloProfessor from "./pages/admin/ModuloProfessor";
import ModuloParceiro from "./pages/admin/ModuloParceiro";
import ModuloPolo from "./pages/admin/ModuloPolo";
import ModuloRH from "./pages/admin/ModuloRH";
import ModuloAplicacoes from "./pages/admin/ModuloAplicacoes";

// Nova página de matrícula
import NovaMatricula from "./pages/admin/matriculas/NovaMatricula";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <SonnerToaster />
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas - Todas usam MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/cursos/:categoria" element={<Cursos />} />
              <Route path="/curso/:id" element={<DetalheCurso />} />
              <Route path="/matricula/checkout/:id" element={<Checkout />} />
              <Route path="/confirmacao-sucesso" element={<Confirmacao />} />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/login" element={<Login />} />
            </Route>
            
            {/* Rota de Dashboard antiga (será redirecionada) */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Portal do Aluno - Novo Layout */}
            <Route path="/dashboard" element={<AlunoLayout />}>
              <Route index element={<AlunoDashboard />} />
              <Route path="cursos" element={<CursosAluno />} />
              <Route path="cursos/:id" element={<DetalheCurso />} />
              <Route path="financeiro" element={<FinanceiroAluno />} />
              <Route path="documentos" element={<DocumentosAluno />} />
              <Route path="carteira" element={<CarteiraAluno />} />
              <Route path="aprendizagem" element={<RotaAprendizagem />} />
              <Route path="certificados" element={<Certificados />} />
              <Route path="comunicacao" element={<Comunicacao />} />
              <Route path="calendario" element={<div className="text-2xl font-bold">Calendário</div>} />
              <Route path="materiais" element={<div className="text-2xl font-bold">Materiais</div>} />
              <Route path="estatisticas" element={<div className="text-2xl font-bold">Estatísticas</div>} />
              <Route path="suporte" element={<div className="text-2xl font-bold">Suporte</div>} />
              <Route path="chatana" element={<div className="text-2xl font-bold">Chat com Ana</div>} />
              <Route path="perfil" element={<div className="text-2xl font-bold">Perfil do Aluno</div>} />
              <Route path="configuracoes" element={<div className="text-2xl font-bold">Configurações</div>} />
              <Route path="notificacoes" element={<div className="text-2xl font-bold">Notificações</div>} />
            </Route>
            
            {/* Portal Administrativo */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<PortalAdministrativo />} />
              <Route path="chat" element={<ModuloChat />} />
              <Route path="contabilidade" element={<ModuloContabilidade />} />
              <Route path="financeiro" element={<ModuloFinanceiro />} />
              <Route path="material" element={<ModuloMaterial />} />
              <Route path="matriculas" element={<ModuloMatriculas />} />
              <Route path="matriculas/nova" element={<NovaMatricula />} />
              <Route path="professor" element={<ModuloProfessor />} />
              <Route path="parceiro" element={<ModuloParceiro />} />
              <Route path="polo" element={<ModuloPolo />} />
              <Route path="rh" element={<ModuloRH />} />
              <Route path="aplicacoes" element={<ModuloAplicacoes />} />
            </Route>
            
            {/* Rota de Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
