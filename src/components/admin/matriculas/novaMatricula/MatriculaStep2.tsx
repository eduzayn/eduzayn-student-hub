
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SelectCurso from "../SelectCurso";

interface MatriculaStep2Props {
  onCursoSelecionado: (curso: any) => void;
  alunoSelecionado: any;
  prevStep: () => void;
}

const MatriculaStep2: React.FC<MatriculaStep2Props> = ({
  onCursoSelecionado,
  alunoSelecionado,
  prevStep
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Aluno: {alunoSelecionado?.nome}
        </h3>
        <Button variant="outline" onClick={prevStep}>Voltar e trocar aluno</Button>
      </div>
      <Separator className="my-4" />
      <SelectCurso onCursoSelecionado={onCursoSelecionado} />
    </>
  );
};

export default MatriculaStep2;
