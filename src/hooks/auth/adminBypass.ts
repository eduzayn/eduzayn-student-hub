
import { supabase } from "@/integrations/supabase/client";

// Token JWT para bypass administrativo (deve ser igual ao ADMIN_BYPASS_TOKEN configurado na edge function)
export const ADMIN_BYPASS_JWT = "byZ4yn-#v0lt-2025!SEC";

// Verificar se o usuário com bypass está logado
export const isAdminBypassAuthenticated = () => {
  try {
    return localStorage.getItem("adminBypassAuthenticated") === "true";
  } catch (e) {
    console.error("[adminBypass] Erro ao verificar bypass:", e);
    return false;
  }
};

// Obter o email do administrador bypass
export const getAdminBypassEmail = () => {
  try {
    return localStorage.getItem("adminBypassEmail") || "bypass.admin@eduzayn.com.br";
  } catch (e) {
    console.error("[adminBypass] Erro ao obter email de bypass admin:", e);
    return null;
  }
};

// Nova função para obter o token de bypass de forma consistente
export const getAdminBypassToken = (): string => {
  return ADMIN_BYPASS_JWT;
};

// Função para formatar o token no formato Authorization Bearer
export const getAuthorizationHeader = (): string => {
  return `Bearer ${ADMIN_BYPASS_JWT}`;
};

// Função para verificar autenticação com bypass de admin
export const checkAdminBypass = (
  setIsLoggedIn: (value: boolean) => void,
  setIsAdminBypass: (value: boolean) => void,
  setIsAdminUser: (value: boolean) => void,
  setUserEmail: (value: string | null) => void
) => {
  try {
    const adminBypass = isAdminBypassAuthenticated();
    console.log("[adminBypass] Verificando admin bypass:", adminBypass);

    if (adminBypass) {
      const email = getAdminBypassEmail();
      
      // Verificar se é o usuário administrador autenticado
      if (email === "ana.diretoria@eduzayn.com.br") {
        console.log("[adminBypass] Ignorando bypass para usuário administrativo autenticado");
        return false;
      }
      
      console.log("[adminBypass] Admin bypass autenticado para:", email);

      setIsLoggedIn(true);
      setIsAdminBypass(true);
      setIsAdminUser(true);
      setUserEmail(email);
      return true;
    }

    return false;
  } catch (e) {
    console.error("[adminBypass] Erro ao verificar bypass:", e);
    return false;
  }
};
