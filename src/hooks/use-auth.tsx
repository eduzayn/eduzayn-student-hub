import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, isAuthenticated, isAdminBypassAuthenticated } from "@/integrations/supabase/client";

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdminBypass: boolean;
  userEmail: string | null;
  checkAuth: () => Promise<boolean>;
  getAuthToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  isAdminBypass: false,
  userEmail: null,
  checkAuth: async () => false,
  getAuthToken: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminBypass, setIsAdminBypass] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Verificar bypass de admin
      const adminBypass = isAdminBypassAuthenticated();
      if (adminBypass) {
        setIsLoggedIn(true);
        setIsAdminBypass(true);
        const email = localStorage.getItem('adminBypassEmail');
        setUserEmail(email);
        setIsLoading(false);
        return true;
      }
      
      // Verificar autenticação normal
      const isAuth = await isAuthenticated();
      setIsLoggedIn(isAuth);
      
      if (isAuth) {
        const { data } = await supabase.auth.getSession();
        setUserEmail(data.session?.user?.email || null);
      }
      
      setIsAdminBypass(false);
      setIsLoading(false);
      return isAuth;
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setIsLoggedIn(false);
      setIsAdminBypass(false);
      setIsLoading(false);
      return false;
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    if (isAdminBypass) {
      // Para bypass admin, retornar um token especial
      return 'admin-bypass-token';
    }

    // Para autenticação normal, obter o token da sessão do Supabase
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  useEffect(() => {
    checkAuth();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        setIsAdminBypass(false);
        setUserEmail(session.user?.email || null);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(isAdminBypassAuthenticated());
        setIsAdminBypass(isAdminBypassAuthenticated());
        setUserEmail(isAdminBypassAuthenticated() ? localStorage.getItem('adminBypassEmail') : null);
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
    userEmail,
    checkAuth,
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
