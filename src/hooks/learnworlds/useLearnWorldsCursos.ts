
import { useState } from 'react';
import useLearnWorldsBase from './useLearnWorldsBase';
import { cursosApi } from './api/cursosApi';
import { CoursesResponse } from './types/cursoTypes';
import { getDadosSimulados, getDetalhesCursoSimulado } from './utils/mockCursosData';

const useLearnWorldsCursos = () => {
  const { makeRequest, makePublicRequest, loading, error, offlineMode, setOfflineMode } = useLearnWorldsBase();
  const [dadosListagem, setDadosListagem] = useState<CoursesResponse>({ data: [] });
  
  // Inicializar a API de cursos com os métodos do hook base
  const api = cursosApi(makeRequest, makePublicRequest, setOfflineMode);

  // Método para buscar cursos
  const getCourses = async (
    page = 1, 
    limit = 20, 
    searchTerm = "", 
    categories = ""
  ): Promise<CoursesResponse> => {
    try {
      const response = await api.getCourses(page, limit, searchTerm, categories);
      setDadosListagem(response);
      return response;
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      const dadosSimulados = getDadosSimulados(page, limit, searchTerm);
      setDadosListagem(dadosSimulados);
      return dadosSimulados;
    }
  };

  // Método para buscar detalhes de um curso
  const getCourseDetails = async (courseId: string): Promise<any> => {
    try {
      return await api.getCourseDetails(courseId);
    } catch (error) {
      console.error(`Erro ao buscar detalhes do curso ${courseId}:`, error);
      return getDetalhesCursoSimulado(courseId);
    }
  };

  // Método para buscar todos os cursos (sem paginação)
  const getAllCourses = async (): Promise<CoursesResponse> => {
    try {
      // Obter o máximo de cursos possível
      return await getCourses(1, 100);
    } catch (error) {
      console.error("Erro ao buscar todos os cursos:", error);
      return getDadosSimulados(1, 100);
    }
  };
  
  // Método para sincronizar cursos
  const sincronizarCursos = async (todos: boolean = false) => {
    return await api.sincronizarCursos(todos);
  };

  return {
    getCourses,
    getCourseDetails,
    getAllCourses,
    sincronizarCursos,
    dadosListagem,
    loading,
    error,
    offlineMode
  };
};

export default useLearnWorldsCursos;
