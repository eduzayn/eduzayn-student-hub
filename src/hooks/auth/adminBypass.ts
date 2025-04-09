
/**
 * Funções utilitárias para o bypass de autenticação do administrador
 */

// Token de bypass para administrador - deve corresponder ao que está na função edge
const ADMIN_BYPASS_TOKEN = "byZ4yn-#v0lt-2025!SEC";

// Chaves para valores armazenados no localStorage
const ADMIN_BYPASS_KEY = "admin_bypass";
const ADMIN_BYPASS_EMAIL_KEY = "admin_bypass_email";

/**
 * Verifica se o bypass de administrador está ativo
 */
export const isAdminBypassAuthenticated = (): boolean => {
  return localStorage.getItem(ADMIN_BYPASS_KEY) === "true";
};

/**
 * Define o estado de bypass de administrador
 */
export const setAdminBypassAuthenticated = (value: boolean, email: string = "admin@eduzayn.com.br"): void => {
  localStorage.setItem(ADMIN_BYPASS_KEY, value ? "true" : "false");
  
  if (value) {
    localStorage.setItem(ADMIN_BYPASS_EMAIL_KEY, email);
  } else {
    localStorage.removeItem(ADMIN_BYPASS_EMAIL_KEY);
  }
  
  console.log(`Bypass de administrador ${value ? "ativado" : "desativado"} para ${email}`);
};

/**
 * Obtém o email associado ao bypass de administrador
 */
export const getAdminBypassEmail = (): string | null => {
  return localStorage.getItem(ADMIN_BYPASS_EMAIL_KEY);
};

/**
 * Obtém o token de bypass de administrador
 * Esse token deve corresponder ao definido na função edge
 */
export const getAdminBypassToken = (): string => {
  return ADMIN_BYPASS_TOKEN;
};

/**
 * Retorna o cabeçalho de autorização para requisições de administrador
 */
export const getAuthorizationHeader = (): string => {
  return `Bearer ${ADMIN_BYPASS_TOKEN}`;
};

/**
 * Verifica o bypass de administrador e define o estado de autenticação
 */
export const checkAdminBypass = (
  setIsLoggedIn: (value: boolean) => void,
  setIsAdminBypass: (value: boolean) => void,
  setIsAdminUser: (value: boolean) => void,
  setUserEmail: (value: string | null) => void
): boolean => {
  const adminBypass = isAdminBypassAuthenticated();
  
  if (adminBypass) {
    const bypassEmail = getAdminBypassEmail();
    console.log(`Admin bypass está ativo para email: ${bypassEmail}`);
    
    if (bypassEmail) {
      setIsLoggedIn(true);
      setIsAdminBypass(true);
      setIsAdminUser(true);
      setUserEmail(bypassEmail);
      return true;
    }
  }
  
  return false;
};
