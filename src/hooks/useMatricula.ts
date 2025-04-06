
import { useBuscarMatriculas } from "./matriculas/useBuscarMatriculas";
import { useCriarMatricula } from "./matriculas/useCriarMatricula";
import { useStatusMatricula } from "./matriculas/useStatusMatricula";
import { useAtualizarMatricula } from "./matriculas/useAtualizarMatricula";
import { useHistoricoMatricula } from "./matriculas/useHistoricoMatricula";
import { useState } from "react";

/**
 * Hook combinado que provê todas as funcionalidades relacionadas às matrículas
 */
export const useMatricula = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { 
    buscarMatriculas,
    buscarMatricula 
  } = useBuscarMatriculas();
  
  const { 
    criarMatricula 
  } = useCriarMatricula();
  
  const { 
    atualizarStatusMatricula 
  } = useStatusMatricula();
  
  const { 
    atualizarMatricula 
  } = useAtualizarMatricula();
  
  const { 
    buscarHistoricoMatricula 
  } = useHistoricoMatricula();

  return {
    loading,
    error,
    buscarMatriculas,
    buscarMatricula,
    criarMatricula,
    atualizarMatricula,
    atualizarStatusMatricula,
    buscarHistoricoMatricula
  };
};
