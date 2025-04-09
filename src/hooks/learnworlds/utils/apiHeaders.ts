
import { getAuthorizationHeader } from '@/hooks/auth/adminBypass';

/**
 * Utilitário para gerenciar headers de requisições para a API LearnWorlds
 */
export const getPublicAuthorizationHeader = (publicToken: string): string => {
  return `Bearer ${publicToken}`;
};

export const getRequestHeaders = (usePublicToken: boolean, publicToken: string, schoolId: string): HeadersInit => {
  // IMPORTANTE: Usar o token administrativo para todas as requisições
  // A API está configurada para usar diferentes métodos de autenticação dependendo do endpoint
  const finalAuthHeader = getAuthorizationHeader();
  
  return {
    'Authorization': finalAuthHeader,
    'Content-Type': 'application/json',
    'Lw-Client': schoolId // Adicionado cabeçalho Lw-Client obrigatório
  };
};
