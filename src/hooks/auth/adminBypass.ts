
/**
 * Funções utilitárias para obter tokens de autenticação do administrador
 */

// Token de bypass para admins - deve corresponder ao valor na função Edge
const ADMIN_BYPASS_TOKEN = "byZ4yn-#v0lt-2025!SEC";

/**
 * Verifica se existe um bypass de admin ativo no localStorage
 * 
 * @returns True se o bypass de admin estiver ativo
 */
export const isAdminBypassAuthenticated = (): boolean => {
  const bypassAuthenticated = localStorage.getItem("adminBypassAuthenticated");
  return bypassAuthenticated === "true";
};

/**
 * Obtém o email associado ao bypass de admin
 * 
 * @returns O email do bypass de admin, ou null se não estiver definido
 */
export const getAdminBypassEmail = (): string | null => {
  return localStorage.getItem("adminBypassEmail");
};

/**
 * Verifica se há um bypass de admin e atualiza o estado de autenticação
 * 
 * @param setIsLoggedIn Função para atualizar o estado de login
 * @param setIsAdminBypass Função para atualizar o estado de bypass de admin
 * @param setIsAdminUser Função para atualizar o estado de usuário admin
 * @param setUserEmail Função para atualizar o email do usuário
 * @returns True se o bypass de admin estiver ativo
 */
export const checkAdminBypass = (
  setIsLoggedIn: (value: boolean) => void,
  setIsAdminBypass: (value: boolean) => void,
  setIsAdminUser: (value: boolean) => void,
  setUserEmail: (value: string | null) => void
): boolean => {
  if (isAdminBypassAuthenticated()) {
    const email = getAdminBypassEmail();
    console.log("[adminBypass] Bypass de administrador ativo para:", email);
    setIsLoggedIn(true);
    setIsAdminBypass(true);
    setIsAdminUser(true);
    setUserEmail(email);
    return true;
  }
  return false;
};

/**
 * Obtém o token de bypass para administradores
 * @returns O token de bypass admin
 */
export const getAdminBypassToken = (): string => {
  return ADMIN_BYPASS_TOKEN;
};

/**
 * Obtém o cabeçalho de autorização completo para requisições administrativas
 * @returns O cabeçalho de autorização formatado com o token
 */
export const getAuthorizationHeader = (): string => {
  return `Bearer ${ADMIN_BYPASS_TOKEN}`;
};
