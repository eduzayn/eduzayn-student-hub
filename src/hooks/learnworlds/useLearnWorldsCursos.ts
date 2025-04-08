
import { useState } from 'react';
import useLearnWorldsBase from './useLearnWorldsBase';

interface Course {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  courseImage?: string;
  price?: number;
  price_original?: number;
  price_final?: number;
  duration?: string;
  access?: 'free' | 'paid';
  categories?: string[];
}

interface CoursesResponse {
  data: Course[];
  meta?: {
    page: number;
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

const useLearnWorldsCursos = () => {
  const { 
    makeRequest, 
    makePublicRequest, 
    loading, 
    error, 
    offlineMode, 
    setOfflineMode 
  } = useLearnWorldsBase();
  const [loadingAllCourses, setLoadingAllCourses] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  /**
   * Busca cursos do LearnWorlds com paginação
   * @param page Número da página para carregar
   * @param limit Quantidade de cursos por página
   * @param searchTerm Termo de busca opcional
   * @param categories Categorias para filtrar
   * @returns Resposta com cursos e metadados
   */
  const getCourses = async (
    page = 1, 
    limit = 20, 
    searchTerm = "", 
    categories = ""
  ): Promise<CoursesResponse> => {
    console.log(`Buscando cursos LearnWorlds: página ${page}, limite ${limit}, parâmetros: page=${page}&limit=${limit}`);
    
    try {
      // Construir endpoint com parâmetros de consulta
      let endpoint = `learnworlds-api/courses?page=${page}&limit=${limit}`;
      
      if (searchTerm) {
        endpoint += `&q=${encodeURIComponent(searchTerm)}`;
      }
      
      if (categories) {
        endpoint += `&categories=${encodeURIComponent(categories)}`;
      }
      
      // Usar token público para esta operação
      const response = await makePublicRequest(endpoint);
      console.log("Resposta de cursos do LearnWorlds:", response);
      
      // Verificar se temos uma resposta válida
      if (response && 
          ((response.data && Array.isArray(response.data)) || 
           (response.text && response.text.includes("<!DOCTYPE html>")))) {
        
        // Se for HTML, ativar modo offline
        if (response.text && response.text.includes("<!DOCTYPE html>")) {
          console.warn("Recebida resposta HTML, ativando modo offline");
          setOfflineMode(true);
          return getDadosSimulados(page, limit, searchTerm);
        }
        
        return response;
      } else {
        console.error("Resposta inválida da API de cursos:", response);
        setOfflineMode(true);
        return getDadosSimulados(page, limit, searchTerm);
      }
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      setOfflineMode(true);
      return getDadosSimulados(page, limit, searchTerm);
    }
  };
  
  /**
   * Busca detalhes de um curso específico por ID
   * @param courseId ID do curso a ser consultado
   * @returns Detalhes completos do curso
   */
  const getCourseDetails = async (courseId: string): Promise<any> => {
    try {
      const response = await makePublicRequest(`learnworlds-api/courses/${courseId}`);
      
      if (!response || response.error || (response.text && response.text.includes("<!DOCTYPE html>"))) {
        setOfflineMode(true);
        return getDetalhesCursoSimulado(courseId);
      }
      
      return response;
    } catch (error) {
      console.error(`Erro ao buscar detalhes do curso ${courseId}:`, error);
      setOfflineMode(true);
      return getDetalhesCursoSimulado(courseId);
    }
  };
  
  /**
   * Busca todos os cursos, gerenciando múltiplas requisições paginadas
   * @returns Array com todos os cursos encontrados
   */
  const getAllCourses = async (): Promise<Course[]> => {
    setLoadingAllCourses(true);
    
    try {
      const firstPage = await getCourses(1, 50);
      
      // Se não temos meta ou apenas uma página, retornamos os resultados da primeira página
      if (!firstPage.meta || firstPage.meta.totalPages <= 1) {
        setAllCourses(firstPage.data);
        return firstPage.data;
      }
      
      // Se temos múltiplas páginas, vamos buscar todas
      let allData = [...firstPage.data];
      
      // Criar promessas para todas as outras páginas
      const promises = [];
      
      for (let page = 2; page <= firstPage.meta.totalPages; page++) {
        promises.push(getCourses(page, 50));
      }
      
      // Executar todas as promessas em paralelo
      const results = await Promise.all(promises);
      
      // Concatenar os resultados
      for (const result of results) {
        if (result.data) {
          allData = [...allData, ...result.data];
        }
      }
      
      setAllCourses(allData);
      return allData;
    } catch (error) {
      console.error("Erro ao buscar todos os cursos:", error);
      
      // Em caso de falha, usamos dados simulados
      const dadosSimulados = getDadosSimulados(1, 10, "").data;
      setAllCourses(dadosSimulados);
      return dadosSimulados;
    } finally {
      setLoadingAllCourses(false);
    }
  };
  
  /**
   * Sincroniza cursos do LearnWorlds com o banco de dados local
   * @returns Status da sincronização
   */
  const sincronizarCursos = async (): Promise<{ success: boolean, message: string, syncedItems?: number }> => {
    try {
      // Esta função requer token de administrador
      const response = await makeRequest("learnworlds-sync/courses", "POST");
      
      if (!response || response.error) {
        throw new Error(response?.message || "Erro na sincronização de cursos");
      }
      
      return {
        success: true,
        message: "Cursos sincronizados com sucesso",
        syncedItems: response.syncedCount || 0
      };
    } catch (error: any) {
      console.error("Erro ao sincronizar cursos:", error);
      
      return {
        success: false,
        message: error.message || "Erro ao sincronizar cursos"
      };
    }
  };
  
  // Função auxiliar para retornar dados simulados
  const getDadosSimulados = (page: number, limit: number, searchTerm: string): CoursesResponse => {
    const cursos = [
      {
        id: "c-001",
        title: "Desenvolvimento Web Frontend",
        description: "Aprenda HTML, CSS e JavaScript para criar sites modernos e responsivos.",
        shortDescription: "Aprenda HTML, CSS e JS",
        price_original: 1200,
        price_final: 1200,
        duration: "60 horas",
        image: "https://via.placeholder.com/300x200",
        access: "paid" as 'free' | 'paid',
        categories: ["Tecnologia", "Desenvolvimento"]
      },
      {
        id: "c-002",
        title: "Python para Ciência de Dados",
        description: "Fundamentos de Python e bibliotecas para análise de dados.",
        shortDescription: "Fundamentos de Python e análise",
        price_original: 1500,
        price_final: 1500,
        duration: "80 horas",
        image: "https://via.placeholder.com/300x200",
        access: "paid" as 'free' | 'paid',
        categories: ["Tecnologia", "Dados"]
      },
      {
        id: "c-003",
        title: "Marketing Digital Avançado",
        description: "Estratégias modernas de marketing para impulsionar sua presença online.",
        shortDescription: "Estratégias modernas de marketing",
        price_original: 1800,
        price_final: 1800,
        duration: "90 horas",
        image: "https://via.placeholder.com/300x200",
        access: "paid" as 'free' | 'paid',
        categories: ["Marketing", "Digital"]
      }
    ];

    // Filtrar cursos se houver termo de busca
    const filteredCourses = searchTerm
      ? cursos.filter(c =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
        )
      : cursos;

    // Aplicar paginação
    const startIndex = (page - 1) * limit;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + limit);
    
    return {
      data: paginatedCourses,
      meta: {
        page,
        totalItems: filteredCourses.length,
        totalPages: Math.ceil(filteredCourses.length / limit),
        itemsPerPage: limit
      }
    };
  };
  
  // Função auxiliar para retornar detalhes simulados de um curso
  const getDetalhesCursoSimulado = (courseId: string): any => {
    return {
      id: courseId,
      title: `Curso ${courseId}`,
      description: `Descrição detalhada do curso ${courseId}`,
      price_original: 1500,
      price_final: 1500,
      duration: "80 horas",
      image: "https://via.placeholder.com/600x400",
      modules: [
        {
          id: "module-1",
          title: "Introdução",
          description: "Fundamentos básicos",
          lessons: [
            { id: "lesson-1-1", title: "Primeiros passos", duration: 45 },
            { id: "lesson-1-2", title: "Conceitos fundamentais", duration: 60 }
          ]
        },
        {
          id: "module-2",
          title: "Intermediário",
          description: "Aprofundamento teórico",
          lessons: [
            { id: "lesson-2-1", title: "Técnicas avançadas", duration: 75 },
            { id: "lesson-2-2", title: "Estudos de caso", duration: 90 }
          ]
        }
      ]
    };
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
