
import React from "react";
import { User } from "lucide-react";
import AlunoCard from "./AlunoCard";

interface AlunosListProps {
  alunos: any[];
  selecionado: string | null;
  onSelecionar: (aluno: any) => void;
  loading: boolean;
}

const AlunosList: React.FC<AlunosListProps> = ({ alunos, selecionado, onSelecionar, loading }) => {
  if (loading) {
    return null; // O componente de loading é tratado pelo componente pai
  }
  
  if (alunos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <User className="mx-auto h-12 w-12 opacity-20 mb-2" />
        <p>Nenhum aluno encontrado</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {alunos.map(aluno => (
        <AlunoCard 
          key={aluno.id}
          aluno={aluno}
          selecionado={selecionado === aluno.id}
          onSelecionar={onSelecionar}
        />
      ))}
    </div>
  );
};

export default AlunosList;
