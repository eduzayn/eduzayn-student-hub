
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AlunoSelection from "../aluno-selection/AlunoSelection";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface MatriculaStep1Props {
  onAlunoSelecionado: (aluno: any) => void;
  alunoSelecionado: any;
  prevStep?: () => void;
}

const MatriculaStep1: React.FC<MatriculaStep1Props> = ({
  onAlunoSelecionado,
  alunoSelecionado,
  prevStep
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        {prevStep && (
          <Button variant="ghost" size="sm" onClick={prevStep}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
        )}
        <h2 className="text-2xl font-bold">Passo 1: Selecionar Aluno</h2>
      </div>

      <AlunoSelection onAlunoSelecionado={onAlunoSelecionado} />
    </div>
  );
};

export default MatriculaStep1;
