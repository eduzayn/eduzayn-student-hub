
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkAdminBypass, isAdminBypassAuthenticated, getAdminBypassEmail, ADMIN_BYPASS_JWT } from "./adminBypass";
import { checkSupabaseAuth } from "./supabaseAuth";
import { ADMIN_EMAILS } from "@/components/auth/LoginForm";

export const useAuthProvider = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminBypass, setIsAdminBypass] = useState<boolean>(false);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<number>(0);

  // Forçar uma nova verificação de autenticação
  const refreshAuth = async (): Promise<boolean> => {
    setIsLoading(true);
    console.log("[useAuthProvider] Atualizando estado de autenticação...");
    
    // Primeiro verificar bypass de admin (exceto para ana.diretoria@eduzayn.com.br)
    if (checkAdminBypass(setIsLoggedIn, setIsAdminBypass, setIsAdminUser, setUserEmail)) {
      const email = getAdminBypassEmail();
      if (email === "ana.diretoria@eduzayn.com.br") {
        console.log("[useAuthProvider] Ignorando bypass para usuário administrador autenticado");
      } else {
        console.log("[useAuthProvider] Bypass de admin confirmado durante refresh");
        setIsLoading(false);
        return true;
      }
    }
    
    // Verificar autenticação normal
    try {
      const { data } = await supabase.auth.refreshSession();
      const session = data?.session;
      
      if (session) {
        console.log("[useAuthProvider] Sessão atualizada com sucesso:", session.user.email);
        setIsLoggedIn(true);
        setIsAdminBypass(false);
        
        const email = session.user?.email || null;
        setUserEmail(email);
        
        // Verificar se é um email administrativo
        const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
        console.log("[useAuthProvider] Email administrativo após refresh:", isAdmin);
        setIsAdminUser(isAdmin);
        setIsLoading(false);
        return true;
      } else {
        console.log("[useAuthProvider] Sem sessão após refresh");
        setIsLoggedIn(false);
        setIsAdminUser(false);
        setUserEmail(null);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("[useAuthProvider] Erro ao atualizar sessão:", error);
      setIsLoading(false);
      return false;
    }
  };

  const checkAuth = async () => {
    try {
      // Evitar chamadas muito frequentes (throttling)
      const now = Date.now();
      if (now - lastCheck < 500) { // Reduzido para 500ms para testes
        console.log("[useAuthProvider] Verificação muito frequente, usando cache:", {isLoggedIn, isAdminUser});
        return isLoggedIn;
      }
      
      setLastCheck(now);
      console.log("[useAuthProvider] Verificando autenticação...");
      
      // Verificar autenticação normal do Supabase primeiro para o usuário ana.diretoria
      if (userEmail === "ana.diretoria@eduzayn.com.br") {
        const supabaseAuth = await checkSupabaseAuth(setIsLoggedIn, setIsAdminBypass, setIsAdminUser, setUserEmail);
        if (supabaseAuth) {
          console.log("[useAuthProvider] Usuário administrador autenticado diretamente pelo Supabase");
          setIsLoading(false);
          return true;
        }
      }
      
      // Verificar o bypass de admin para outros usuários
      const adminBypassAuth = checkAdminBypass(setIsLoggedIn, setIsAdminBypass, setIsAdminUser, setUserEmail);
      if (adminBypassAuth && getAdminBypassEmail() !== "ana.diretoria@eduzayn.com.br") {
        console.log("[useAuthProvider] Admin bypass autenticado e confirmado");
        setIsLoading(false);
        return true;
      }
      
      // Se não for admin bypass, verificar autenticação normal do Supabase
      const supabaseAuth = await checkSupabaseAuth(setIsLoggedIn, setIsAdminBypass, setIsAdminUser, setUserEmail);
      
      console.log("[useAuthProvider] Resultado da verificação:", {supabaseAuth, isLoggedIn, isAdminUser, userEmail});
      setIsLoading(false);
      return supabaseAuth;
    } catch (error) {
      console.error("[useAuthProvider] Erro ao verificar autenticação:", error);
      setIsLoggedIn(false);
      setIsAdminBypass(false);
      setIsAdminUser(false);
      setIsLoading(false);
      return false;
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    // Para o usuário ana.diretoria, sempre tentar obter o token do Supabase
    if (userEmail === "ana.diretoria@eduzayn.com.br") {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        console.log("[useAuthProvider] Retornando token de acesso Supabase para usuário admin autenticado");
        return data.session.access_token;
      }
    }
    
    if (isAdminBypass && getAdminBypassEmail() !== "ana.diretoria@eduzayn.com.br") {
      // Para bypass admin (exceto ana.diretoria), retornar o token JWT anônimo
      console.log("[useAuthProvider] Retornando token JWT anônimo para bypass admin");
      return ADMIN_BYPASS_JWT;
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
    console.log("[useAuthProvider] Inicializando hook de autenticação");
    let isMounted = true;
    
    // Verificar primeiro autenticação normal para o usuário ana.diretoria
    const initializeAuthState = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session && isMounted) {
          const email = data.session.user?.email || null;
          console.log("[useAuthProvider] Sessão existente encontrada para:", email);
          
          // Se for o usuário ana.diretoria, ignorar qualquer bypass
          if (email === "ana.diretoria@eduzayn.com.br") {
            console.log("[useAuthProvider] Usuário administrador autenticado, ignorando bypass");
            setIsLoggedIn(true);
            setIsAdminBypass(false);
            setUserEmail(email);
            
            // Verificar se é um email administrativo
            const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
            setIsAdminUser(isAdmin);
            
            if (isMounted) {
              setIsLoading(false);
            }
            return;
          }
          
          setIsLoggedIn(true);
          setUserEmail(email);
          
          // Verificar se é um email administrativo
          const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
          setIsAdminUser(isAdmin);
          console.log("[useAuthProvider] Estado inicial: Usuário autenticado via Supabase, isAdmin:", isAdmin);
        } else {
          // Verificar bypass de admin se não houver sessão do Supabase
          const adminBypass = checkAdminBypass(setIsLoggedIn, setIsAdminBypass, setIsAdminUser, setUserEmail);
          
          if (adminBypass && isMounted) {
            console.log("[useAuthProvider] Inicializado com admin bypass");
          } else if (isMounted) {
            console.log("[useAuthProvider] Estado inicial: Nenhuma sessão encontrada");
          }
        }
      } catch (error) {
        console.error("[useAuthProvider] Erro ao inicializar estado de autenticação:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    initializeAuthState();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[useAuthProvider] Evento de autenticação:", event);
      
      if (event === 'SIGNED_IN' && session && isMounted) {
        console.log("[useAuthProvider] Evento SIGNED_IN recebido");
        setIsLoggedIn(true);
        setIsAdminBypass(false);
        const email = session.user?.email || null;
        setUserEmail(email);
        
        // Verificar se é um email administrativo
        const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
        console.log("[useAuthProvider] Email administrativo após login:", isAdmin, email);
        setIsAdminUser(isAdmin);
      } else if (event === 'SIGNED_OUT' && isMounted) {
        console.log("[useAuthProvider] Evento SIGNED_OUT recebido");
        
        // Para o usuário ana.diretoria, não verificar bypass
        if (userEmail === "ana.diretoria@eduzayn.com.br") {
          console.log("[useAuthProvider] Usuário admin autenticado deslogado completamente");
          setIsLoggedIn(false);
          setIsAdminUser(false);
          setUserEmail(null);
          return;
        }
        
        // Verificar se há um bypass de admin ativo para outros usuários
        const adminBypass = isAdminBypassAuthenticated();
        const bypassEmail = getAdminBypassEmail();
        
        if (adminBypass && bypassEmail !== "ana.diretoria@eduzayn.com.br") {
          console.log("[useAuthProvider] Admin bypass permanece ativo após sign out");
          setIsLoggedIn(true);
          setIsAdminBypass(true);
          setUserEmail(bypassEmail);
          setIsAdminUser(true);
        } else {
          // Caso contrário, está realmente deslogado
          console.log("[useAuthProvider] Usuário completamente deslogado");
          setIsLoggedIn(false);
          setIsAdminUser(false);
          setUserEmail(null);
        }
      } else if (event === 'TOKEN_REFRESHED' && isMounted) {
        console.log("[useAuthProvider] Token atualizado com sucesso");
      }
    });
    
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
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
};
