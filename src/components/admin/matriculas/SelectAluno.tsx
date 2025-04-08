
import React from "react";
import AlunoSearchBar from "./aluno-selection/AlunoSearchBar";
import AlunosList from "./aluno-selection/AlunosList";
import AlunosLoadingSkeleton from "./aluno-selection/AlunosLoadingSkeleton";
import NovoAlunoDialog from "./aluno-selection/NovoAlunoDialog";
import OfflineModeAlert from "./aluno-selection/OfflineModeAlert";
import ErrorAlert from "./aluno-selection/ErrorAlert";
import { useAlunoSelection } from "./aluno-selection/useAlunoSelection";
import { AlunoSelectionProps } from "./aluno-selection/types";

const SelectAluno: React.FC<AlunoSelectionProps> = ({ onAlunoSelecionado }) => {
  const {
    busca,
    setBusca,
    alunos,
    selecionado,
    dialogAberto,
    setDialogAberto,
    formNovoAluno,
    loading,
    error,
    offlineMode,
    handleBusca,
    handleSelecionar,
    handleInputChange,
    handleCriarNovoAluno
  } = useAlunoSelection({ onAlunoSelecionado });
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Selecione o Aluno</h2>
      
      {offlineMode && <OfflineModeAlert />}
      
      <AlunoSearchBar
        busca={busca}
        setBusca={setBusca}
        handleBusca={handleBusca}
        loading={loading}
        onNovoAluno={() => setDialogAberto(true)}
      />
      
      {error && !offlineMode && <ErrorAlert error={error} />}
      
      <div className="mt-6">
        {loading ? (
          <AlunosLoadingSkeleton />
        ) : (
          <AlunosList
            alunos={alunos}
            selecionado={selecionado}
            onSelecionar={handleSelecionar}
            loading={loading}
          />
        )}
      </div>

      <NovoAlunoDialog
        aberto={dialogAberto}
        setAberto={setDialogAberto}
        formData={formNovoAluno}
        handleInputChange={handleInputChange}
        handleCriarNovoAluno={handleCriarNovoAluno}
        loading={loading}
        offlineMode={offlineMode}
      />
    </div>
  );
};

export default SelectAluno;
