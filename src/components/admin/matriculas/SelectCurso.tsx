
import React from "react";
import BuscaCurso from "./cursos/BuscaCurso";
import CursosLista from "./cursos/CursosLista";
import ApiErrorDisplay from "./cursos/ApiErrorDisplay";
import OfflineModeIndicator from "./OfflineModeIndicator";
import useCursoSelection from "./hooks/useCursoSelection";
import CursosPagination from "./cursos/lista/CursosPagination";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
    page,
    totalPages,
    setPage,
    handleBusca,
    handleSelecionar,
    limparBusca
  } = useCursoSelection(onCursoSelecionado);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Selecione o Curso</h2>
      
      {offlineMode && (
        <OfflineModeIndicator message="API do LearnWorlds indisponível. Usando dados simulados para cursos." />
      )}
      
      <div className="flex flex-col gap-2">
        <BuscaCurso 
          busca={busca}
          setBusca={setBusca}
          handleBusca={handleBusca}
          loading={loading}
        />
        
        {busca && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Filtrando por: <strong>{busca}</strong>
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={limparBusca}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar filtro
            </Button>
          </div>
        )}
      </div>
      
      {error && !offlineMode && <ApiErrorDisplay error={error} />}
      
      <div className="mt-6">
        <CursosLista 
          cursos={cursos}
          selecionado={selecionado}
          loading={loading}
          offlineMode={offlineMode}
          onSelecionar={handleSelecionar}
        />
      </div>
      
      {!loading && cursos.length > 0 && totalPages > 1 && (
        <CursosPagination 
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default SelectCurso;
