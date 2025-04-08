
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ConfiguracaoMatricula from "../ConfiguracaoMatricula";

interface MatriculaStep3Props {
  alunoSelecionado: any;
  cursoSelecionado: any;
  matriculaConfig: any;
  onChange: (config: any) => void;
  onProsseguir: () => Promise<void>;
  prevStep: () => void;
  isLoading: boolean;
}

const MatriculaStep3: React.FC<MatriculaStep3Props> = ({
  alunoSelecionado,
  cursoSelecionado,
  matriculaConfig,
  onChange,
  onProsseguir,
  prevStep,
  isLoading
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">
            Aluno: {alunoSelecionado?.nome}
          </h3>
          <h3 className="text-lg font-medium mt-1">
            Curso: {cursoSelecionado?.titulo || cursoSelecionado?.nome}
          </h3>
        </div>
        <Button variant="outline" onClick={prevStep}>Voltar e trocar curso</Button>
      </div>
      <Separator className="my-4" />
      
      <ConfiguracaoMatricula 
        config={matriculaConfig}
        onChange={onChange}
        valorCurso={cursoSelecionado?.valor_mensalidade || 0}
        onProsseguir={onProsseguir}
        isLoading={isLoading}
      />
    </>
  );
};

export default MatriculaStep3;
