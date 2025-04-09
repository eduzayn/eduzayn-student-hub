
import { CoursesResponse } from '../types/cursoTypes';
import { courseService } from '../services/courseService';
import { courseDetailsService } from '../services/courseDetailsService';
import { courseSyncService } from '../services/courseSyncService';

/**
 * Funções de API relacionadas a cursos do LearnWorlds
 */
export const cursosApi = (makeRequest: any, makePublicRequest: any, setOfflineMode: any) => {
  // Inicializar os serviços
  const { getCourses } = courseService(makePublicRequest, setOfflineMode);
  const { getCourseDetails } = courseDetailsService(makePublicRequest, setOfflineMode);
  const { sincronizarCursos } = courseSyncService(makeRequest);

  return {
    getCourses,
    getCourseDetails,
    sincronizarCursos
  };
};
