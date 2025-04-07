
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/layout/AdminLayout";
import PortalAdministrativo from "@/pages/admin/PortalAdministrativo";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, isAdminUser, checkAuth } = useAuth();
  
  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = await checkAuth();
      
      if (!authenticated && !isLoading) {
        // Se não estiver autenticado, redirecionar para o login
        navigate("/login");
        return;
      }
      
      // Se não for um usuário administrativo, redirecionar para o portal do aluno
      if (authenticated && !isAdminUser) {
        navigate("/dashboard");
        return;
      }
    };
    
    verifyAuth();
  }, [navigate, isLoading, checkAuth, isAdminUser]);
  
  // Se estiver carregando, não renderiza nada ainda
  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }
  
  // Se não estiver logado, não renderiza nada (o redirecionamento será feito no useEffect)
  if (!isLoggedIn && !isLoading) {
    return null;
  }
  
  // Se estiver logado como admin, renderiza o portal administrativo
  return (
    <AdminLayout>
      <PortalAdministrativo />
    </AdminLayout>
  );
};

export default Admin;
