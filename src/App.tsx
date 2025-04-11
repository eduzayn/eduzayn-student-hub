
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import MatriculasPage from "./pages/admin/matriculas/MatriculasPage";
import EmConstrucao from "./pages/EmConstrucao";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import Admin from "./pages/Admin";

// Páginas públicas
import Index from "./pages/Index";
import DetalheCurso from "./pages/DetalheCurso";
// Layout público com menu de navegação
import NavBarLayout from "./components/layout/NavBarLayout";
import MatriculasAlunos from "./pages/admin/matriculas/MatriculasAlunos";
import NovaMatricula from "./pages/admin/matriculas/NovaMatricula";
import MatriculasConfiguracoes from "./pages/admin/matriculas/MatriculasConfiguracoes";
// Import do AlunoLayout para o portal do aluno
import AlunoLayout from "./components/layout/AlunoLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route element={<NavBarLayout />}>
          <Route index element={<Index />} />
          <Route path="/cursos" element={<EmConstrucao title="Cursos" />} />
          <Route path="/curso/:id" element={<DetalheCurso />} />
          <Route path="/quem-somos" element={<EmConstrucao title="Quem Somos" />} />
          <Route path="/contato" element={<EmConstrucao title="Contato" />} />
        </Route>
        
        {/* Rotas de autenticação */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas - painel administrativo */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Módulo de Matrículas */}
          <Route path="/admin/matriculas" element={<MatriculasPage />} />
          <Route path="/admin/matriculas/sincronizacao" element={<MatriculasPage />} />
          <Route path="/admin/matriculas/nova" element={<NovaMatricula />} />
          <Route path="/admin/matriculas/alunos" element={<MatriculasAlunos />} />
          <Route path="/admin/matriculas/configuracoes" element={<MatriculasConfiguracoes />} />
          
          {/* Páginas em construção */}
          <Route path="/alunos" element={<EmConstrucao title="Alunos" />} />
          <Route path="/usuarios" element={<EmConstrucao title="Usuários" />} />
          <Route path="/configuracoes" element={<EmConstrucao title="Configurações" />} />
          <Route path="/contratos" element={<EmConstrucao title="Contratos" />} />
          <Route path="/financeiro" element={<EmConstrucao title="Financeiro" />} />
          <Route path="/chamados" element={<EmConstrucao title="Chamados" />} />
          <Route path="/comunicados" element={<EmConstrucao title="Comunicados" />} />
          <Route path="/agenda" element={<EmConstrucao title="Agenda" />} />
        </Route>
        
        {/* Portal do Aluno */}
        <Route path="/aluno" element={<AlunoLayout />}>
          <Route index element={<EmConstrucao title="Portal do Aluno" />} />
          <Route path="/aluno/cursos" element={<EmConstrucao title="Meus Cursos" />} />
          <Route path="/aluno/aprendizagem" element={<EmConstrucao title="Rota de Aprendizagem" />} />
          <Route path="/aluno/carteira" element={<EmConstrucao title="Carteira de Estudante" />} />
          <Route path="/aluno/calendario" element={<EmConstrucao title="Calendário" />} />
          <Route path="/aluno/materiais" element={<EmConstrucao title="Materiais" />} />
          <Route path="/aluno/financeiro" element={<EmConstrucao title="Financeiro" />} />
          <Route path="/aluno/documentos" element={<EmConstrucao title="Documentos" />} />
          <Route path="/aluno/certificados" element={<EmConstrucao title="Certificados" />} />
          <Route path="/aluno/comunicacao" element={<EmConstrucao title="Comunicação" />} />
          <Route path="/aluno/estatisticas" element={<EmConstrucao title="Estatísticas" />} />
          <Route path="/aluno/suporte" element={<EmConstrucao title="Central de Ajuda" />} />
          <Route path="/aluno/chatana" element={<EmConstrucao title="Chat com Ana" />} />
          <Route path="/aluno/perfil" element={<EmConstrucao title="Meu Perfil" />} />
          <Route path="/aluno/configuracoes" element={<EmConstrucao title="Configurações" />} />
        </Route>
        
        {/* Rota Admin */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Rota 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
