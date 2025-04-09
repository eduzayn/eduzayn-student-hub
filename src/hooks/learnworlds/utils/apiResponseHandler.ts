
import { CoursesResponse } from '../types/cursoTypes';
import { adaptApiResponse } from './responseAdapter';
import { getDadosSimulados } from './mockCursosData';

/**
 * Processa a resposta da API e converte para o formato esperado
 */
export const processApiResponse = (
  response: any,
  setOfflineMode: (isOffline: boolean) => void
): CoursesResponse => {
  // Verificar se a resposta é válida
  if (!response) {
    console.error("Resposta nula da API de cursos");
    setOfflineMode(true);
    return getDadosSimulados(1, 20, "");
  }
  
  // Verificar se recebemos HTML (erro comum)
  if (isHtmlResponse(response)) {
    console.warn("Recebida resposta HTML, ativando modo offline");
    setOfflineMode(true);
    return getDadosSimulados(1, 20, "");
  }
  
  // DIAGNÓSTICO ADICIONAL: Verificar o formato exato da resposta para debug
  logResponseStructure(response);
  
  // Verificar resposta e adaptar formato se necessário
  if (hasValidData(response)) {
    console.log("✅ Usando dados reais de cursos da API OAuth 2.0:", response.data.length, "cursos encontrados");
    setOfflineMode(false);
    
    // Adaptar formato de resposta para o esperado por CoursesResponse
    return adaptApiResponse(response);
  }
  
  // Se chegamos aqui, não conseguimos interpretar os dados
  console.error("Formato de resposta inválido da API de cursos:", response);
  setOfflineMode(true);
  return getDadosSimulados(1, 20, "");
};

/**
 * Verifica se a resposta contém dados HTML em vez de JSON
 */
export const isHtmlResponse = (response: any): boolean => {
  if (response.text && typeof response.text === 'string' && 
      (response.text.includes("<!DOCTYPE html>") || response.text.includes("<html"))) {
    return true;
  }
  return false;
};

/**
 * Registra detalhes sobre a estrutura da resposta para diagnóstico
 */
export const logResponseStructure = (response: any): void => {
  console.log("Tipo da resposta:", typeof response);
  console.log("Estrutura da resposta:", Object.keys(response));
  
  if (response.data && Array.isArray(response.data) && response.data.length > 0) {
    console.log("Dados recebidos (primeiros 2 itens):", response.data.slice(0, 2));
    
    // Registrar todos os IDs para diagnóstico
    const allIds = response.data.map((c: any) => c.id).join(", ");
    console.log("Todos os IDs dos cursos:", allIds);
  }
};

/**
 * Verifica se a resposta contém dados válidos de cursos
 */
export const hasValidData = (response: any): boolean => {
  return response.data !== undefined && 
         Array.isArray(response.data) && 
         response.data.length > 0 &&
         response.data.some((item: any) => item.id !== undefined || item.title !== undefined);
};
