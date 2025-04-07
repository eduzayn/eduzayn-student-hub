
import { useEffect } from "react";
import { useApiStatus } from "./useApiStatus";
import { useSincronizacaoAlunos } from "./useSincronizacaoAlunos";
import { useSincronizacaoCursos } from "./useSincronizacaoCursos";

export const useDataSync = () => {
  const apiStatus = useApiStatus();
  const alunosSync = useSincronizacaoAlunos();
  const cursosSync = useSincronizacaoCursos();

  // Carregar os dados iniciais
  useEffect(() => {
    apiStatus.checkAPIConnection();
    alunosSync.loadCountAlunos();
    cursosSync.loadCountCursos();
  }, []);

  return {
    ...apiStatus,
    ...alunosSync,
    ...cursosSync
  };
};
