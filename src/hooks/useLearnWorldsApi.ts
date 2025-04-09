
import useLearnWorldsAlunos from '@/hooks/learnworlds/useLearnWorldsAlunos';
import useLearnWorldsCursos from '@/hooks/learnworlds/useLearnWorldsCursos';
import useLearnWorldsMatriculas from '@/hooks/learnworlds/useLearnWorldsMatriculas';

/**
 * Hook combinado que fornece todas as funcionalidades da API do LearnWorlds
 * através de uma única interface
 */
const useLearnWorldsApi = () => {
  // Usar hooks individuais para cada funcionalidade
  const {
    buscarAlunos,
    buscarDadosAluno,
    criarAluno,
    atualizarAluno,
    loading: loadingAlunos,
    error: errorAlunos,
    offlineMode: offlineAlunos
  } = useLearnWorldsAlunos();

  const {
    buscarCursos,
    buscarCursoDetalhes,
    criarCurso,
    atualizarCurso,
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
    buscarAlunos,
    buscarDadosAluno,
    criarAluno,
    atualizarAluno,
    
    // Cursos
    buscarCursos,
    buscarCursoDetalhes,
    criarCurso,
    atualizarCurso,
    
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
