
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BuscaCurso from "./cursos/BuscaCurso";
import CursosLista from "./cursos/CursosLista";
import ApiErrorDisplay from "./cursos/ApiErrorDisplay";
import OfflineModeIndicator from "./OfflineModeIndicator";
import useCursoSelection from "./hooks/useCursoSelection";

interface SelectCursoProps {
  onCursoSelecionado: (curso: any) => void;
}

const SelectCurso: React.FC<SelectCursoProps> = ({ onCursoSelecionado }) => {
  const {
    busca,
    setBusca,
    cursos,
    selecionado,
    loading,
    error,
    offlineMode,
    handleBusca,
    handleSelecionar
  } = useCursoSelection(onCursoSelecionado);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Selecione o Curso</h2>
      
      {offlineMode && (
        <OfflineModeIndicator message="API do LearnWorlds indisponível. Usando dados simulados para cursos." />
      )}
      
      <BuscaCurso 
        busca={busca}
        setBusca={setBusca}
        handleBusca={handleBusca}
        loading={loading}
      />
      
      {error && !offlineMode && <ApiErrorDisplay error={error} />}
      
      <div className="mt-6">
        <CursosLista 
          cursos={cursos}
          selecionado={selecionado}
          loading={loading}
          onSelecionar={handleSelecionar}
        />
      </div>
    </div>
  );
};

export default SelectCurso;
