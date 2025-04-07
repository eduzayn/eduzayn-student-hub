
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/layout/AdminLayout";
import PortalAdministrativo from "@/pages/admin/PortalAdministrativo";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, isAdminUser, userEmail, checkAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);
      try {
        console.log("Verificando autenticação no componente Admin...");
        const authenticated = await checkAuth();
        console.log("Resultado da verificação:", { authenticated, isAdminUser, userEmail });
        
        if (!authenticated) {
          console.log("Usuário não autenticado, redirecionando para login");
          navigate("/login");
          return;
        }
        
        // Se não for um usuário administrativo, redirecionar para o portal do aluno
        if (authenticated && !isAdminUser) {
          console.log("Usuário não é administrativo, redirecionando para dashboard");
          toast.warning("Acesso negado. Você não tem permissões administrativas.");
          navigate("/dashboard");
          return;
        }
        
        console.log("Autenticação verificada com sucesso no Admin:", { authenticated, isAdminUser });
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        toast.error("Erro ao verificar autenticação");
        navigate("/login");
      } finally {
        setIsChecking(false);
      }
    };
    
    verifyAuth();
  }, [navigate, checkAuth, isAdminUser]);
  
  // Mostrar mensagens de depuração para diagnóstico
  console.log("Estado atual de Admin: ", { isLoggedIn, isLoading, isAdminUser, isChecking });
  
  // Se estiver carregando ou verificando, mostra o indicador de carregamento
  if (isLoading || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-72 mx-auto" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }
  
  // Se não estiver logado ou não for admin, não renderiza o portal (redirecionamento já foi feito no useEffect)
  if (!isLoggedIn || !isAdminUser) {
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
