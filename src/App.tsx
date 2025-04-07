
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AlunoLayout from './components/layout/AlunoLayout';
import EsqueciSenha from "./pages/EsqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import MainLayout from './components/layout/MainLayout';

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        
        <Route path="/dashboard" element={<AlunoLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
