
import useLearnWorldsAlunos from '@/hooks/learnworlds/useLearnWorldsAlunos';
import useLearnWorldsCursos from '@/hooks/learnworlds/useLearnWorldsCursos';
import useLearnWorldsMatriculas from '@/hooks/learnworlds/useLearnWorldsMatriculas';
import { Course } from './learnworlds/types/cursoTypes';

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
    // Alunos
    getUsers,
    cadastrarAluno,
    sincronizarAlunos,
    buscarAlunos: getUsers,
    buscarDadosAluno: (id: string) => getUsers(1, 1, `id:${id}`),
    criarAluno: cadastrarAluno,
    atualizarAluno: (id: string, dados: any) => console.log('Função não implementada: atualizarAluno'),
    
    // Cursos
    getCourses,
    getCourseDetails,
    getAllCourses,
    sincronizarCursos,
    buscarCursos: getCourses,
    buscarCursoDetalhes: getCourseDetails,
    criarCurso: (dados: any) => console.log('Função não implementada: criarCurso'),
    atualizarCurso: (id: string, dados: any) => console.log('Função não implementada: atualizarCurso'),
    
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
