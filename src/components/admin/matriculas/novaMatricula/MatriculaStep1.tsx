
import React from "react";
import SelectAluno from "../SelectAluno";
import { Button } from "@/components/ui/button";

interface MatriculaStep1Props {
  onAlunoSelecionado: (aluno: any) => void;
  alunoSelecionado: any;
  prevStep: () => void;
}

const MatriculaStep1: React.FC<MatriculaStep1Props> = ({ 
  onAlunoSelecionado
}) => {
  return <SelectAluno onAlunoSelecionado={onAlunoSelecionado} />;
};

export default MatriculaStep1;
