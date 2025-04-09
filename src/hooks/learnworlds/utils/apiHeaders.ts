
import { getAuthorizationHeader } from '@/hooks/auth/adminBypass';
import { LEARNWORLDS_PUBLIC_TOKEN, LEARNWORLDS_SCHOOL_ID } from './apiConstants';

/**
 * Utilitário para gerenciar headers de requisições para a API LearnWorlds
 */
export const getPublicAuthorizationHeader = (apiToken: string): string => {
  return `Bearer ${apiToken}`;
};

export const getRequestHeaders = (usePublicToken: boolean, apiToken: string, schoolId: string): HeadersInit => {
  // IMPORTANTE: Usar o token administrativo para todas as requisições
  // A API está configurada para usar diferentes métodos de autenticação dependendo do endpoint
  const finalAuthHeader = getAuthorizationHeader();
  
  return {
    'Authorization': finalAuthHeader,
    'Content-Type': 'application/json',
    'Lw-Client': schoolId // Cabeçalho Lw-Client obrigatório
  };
};

/**
 * Retorna os cabeçalhos específicos para requisições que exigem autenticação OAuth
 * @returns {HeadersInit} Cabeçalhos para requisição OAuth
 */
export const getOAuthRequestHeaders = (accessToken: string, schoolId: string): HeadersInit => {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Lw-Client': schoolId
  };
};

/**
 * Retorna os cabeçalhos para requisições que usam autenticação direta via API Key
 * @returns {HeadersInit} Cabeçalhos para requisição com API Key
 */
export const getApiKeyRequestHeaders = (apiKey: string, schoolId: string): HeadersInit => {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Lw-Client': schoolId
  };
};
