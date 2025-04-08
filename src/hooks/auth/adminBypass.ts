
/**
 * Funções utilitárias para obter tokens de autenticação do administrador
 */

// Token de bypass para admins - deve corresponder ao valor na função Edge
const ADMIN_BYPASS_TOKEN = "byZ4yn-#v0lt-2025!SEC";

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
