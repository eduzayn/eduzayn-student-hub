
import { useState } from 'react';
import useMatricularAluno from './matriculas/useMatricularAluno';
import useVerificarMatricula from './matriculas/useVerificarMatricula';
import useAtualizarMatricula from './matriculas/useAtualizarMatricula';
import useLearnWorldsBase from './useLearnWorldsBase';
import { EnrollmentResponse } from './types/cursoTypes';

/**
 * Hook para gerenciar matrículas no LearnWorlds
 * Combina funcionalidades específicas de outros hooks
 */
const useLearnWorldsMatriculas = () => {
  // Utilizamos os hooks específicos
  const { offlineMode, error, loading } = useLearnWorldsBase();
  const { 
    matricularAlunoEmCurso,
    matriculaStatus 
  } = useMatricularAluno();
  
  const { 
    verificarMatricula 
  } = useVerificarMatricula();
  
  const { 
    atualizarStatusMatricula 
  } = useAtualizarMatricula();

  // Retornamos todas as funcionalidades combinadas
  return {
    loading,
    error,
    offlineMode,
    matriculaStatus,
    matricularAlunoEmCurso,
    verificarMatricula,
    atualizarStatusMatricula
  };
};

export default useLearnWorldsMatriculas;
