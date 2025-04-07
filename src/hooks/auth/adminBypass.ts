
import { supabase } from "@/integrations/supabase/client";

// Token JWT para bypass administrativo (gerado previamente e com validade longa)
// Este token será usado apenas para chamadas de API quando estiver em modo bypass
export const ADMIN_BYPASS_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpb2FyemtmbWNvYmN0Ymx6enRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTYwMTksImV4cCI6MjA1OTQ3MjAxOX0.VJTJA5hKhVWFA4x-pM7jXetJsCz8-aMuJDOoVAlPeQc";

// Verificar se o usuário com bypass está logado
export const isAdminBypassAuthenticated = () => {
  try {
    return localStorage.getItem('adminBypassAuthenticated') === 'true';
  } catch (e) {
    console.error("[adminBypass] Erro ao verificar bypass:", e);
    return false;
  }
};

// Obter o email do administrador bypass
export const getAdminBypassEmail = () => {
  try {
    return localStorage.getItem('adminBypassEmail');
  } catch (e) {
    console.error("[adminBypass] Erro ao obter email de bypass admin:", e);
    return null;
  }
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
