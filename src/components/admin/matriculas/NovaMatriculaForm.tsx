
import React from "react";
import MatriculaErrorDisplay from "./novaMatricula/MatriculaErrorDisplay";
import MatriculaStep1 from "./novaMatricula/MatriculaStep1";
import MatriculaStep2 from "./novaMatricula/MatriculaStep2";
import MatriculaStep3 from "./novaMatricula/MatriculaStep3";
import MatriculaStep4 from "./novaMatricula/MatriculaStep4";
import { useNovaMatricula } from "./novaMatricula/useNovaMatricula";

const NovaMatriculaForm: React.FC = () => {
  const {
    formStep,
    alunoSelecionado,
    cursoSelecionado,
    matriculaConfig,
    loading,
    offlineMode,
    pagamentoInfo,
    redirecionarParaMatriculas,
    criarNovaMatricula,
    prevStep,
    handleAlunoSelecionado,
    handleCursoSelecionado,
    handleConfigChange,
    handleSubmit
  } = useNovaMatricula();
  
  return (
    <div className="space-y-6">
      {offlineMode && <MatriculaErrorDisplay offlineMode={offlineMode} />}
      
      {formStep === 1 && (
        <MatriculaStep1 
          onAlunoSelecionado={handleAlunoSelecionado}
          alunoSelecionado={alunoSelecionado}
          prevStep={prevStep}
        />
      )}
      
      {formStep === 2 && (
        <MatriculaStep2
          onCursoSelecionado={handleCursoSelecionado}
          alunoSelecionado={alunoSelecionado}
          prevStep={prevStep}
        />
      )}
      
      {formStep === 3 && (
        <MatriculaStep3
          alunoSelecionado={alunoSelecionado}
          cursoSelecionado={cursoSelecionado}
          matriculaConfig={matriculaConfig}
          onChange={handleConfigChange}
          onProsseguir={handleSubmit}
          prevStep={prevStep}
          isLoading={loading}
        />
      )}
      
      {formStep === 4 && (
        <MatriculaStep4
          alunoSelecionado={alunoSelecionado}
          cursoSelecionado={cursoSelecionado}
          matriculaConfig={matriculaConfig}
          pagamentoInfo={pagamentoInfo}
          onVoltar={redirecionarParaMatriculas}
          onNova={criarNovaMatricula}
        />
      )}
    </div>
  );
};

export default NovaMatriculaForm;
