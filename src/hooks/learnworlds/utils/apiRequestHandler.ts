
import { getDadosSimulados, getDetalhesCursoSimulado } from './mockCursosData';
import { CoursesResponse } from '../types/cursoTypes';
import { adaptApiResponse } from './responseAdapter';

/**
 * Utilitário para lidar com requisições de API
 */
export const handleCourseRequest = async (
  endpoint: string,
  makePublicRequest: any,
  setOfflineMode: any,
  page: number,
  limit: number,
  searchTerm: string
): Promise<CoursesResponse> => {
  console.log(`Fazendo requisição para endpoint: ${endpoint}`);
  
  try {
    const response = await makePublicRequest(endpoint);
    console.log("Resposta de cursos do LearnWorlds:", response);
    
    // Verificar se temos uma resposta válida
    if (!response) {
      console.error("Resposta nula da API de cursos");
      setOfflineMode(true);
      return getDadosSimulados(page, limit, searchTerm);
    }
    
    // Verificar se recebemos HTML (erro comum)
    if (response.text && typeof response.text === 'string' && 
        (response.text.includes("<!DOCTYPE html>") || response.text.includes("<html"))) {
      console.warn("Recebida resposta HTML, ativando modo offline");
      setOfflineMode(true);
      return getDadosSimulados(page, limit, searchTerm);
    }
    
    // DIAGNÓSTICO ADICIONAL: Verificar o formato exato da resposta para debug
    console.log("Tipo da resposta:", typeof response);
    console.log("Estrutura da resposta:", Object.keys(response));
    
    // Verificar resposta e adaptar formato se necessário
    if (response.data !== undefined) {
      if (Array.isArray(response.data)) {
        console.log("Dados recebidos (primeiros 2 itens):", response.data.slice(0, 2));
        
        // Registrar todos os IDs para diagnóstico
        if (response.data.length > 0) {
          const allIds = response.data.map((c: any) => c.id).join(", ");
          console.log("Todos os IDs dos cursos:", allIds);
        }
        
        const dataProperties = response.data.some((item: any) => 
          item.id !== undefined || item.title !== undefined);
        
        if (dataProperties) {
          console.log("✅ Usando dados reais de cursos da API OAuth 2.0:", response.data.length, "cursos encontrados");
          setOfflineMode(false);
          
          // Adaptar formato de resposta para o esperado por CoursesResponse
          return adaptApiResponse(response);
        } else {
          console.error("⚠️ Os dados não têm as propriedades esperadas de cursos!");
        }
      } else {
        console.warn("⚠️ API retornou dados em formato não-array:", typeof response.data);
      }
    }
    
    // Se chegamos aqui, não conseguimos interpretar os dados
    console.error("Formato de resposta inválido da API de cursos:", response);
    setOfflineMode(true);
    return getDadosSimulados(page, limit, searchTerm);
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    setOfflineMode(true);
    return getDadosSimulados(page, limit, searchTerm);
  }
};
