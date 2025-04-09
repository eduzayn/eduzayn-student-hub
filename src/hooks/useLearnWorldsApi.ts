
import useLearnWorldsAlunos from '@/hooks/learnworlds/useLearnWorldsAlunos';
import useLearnWorldsCursos from '@/hooks/learnworlds/useLearnWorldsCursos';
import useLearnWorldsMatriculas from '@/hooks/learnworlds/useLearnWorldsMatriculas';

export interface Course {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  courseImage?: string;
  price?: number;
  price_final?: number;
  access?: string;
  duration?: string;
}

/**
 * Hook combinado que fornece todas as funcionalidades da API do LearnWorlds
 * através de uma única interface
 */
const useLearnWorldsApi = () => {
  // Usar hooks individuais para cada funcionalidade
  const {
    getUsers,
    cadastrarAluno,
    sincronizarAlunos,
    loading: loadingAlunos,
    error: errorAlunos,
    offlineMode: offlineAlunos
  } = useLearnWorldsAlunos();

  const {
    getCourses,
    getCourseDetails,
    getAllCourses,
    sincronizarCursos,
    loading: loadingCursos,
    error: errorCursos,
    offlineMode: offlineCursos
  } = useLearnWorldsCursos();

  const {
    matricularAlunoEmCurso,
    verificarMatricula,
    atualizarStatusMatricula,
    matriculaStatus,
    loading: loadingMatriculas,
    error: errorMatriculas,
    offlineMode: offlineMatriculas
  } = useLearnWorldsMatriculas();

  // Determinar estado combinado
  const loading = loadingAlunos || loadingCursos || loadingMatriculas;
  const error = errorAlunos || errorCursos || errorMatriculas;
  const offlineMode = offlineAlunos || offlineCursos || offlineMatriculas;

  return {
    // Alunos - mapeamento para compatibilidade
    buscarAlunos: getUsers,
    buscarDadosAluno: (id: string) => getUsers(1, 1, `id:${id}`),
    criarAluno: cadastrarAluno,
    atualizarAluno: (id: string, dados: any) => console.log('Função não implementada: atualizarAluno'),
    getUsers,
    cadastrarAluno,
    sincronizarAlunos,
    
    // Cursos - mapeamento para compatibilidade
    buscarCursos: getCourses,
    buscarCursoDetalhes: getCourseDetails,
    criarCurso: (dados: any) => console.log('Função não implementada: criarCurso'),
    atualizarCurso: (id: string, dados: any) => console.log('Função não implementada: atualizarCurso'),
    getCourses,
    getCourseDetails,
    getAllCourses,
    sincronizarCursos,
    
    // Matrículas
    matricularAlunoEmCurso,
    verificarMatricula,
    atualizarStatusMatricula,
    matriculaStatus,
    
    // Estados
    loading,
    error,
    offlineMode
  };
};

export default useLearnWorldsApi;
export type { Course };
