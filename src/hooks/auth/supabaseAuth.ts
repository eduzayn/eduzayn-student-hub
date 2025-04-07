
import { ADMIN_EMAILS } from "@/components/auth/LoginForm";
import { supabase } from "@/integrations/supabase/client";

// Função para verificar autenticação do Supabase
export const checkSupabaseAuth = async (
  setIsLoggedIn: (value: boolean) => void,
  setIsAdminBypass: (value: boolean) => void,
  setIsAdminUser: (value: boolean) => void,
  setUserEmail: (value: string | null) => void
) => {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    console.log("[supabaseAuth] Verificando sessão do Supabase:", !!session, "Email:", session?.user?.email);
    
    if (session) {
      console.log("[supabaseAuth] Usuário autenticado via Supabase");
      setIsLoggedIn(true);
      setIsAdminBypass(false);
      const email = session.user?.email || null;
      setUserEmail(email);
      
      // Verificar se é um email administrativo
      const isAdmin = email ? ADMIN_EMAILS.includes(email.toLowerCase()) : false;
      console.log("[supabaseAuth] Verificação de email admin:", isAdmin, email);
      setIsAdminUser(isAdmin);
      return true;
    }
    
    console.log("[supabaseAuth] Usuário não autenticado via Supabase");
    setIsLoggedIn(false);
    setIsAdminUser(false);
    setUserEmail(null);
    return false;
  } catch (error) {
    console.error("[supabaseAuth] Erro ao verificar sessão Supabase:", error);
    return false;
  }
};
