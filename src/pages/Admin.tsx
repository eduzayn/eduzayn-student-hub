
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/layout/AdminLayout";
import PortalAdministrativo from "@/pages/admin/PortalAdministrativo";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, isAdminUser, userEmail, checkAuth, refreshAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    // Dar um tempo antes de fazer a verificação para que o login tenha tempo de propagar
    const verifyAuth = async () => {
      console.log(`[Admin] Iniciando verificação de autenticação`);
      
      // Definir isChecking como true para mostrar o indicador de carregamento
      setIsChecking(true);

      try {
        // Primeiro, verificar estado atual
        console.log("[Admin] Estado atual antes da verificação:", { isLoggedIn, isAdminUser, userEmail });
        
        // Se já estamos autenticados com um usuário admin, podemos pular o resto da verificação
        if (isLoggedIn && isAdminUser && !isLoading) {
          console.log("[Admin] Usuário já está autenticado como administrador, exibindo portal");
          if (isMounted) {
            setIsChecking(false);
          }
          return;
        }

        // Forçar um refresh completo da autenticação
        console.log("[Admin] Forçando atualização do estado de autenticação");
        await refreshAuth();
        
        if (!isMounted) return;
        
        // Tentar autenticação novamente após o refresh
        const authenticated = await checkAuth();
        
        if (!isMounted) return;
        
        console.log("[Admin] Resultado da verificação após refresh:", { 
          authenticated, 
          isLoggedIn: isLoggedIn, 
          isAdminUser: isAdminUser, 
          userEmail: userEmail
        });
        
        // Se o usuário não estiver autenticado, redirecionar para login
        if (!authenticated) {
          console.log("[Admin] Usuário não autenticado, redirecionando para login");
          if (isMounted) {
            toast.error("Você precisa fazer login para acessar esta página");
            navigate("/login");
          }
          return;
        }
        
        // Se não for um usuário administrativo, redirecionar para o portal do aluno
        if (authenticated && !isAdminUser) {
          console.log("[Admin] Usuário não é administrativo, redirecionando para dashboard");
          if (isMounted) {
            toast.warning("Acesso negado. Você não tem permissões administrativas.");
            navigate("/dashboard");
          }
          return;
        }
        
        console.log("[Admin] Autenticação verificada com sucesso:", { authenticated, isAdminUser });
      } catch (error) {
        console.error("[Admin] Erro ao verificar autenticação:", error);
        setAuthError("Erro ao verificar autenticação");
        
        if (isMounted) {
          toast.error("Erro ao verificar autenticação");
          navigate("/login");
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };
    
    // Verificar autenticação após um pequeno delay para permitir que os estados sejam atualizados
    const timer = setTimeout(() => {
      if (isMounted) {
        verifyAuth();
      }
    }, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [navigate, checkAuth, refreshAuth, isAdminUser, userEmail, isLoggedIn, isLoading]);
  
  // Mostrar mensagens de depuração para diagnóstico
  console.log("[Admin] Estado atual de Admin: ", { isLoggedIn, isLoading, isAdminUser, isChecking, authError });
  
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
            Verificando autenticação administrativa...
          </p>
        </div>
      </div>
    );
  }
  
  // Se houver erro de autenticação
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-md space-y-6 text-center">
          <p className="text-red-500">{authError}</p>
          <button 
            onClick={() => navigate("/login")} 
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    );
  }
  
  // Se não estiver logado ou não for admin, não renderiza o portal (redirecionamento já foi feito no useEffect)
  if (!isLoggedIn || !isAdminUser) {
    console.log("[Admin] Não renderizando portal - não logado ou não admin");
    return null;
  }
  
  // Se estiver logado como admin, renderiza o portal administrativo
  console.log("[Admin] Renderizando portal administrativo");
  return (
    <AdminLayout>
      <PortalAdministrativo />
    </AdminLayout>
  );
};

export default Admin;
