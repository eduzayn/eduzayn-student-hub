
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import MatriculasPage from "./pages/admin/matriculas/MatriculasPage";
import EmConstrucao from "./pages/EmConstrucao";
import Login from "./pages/Login";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          
          {/* Módulo de Matrículas */}
          <Route path="/admin/matriculas" element={<MatriculasPage />} />
          <Route path="/admin/matriculas/sincronizacao" element={<MatriculasPage />} />
          <Route path="/admin/matriculas/nova" element={<MatriculasPage />} />
          
          {/* Páginas em construção */}
          <Route path="/alunos" element={<EmConstrucao title="Alunos" />} />
          <Route path="/cursos" element={<EmConstrucao title="Cursos" />} />
          <Route path="/usuarios" element={<EmConstrucao title="Usuários" />} />
          <Route path="/configuracoes" element={<EmConstrucao title="Configurações" />} />
          <Route path="/contratos" element={<EmConstrucao title="Contratos" />} />
          <Route path="/financeiro" element={<EmConstrucao title="Financeiro" />} />
          <Route path="/chamados" element={<EmConstrucao title="Chamados" />} />
          <Route path="/comunicados" element={<EmConstrucao title="Comunicados" />} />
          <Route path="/agenda" element={<EmConstrucao title="Agenda" />} />
          <Route path="/admin" element={<EmConstrucao title="Administração" />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
