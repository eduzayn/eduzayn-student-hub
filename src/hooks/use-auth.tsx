
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
  const [sessionInitialized, setSessionInitialized] = useState<boolean>(false);

  // Função para verificar autenticação com bypass de admin
  const checkAdminBypass = () => {
    const adminBypass = isAdminBypassAuthenticated();
    console.log("Verificando admin bypass:", adminBypass);
    
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
    try {
      // Verificar se já há uma autenticação via bypass antes de consultar o Supabase
      if (checkAdminBypass()) {
        console.log("Autenticação por bypass confirmada, pulando verificação do Supabase");
        return true;
      }

      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      console.log("Verificando sessão do Supabase:", !!session, "Email:", session?.user?.email);
      
      if (session) {
        console.log("Usuário autenticado via Supabase");
        setIsLoggedIn(true);
        setIsAdminBypass(false);
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
    } catch (error) {
      console.error("Erro ao verificar sessão Supabase:", error);
      return false;
    }
  };

  const checkAuth = async () => {
    try {
      console.log("Verificando autenticação...");
      setIsLoading(true);
      
      // Primeiro verificar o bypass de admin (mais rápido, sem chamada assíncrona)
      const adminBypassAuth = checkAdminBypass();
      
      if (adminBypassAuth) {
        console.log("Admin bypass autenticado e confirmado");
        setIsLoading(false);
        return true;
      }
      
      // Se não for admin bypass, verificar autenticação normal do Supabase
      const supabaseAuth = await checkSupabaseAuth();
      
      if (!supabaseAuth) {
        console.log("Nenhuma autenticação válida encontrada");
        setIsLoggedIn(false);
        setIsAdminUser(false);
        setUserEmail(null);
      } else {
        console.log("Autenticação Supabase confirmada");
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

  // Inicialização única quando o componente é montado
  useEffect(() => {
    console.log("Inicializando hook de autenticação");
    
    // Inicializar o estado com base no localStorage (para bypass admin) ou sessão existente
    const initializeAuthState = async () => {
      // Primeiro verificar o bypass de admin
      if (checkAdminBypass()) {
        setSessionInitialized(true);
        setIsLoading(false);
        console.log("Estado inicial: Admin bypass autenticado");
        return;
      }
      
      // Se não for bypass, verificar sessão do Supabase
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const email = data.session.user?.email || null;
          console.log("Sessão existente encontrada para:", email);
          setIsLoggedIn(true);
          setUserEmail(email);
          
          // Verificar se é um email administrativo
          const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
          setIsAdminUser(isAdmin);
          console.log("Estado inicial: Usuário autenticado via Supabase, isAdmin:", isAdmin);
        } else {
          console.log("Estado inicial: Nenhuma sessão encontrada");
        }
      } catch (error) {
        console.error("Erro ao inicializar estado de autenticação:", error);
      } finally {
        setSessionInitialized(true);
        setIsLoading(false);
      }
    };
    
    initializeAuthState();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento de autenticação:", event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("Evento SIGNED_IN recebido");
        setIsLoggedIn(true);
        setIsAdminBypass(false);
        const email = session.user?.email || null;
        setUserEmail(email);
        
        // Verificar se é um email administrativo
        const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
        console.log("Email administrativo após login:", isAdmin, email);
        setIsAdminUser(isAdmin);
        
        // Notificar o usuário (já feito no LoginForm)
      } else if (event === 'SIGNED_OUT') {
        console.log("Evento SIGNED_OUT recebido");
        // Primeiro verificar se há um bypass de admin ativo
        const adminBypass = isAdminBypassAuthenticated();
        
        if (adminBypass) {
          console.log("Admin bypass permanece ativo após sign out");
          setIsLoggedIn(true);
          setIsAdminBypass(true);
          const email = localStorage.getItem('adminBypassEmail');
          setUserEmail(email);
          setIsAdminUser(email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false);
        } else {
          // Caso contrário, está realmente deslogado
          console.log("Usuário completamente deslogado");
          setIsLoggedIn(false);
          setIsAdminUser(false);
          setUserEmail(null);
        }
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token atualizado com sucesso");
      }
    });
    
    return () => {
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
