
import React from 'react';
import { Card } from "@/components/ui/card";

interface CursosListProps {
  onCursoSelect: (cursoId: string) => void;
}

const CursosList: React.FC<CursosListProps> = ({ onCursoSelect }) => {
  // Dados simulados de cursos
  const cursos = [
    { id: '1', nome: 'Introdução à Programação', modalidade: 'EAD', alunos: 56 },
    { id: '2', nome: 'Marketing Digital', modalidade: 'EAD', alunos: 42 },
    { id: '3', nome: 'Design Gráfico', modalidade: 'EAD', alunos: 28 },
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        Mostrando {cursos.length} cursos
      </div>

      <div className="space-y-3">
        {cursos.map(curso => (
          <Card 
            key={curso.id}
            className="p-4 hover:bg-slate-50 cursor-pointer"
            onClick={() => onCursoSelect(curso.id)}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="font-medium">{curso.nome}</h3>
                <p className="text-sm text-muted-foreground">Modalidade: {curso.modalidade}</p>
              </div>
              <div className="text-sm flex items-center gap-4">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {curso.alunos} alunos
                </span>
                <span className="text-primary text-xs font-medium">Ver detalhes →</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CursosList;
