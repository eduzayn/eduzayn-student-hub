
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AlunoSidebar from "./AlunoSidebar";
import AlunoHeader from "./AlunoHeader";
import AlunoBreadcrumb from "../aluno/AlunoBreadcrumb";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const AlunoLayout: React.FC = () => {
  const { isLoggedIn, isLoading, isAdminUser, refreshAuth } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyAuth = async () => {
      // Força uma atualização do estado de autenticação
      const authenticated = await refreshAuth();
      
      if (!authenticated && !isLoading) {
        // Se não estiver autenticado, redirecionar para o login
        console.log("AlunoLayout: Usuário não autenticado, redirecionando para login");
        navigate("/login", { replace: true });
        return;
      }
      
      // Se for um usuário administrativo, redirecionar para o portal administrativo
      if (authenticated && isAdminUser) {
        console.log("AlunoLayout: Usuário admin detectado, redirecionando para o portal administrativo");
        navigate("/admin", { replace: true });
        return;
      }
      
      console.log("AlunoLayout: Autenticação verificada com sucesso - Usuário aluno");
    };
    
    verifyAuth();
  }, [navigate, isLoading, refreshAuth, isAdminUser]);
  
  // Se estiver carregando, mostra um esqueleto de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-background">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }
  
  // Se não estiver logado, não renderiza nada (o redirecionamento será feito no useEffect)
  if (!isLoggedIn && !isLoading) {
    return null;
  }
  
  // Se estiver logado, renderiza o layout completo
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AlunoSidebar />
        <main className="flex-1 flex flex-col">
          <AlunoHeader />
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            <AlunoBreadcrumb />
            <Outlet /> {/* Conteúdo da página atual */}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AlunoLayout;
