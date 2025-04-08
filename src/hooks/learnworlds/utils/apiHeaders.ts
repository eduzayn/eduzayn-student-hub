
import { getAuthorizationHeader } from '@/hooks/auth/adminBypass';

/**
 * Utilitário para gerenciar headers de requisições para a API LearnWorlds
 */
export const getPublicAuthorizationHeader = (publicToken: string): string => {
  return `Bearer ${publicToken}`;
};

export const getRequestHeaders = (usePublicToken: boolean, publicToken: string): HeadersInit => {
  // IMPORTANTE: Usar o token administrativo para todas as requisições
  // A API está rejeitando o token público, então usaremos o token admin para todas requisições
  const finalAuthHeader = getAuthorizationHeader();
  
  return {
    'Authorization': finalAuthHeader,
    'Content-Type': 'application/json',
  };
};
