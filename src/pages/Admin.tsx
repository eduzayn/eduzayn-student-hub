
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [checkCount, setCheckCount] = useState(0); // Contador para evitar loops infinitos
  
  useEffect(() => {
    let isMounted = true;
    
    // Evitamos verificar mais de 3 vezes para prevenir loops infinitos
    if (checkCount > 3) {
      console.error("Muitas tentativas de verificação de autenticação. Possível loop infinito.");
      setAuthError("Erro ao verificar autenticação após várias tentativas");
      setIsChecking(false);
      return;
    }
    
    const verifyAuth = async () => {
      if (!isMounted) return;
      setIsChecking(true);

      try {
        console.log(`Verificando autenticação no componente Admin (tentativa ${checkCount + 1})...`);
        console.log("Estado atual antes da verificação:", { isLoggedIn, isAdminUser, userEmail });
        
        // Primeiro, verificamos se já estamos autenticados com um usuário admin
        if (isLoggedIn && isAdminUser && !isLoading) {
          console.log("Usuário já está autenticado como administrador, pulando verificação");
          setIsChecking(false);
          return;
        }

        const authenticated = await checkAuth();
        
        if (!isMounted) return;
        
        console.log("Resultado da verificação Admin:", { 
          authenticated, 
          isAdminUser, 
          userEmail,
          isLoggedIn
        });
        
        // Se o usuário não estiver autenticado, redirecionar para login
        if (!authenticated) {
          console.log("Admin: Usuário não autenticado, redirecionando para login");
          navigate("/login");
          return;
        }
        
        // Se não for um usuário administrativo, redirecionar para o portal do aluno
        if (authenticated && !isAdminUser) {
          console.log("Admin: Usuário não é administrativo, redirecionando para dashboard");
          toast.warning("Acesso negado. Você não tem permissões administrativas.");
          navigate("/dashboard");
          return;
        }
        
        console.log("Admin: Autenticação verificada com sucesso:", { authenticated, isAdminUser });
      } catch (error) {
        console.error("Admin: Erro ao verificar autenticação:", error);
        setAuthError("Erro ao verificar autenticação");
        
        if (isMounted) {
          toast.error("Erro ao verificar autenticação");
          navigate("/login");
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
          setCheckCount(prev => prev + 1);
        }
      }
    };
    
    // Verificar autenticação após um pequeno delay para permitir que os estados sejam atualizados
    const timer = setTimeout(() => {
      if (isMounted) {
        verifyAuth();
      }
    }, 800);  // Aumentando o delay para dar mais tempo para a autenticação ser processada
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [navigate, checkAuth, isAdminUser, userEmail, isLoggedIn, isLoading, checkCount]);
  
  // Mostrar mensagens de depuração para diagnóstico
  console.log("Estado atual de Admin: ", { isLoggedIn, isLoading, isAdminUser, isChecking, authError, checkCount });
  
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
    console.log("Admin: Não renderizando portal - não logado ou não admin");
    return null;
  }
  
  // Se estiver logado como admin, renderiza o portal administrativo
  console.log("Admin: Renderizando portal administrativo");
  return (
    <AdminLayout>
      <PortalAdministrativo />
    </AdminLayout>
  );
};

export default Admin;
