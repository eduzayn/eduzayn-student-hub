
import React from "react";
import CursoCard from "./CursoCard";
import CursosEmptyState from "./CursosEmptyState";
import CursosLoadingSkeleton from "./CursosLoadingSkeleton";

interface CursosListaProps {
  cursos: any[];
  selecionado: string | null;
  loading: boolean;
  onSelecionar: (curso: any) => void;
}

const CursosLista: React.FC<CursosListaProps> = ({ 
  cursos, 
  selecionado, 
  loading, 
  onSelecionar 
}) => {
  if (loading) {
    return <CursosLoadingSkeleton />;
  }

  if (cursos.length === 0) {
    return <CursosEmptyState />;
  }

  return (
    <div className="space-y-3">
      {cursos.map(curso => (
        <CursoCard 
          key={curso.id || curso.learning_worlds_id}
          curso={curso} 
          selecionado={selecionado === (curso.id || curso.learning_worlds_id)}
          onSelecionar={onSelecionar} 
        />
      ))}
    </div>
  );
};

export default CursosLista;
