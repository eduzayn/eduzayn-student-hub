
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, isAuthenticated, isAdminBypassAuthenticated } from "@/integrations/supabase/client";
import { ADMIN_EMAILS } from "@/components/auth/LoginForm";
import { toast } from "sonner";

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdminBypass: boolean;
  isAdminUser: boolean;
  userEmail: string | null;
  checkAuth: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;
  getAuthToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  isAdminBypass: false,
  isAdminUser: false,
  userEmail: null,
  checkAuth: async () => false,
  getAccessToken: async () => null,
  getAuthToken: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminBypass, setIsAdminBypass] = useState<boolean>(false);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Função para verificar autenticação com bypass de admin
  const checkAdminBypass = () => {
    const adminBypass = isAdminBypassAuthenticated();
    
    if (adminBypass) {
      console.log("Admin bypass autenticado");
      setIsLoggedIn(true);
      setIsAdminBypass(true);
      setIsAdminUser(true);
      const email = localStorage.getItem('adminBypassEmail');
      setUserEmail(email);
      return true;
    }
    return false;
  };

  // Função para verificar autenticação do Supabase
  const checkSupabaseAuth = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    
    if (session) {
      console.log("Usuário autenticado via Supabase");
      setIsLoggedIn(true);
      const email = session.user?.email || null;
      setUserEmail(email);
      
      // Verificar se é um email administrativo
      const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
      console.log("Verificação de email admin:", isAdmin, email);
      setIsAdminUser(isAdmin);
      return true;
    }
    
    console.log("Usuário não autenticado via Supabase");
    return false;
  };

  const checkAuth = async () => {
    try {
      console.log("Verificando autenticação...");
      setIsLoading(true);
      
      // Primeiro verificar o bypass de admin (mais rápido, sem chamada assíncrona)
      const adminBypassAuth = checkAdminBypass();
      
      if (adminBypassAuth) {
        setIsLoading(false);
        return true;
      }
      
      // Se não for admin bypass, verificar autenticação normal do Supabase
      const supabaseAuth = await checkSupabaseAuth();
      
      if (!supabaseAuth) {
        setIsLoggedIn(false);
        setIsAdminUser(false);
      }
      
      setIsAdminBypass(false);
      setIsLoading(false);
      return supabaseAuth;
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setIsLoggedIn(false);
      setIsAdminBypass(false);
      setIsAdminUser(false);
      setIsLoading(false);
      return false;
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (isAdminBypass) {
      // Para bypass admin, retornar um token especial
      return 'admin-bypass-token';
    }

    // Para autenticação normal, obter o token da sessão do Supabase
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  // Alias para getAccessToken para compatibilidade
  const getAuthToken = async (): Promise<string | null> => {
    return getAccessToken();
  };

  useEffect(() => {
    console.log("Inicializando hook de autenticação");
    
    const initAuth = async () => {
      await checkAuth();
    };
    
    initAuth();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento de autenticação:", event);
      
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        setIsAdminBypass(false);
        const email = session.user?.email || null;
        setUserEmail(email);
        
        // Verificar se é um email administrativo
        const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
        console.log("Email administrativo após login:", isAdmin, email);
        setIsAdminUser(isAdmin);
        
        // Notificar o usuário
        toast.success("Login realizado com sucesso!");
        
      } else if (event === 'SIGNED_OUT') {
        // Primeiro verificar se há um bypass de admin ativo
        const adminBypass = isAdminBypassAuthenticated();
        
        if (adminBypass) {
          setIsLoggedIn(true);
          setIsAdminBypass(true);
          const email = localStorage.getItem('adminBypassEmail');
          setUserEmail(email);
          setIsAdminUser(email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false);
        } else {
          // Caso contrário, está realmente deslogado
          setIsLoggedIn(false);
          setIsAdminUser(false);
          setUserEmail(null);
        }
      }
    });
    
    return () => {
      // Limpar o listener ao desmontar
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    isLoggedIn, 
    isLoading, 
    isAdminBypass,
    isAdminUser,
    userEmail,
    checkAuth,
    getAccessToken,
    getAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
