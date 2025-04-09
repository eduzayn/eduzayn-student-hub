import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import MatriculasPage from "./pages/admin/matriculas/MatriculasPage";
import Alunos from "./pages/Alunos";
import Cursos from "./pages/Cursos";
import Usuarios from "./pages/Usuarios";
import Configuracoes from "./pages/Configuracoes";
import Contratos from "./pages/Contratos";
import Financeiro from "./pages/Financeiro";
import Chamados from "./pages/Chamados";
import Comunicados from "./pages/Comunicados";
import Agenda from "./pages/Agenda";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          {/* Módulo de Matrículas */}
          <Route path="/admin/matriculas" element={<MatriculasPage />} />
          <Route path="/admin/matriculas/sincronizacao" element={<MatriculasPage />} />
          <Route path="/admin/matriculas/nova" element={<MatriculasPage />} />
          
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/chamados" element={<Chamados />} />
          <Route path="/comunicados" element={<Comunicados />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/admin" element={<Admin />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
