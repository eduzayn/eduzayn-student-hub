
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
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
