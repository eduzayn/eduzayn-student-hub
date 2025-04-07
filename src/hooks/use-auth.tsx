
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, isAdminBypassAuthenticated, getAdminBypassEmail } from "@/integrations/supabase/client";
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
  refreshAuth: () => Promise<boolean>;
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
  refreshAuth: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminBypass, setIsAdminBypass] = useState<boolean>(false);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<number>(0);

  // Função para verificar autenticação com bypass de admin
  const checkAdminBypass = () => {
    try {
      const adminBypass = isAdminBypassAuthenticated();
      console.log("[useAuth] Verificando admin bypass:", adminBypass);
      
      if (adminBypass) {
        const email = getAdminBypassEmail();
        console.log("[useAuth] Admin bypass autenticado para:", email);
        
        setIsLoggedIn(true);
        setIsAdminBypass(true);
        setIsAdminUser(true);
        setUserEmail(email);
        return true;
      }
      
      return false;
    } catch (e) {
      console.error("[useAuth] Erro ao verificar bypass:", e);
      return false;
    }
  };

  // Forçar uma nova verificação de autenticação
  const refreshAuth = async (): Promise<boolean> => {
    setIsLoading(true);
    console.log("[useAuth] Atualizando estado de autenticação...");
    
    // Primeiro verificar bypass de admin
    if (checkAdminBypass()) {
      console.log("[useAuth] Bypass de admin confirmado durante refresh");
      setIsLoading(false);
      return true;
    }
    
    // Verificar autenticação normal
    try {
      const { data } = await supabase.auth.refreshSession();
      const session = data?.session;
      
      if (session) {
        console.log("[useAuth] Sessão atualizada com sucesso:", session.user.email);
        setIsLoggedIn(true);
        setIsAdminBypass(false);
        
        const email = session.user?.email || null;
        setUserEmail(email);
        
        // Verificar se é um email administrativo
        const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
        console.log("[useAuth] Email administrativo após refresh:", isAdmin);
        setIsAdminUser(isAdmin);
        setIsLoading(false);
        return true;
      } else {
        console.log("[useAuth] Sem sessão após refresh");
        setIsLoggedIn(false);
        setIsAdminUser(false);
        setUserEmail(null);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("[useAuth] Erro ao atualizar sessão:", error);
      setIsLoading(false);
      return false;
    }
  };

  // Função para verificar autenticação do Supabase
  const checkSupabaseAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      console.log("[useAuth] Verificando sessão do Supabase:", !!session, "Email:", session?.user?.email);
      
      if (session) {
        console.log("[useAuth] Usuário autenticado via Supabase");
        setIsLoggedIn(true);
        setIsAdminBypass(false);
        const email = session.user?.email || null;
        setUserEmail(email);
        
        // Verificar se é um email administrativo
        const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
        console.log("[useAuth] Verificação de email admin:", isAdmin, email);
        setIsAdminUser(isAdmin);
        return true;
      }
      
      console.log("[useAuth] Usuário não autenticado via Supabase");
      setIsLoggedIn(false);
      setIsAdminUser(false);
      setUserEmail(null);
      return false;
    } catch (error) {
      console.error("[useAuth] Erro ao verificar sessão Supabase:", error);
      return false;
    }
  };

  const checkAuth = async () => {
    try {
      // Evitar chamadas muito frequentes (throttling)
      const now = Date.now();
      if (now - lastCheck < 500) { // Reduzido para 500ms para testes
        console.log("[useAuth] Verificação muito frequente, usando cache:", {isLoggedIn, isAdminUser});
        return isLoggedIn;
      }
      
      setLastCheck(now);
      console.log("[useAuth] Verificando autenticação...");
      
      // Primeiro verificar o bypass de admin (mais rápido, sem chamada assíncrona)
      const adminBypassAuth = checkAdminBypass();
      
      if (adminBypassAuth) {
        console.log("[useAuth] Admin bypass autenticado e confirmado");
        setIsLoading(false);
        return true;
      }
      
      // Se não for admin bypass, verificar autenticação normal do Supabase
      const supabaseAuth = await checkSupabaseAuth();
      
      console.log("[useAuth] Resultado da verificação:", {supabaseAuth, isLoggedIn, isAdminUser, userEmail});
      setIsLoading(false);
      return supabaseAuth;
    } catch (error) {
      console.error("[useAuth] Erro ao verificar autenticação:", error);
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
    console.log("[useAuth] Inicializando hook de autenticação");
    let isMounted = true;
    
    // Verificar primeiro o bypass de admin (síncrono)
    const adminBypass = checkAdminBypass();
    
    if (adminBypass) {
      console.log("[useAuth] Inicializado com admin bypass");
      if (isMounted) {
        setIsLoading(false);
      }
      return;
    }
    
    // Se não houver bypass, verificar sessão do Supabase
    const initializeAuthState = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session && isMounted) {
          const email = data.session.user?.email || null;
          console.log("[useAuth] Sessão existente encontrada para:", email);
          setIsLoggedIn(true);
          setUserEmail(email);
          
          // Verificar se é um email administrativo
          const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
          setIsAdminUser(isAdmin);
          console.log("[useAuth] Estado inicial: Usuário autenticado via Supabase, isAdmin:", isAdmin);
        } else if (isMounted) {
          console.log("[useAuth] Estado inicial: Nenhuma sessão encontrada");
        }
      } catch (error) {
        console.error("[useAuth] Erro ao inicializar estado de autenticação:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    initializeAuthState();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[useAuth] Evento de autenticação:", event);
      
      if (event === 'SIGNED_IN' && session && isMounted) {
        console.log("[useAuth] Evento SIGNED_IN recebido");
        setIsLoggedIn(true);
        setIsAdminBypass(false);
        const email = session.user?.email || null;
        setUserEmail(email);
        
        // Verificar se é um email administrativo
        const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
        console.log("[useAuth] Email administrativo após login:", isAdmin, email);
        setIsAdminUser(isAdmin);
      } else if (event === 'SIGNED_OUT' && isMounted) {
        console.log("[useAuth] Evento SIGNED_OUT recebido");
        // Primeiro verificar se há um bypass de admin ativo
        const adminBypass = isAdminBypassAuthenticated();
        
        if (adminBypass) {
          console.log("[useAuth] Admin bypass permanece ativo após sign out");
          setIsLoggedIn(true);
          setIsAdminBypass(true);
          const email = getAdminBypassEmail();
          setUserEmail(email);
          setIsAdminUser(true);
        } else {
          // Caso contrário, está realmente deslogado
          console.log("[useAuth] Usuário completamente deslogado");
          setIsLoggedIn(false);
          setIsAdminUser(false);
          setUserEmail(null);
        }
      } else if (event === 'TOKEN_REFRESHED' && isMounted) {
        console.log("[useAuth] Token atualizado com sucesso");
      }
    });
    
    return () => {
      isMounted = false;
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
    refreshAuth,
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
