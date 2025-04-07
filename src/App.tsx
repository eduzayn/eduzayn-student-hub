
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './hooks/use-auth';
import Index from './pages/Index';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AlunoLayout from './components/layout/AlunoLayout';
import EsqueciSenha from "./pages/EsqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import MainLayout from './components/layout/MainLayout';
import AlunoDashboard from './pages/aluno/Dashboard';

// Importação dos componentes do Módulo de Matrículas
import ModuloMatriculas from './pages/admin/ModuloMatriculas';
import MatriculasLista from './pages/admin/matriculas/MatriculasLista';
import NovaMatricula from './pages/admin/matriculas/NovaMatricula';
import MatriculasAlunos from './pages/admin/matriculas/MatriculasAlunos';
import MatriculasCursos from './pages/admin/matriculas/MatriculasCursos';
import MatriculasContratos from './pages/admin/matriculas/MatriculasContratos';
import MatriculasPagamentos from './pages/admin/matriculas/MatriculasPagamentos';
import MatriculasConfiguracoes from './pages/admin/matriculas/MatriculasConfiguracoes';
import SincronizacaoLearnWorlds from './pages/admin/matriculas/SincronizacaoLearnWorlds';
import SincronizacaoAlunos from './pages/admin/matriculas/SincronizacaoAlunos';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          
          {/* Redirecionar /dashboard para o dashboard do aluno */}
          <Route path="/dashboard" element={<Navigate to="/aluno" replace />} />
          
          {/* Utilizar AlunoLayout para todas as páginas do aluno */}
          <Route path="/aluno" element={<AlunoLayout />}>
            <Route index element={<AlunoDashboard />} />
            {/* Outras rotas do aluno podem ser adicionadas aqui */}
          </Route>
          
          <Route path="/admin" element={<Admin />} />
          
          {/* Rotas para o Módulo de Matrículas */}
          <Route path="/admin/matriculas" element={<ModuloMatriculas />} />
          <Route path="/admin/matriculas/lista" element={<MatriculasLista />} />
          <Route path="/admin/matriculas/nova" element={<NovaMatricula />} />
          <Route path="/admin/matriculas/alunos" element={<MatriculasAlunos />} />
          <Route path="/admin/matriculas/cursos" element={<MatriculasCursos />} />
          <Route path="/admin/matriculas/contratos" element={<MatriculasContratos />} />
          <Route path="/admin/matriculas/pagamentos" element={<MatriculasPagamentos />} />
          <Route path="/admin/matriculas/configuracoes" element={<MatriculasConfiguracoes />} />
          <Route path="/admin/matriculas/sincronizacao" element={<SincronizacaoLearnWorlds />} />
          <Route path="/admin/matriculas/sincronizacao/alunos" element={<SincronizacaoAlunos />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
