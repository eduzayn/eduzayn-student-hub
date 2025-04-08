
import { useState } from 'react';
import useLearnWorldsBase from './useLearnWorldsBase';
import { cursosApi } from './api/cursosApi';
import { getDadosSimulados } from './utils/mockCursosData';
import type { Course, CoursesResponse, SincronizacaoResult } from './types/cursoTypes';

/**
 * Hook para gerenciar operações relacionadas a cursos do LearnWorlds
 */
const useLearnWorldsCursos = () => {
  const { 
    makeRequest, 
    makePublicRequest, 
    loading, 
    error, 
    offlineMode, 
    setOfflineMode 
  } = useLearnWorldsBase();
  const [loadingAllCourses, setLoadingAllCourses] = useState<boolean>(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  // Instanciar API de cursos
  const { getCourses, getCourseDetails, sincronizarCursos } = cursosApi(
    makeRequest,
    makePublicRequest,
    setOfflineMode
  );
  
  /**
   * Busca todos os cursos, gerenciando múltiplas requisições paginadas
   */
  const getAllCourses = async (): Promise<Course[]> => {
    setLoadingAllCourses(true);
    
    try {
      console.log("Iniciando busca completa de todos os cursos");
      const firstPage = await getCourses(1, 50);
      
      // Se não temos meta ou apenas uma página, retornamos os resultados da primeira página
      if (!firstPage.meta || firstPage.meta.totalPages <= 1) {
        console.log(`Encontrada apenas uma página de cursos com ${firstPage.data?.length || 0} itens`);
        setAllCourses(firstPage.data);
        return firstPage.data;
      }
      
      // Se temos múltiplas páginas, vamos buscar todas
      console.log(`Encontradas ${firstPage.meta.totalPages} páginas de cursos, buscando todas...`);
      let allData = [...firstPage.data];
      
      // Criar promessas para todas as outras páginas
      const promises = [];
      
      for (let page = 2; page <= firstPage.meta.totalPages; page++) {
        promises.push(getCourses(page, 50));
      }
      
      // Executar todas as promessas em paralelo
      console.log(`Executando ${promises.length} requisições em paralelo para páginas adicionais`);
      const results = await Promise.all(promises);
      
      // Concatenar os resultados
      for (const result of results) {
        if (result.data) {
          allData = [...allData, ...result.data];
        }
      }
      
      console.log(`Total de cursos obtidos: ${allData.length}`);
      setAllCourses(allData);
      return allData;
    } catch (error) {
      console.error("Erro ao buscar todos os cursos:", error);
      
      // Em caso de falha, usamos dados simulados
      console.log("Usando dados simulados devido a erro");
      const dadosSimulados = getDadosSimulados(1, 10, "").data;
      setAllCourses(dadosSimulados);
      return dadosSimulados;
    } finally {
      setLoadingAllCourses(false);
    }
  };

  return {
    getCourses,
    getCourseDetails,
    getAllCourses,
    sincronizarCursos,
    allCourses,
    loading: loading || loadingAllCourses,
    error,
    offlineMode
  };
};

export default useLearnWorldsCursos;
export type { Course, SincronizacaoResult };
