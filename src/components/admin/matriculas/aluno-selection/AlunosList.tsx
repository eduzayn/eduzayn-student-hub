
import React from "react";
import { User } from "lucide-react";
import AlunoCard from "./AlunoCard";
import { Aluno } from "./types";

interface AlunosListProps {
  alunos: Aluno[];
  selecionado: string | null;
  onSelecionar: (aluno: Aluno) => void;
  loading: boolean;
  offlineMode?: boolean;
}

const AlunosList: React.FC<AlunosListProps> = ({ alunos, selecionado, onSelecionar, loading, offlineMode }) => {
  if (loading) {
    return null; // O componente de loading é tratado pelo componente pai
  }
  
  // Filtrar apenas alunos válidos
  const alunosExibir = alunos.filter(aluno => 
    // Aluno precisa ter email ou nome para ser exibido
    aluno.email || aluno.nome
  );
  
  if (alunosExibir.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <User className="mx-auto h-12 w-12 opacity-20 mb-2" />
        <p>Nenhum aluno encontrado</p>
        <p className="text-xs mt-1">Verifique os critérios de busca ou cadastre um novo aluno</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {alunosExibir.map(aluno => (
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
