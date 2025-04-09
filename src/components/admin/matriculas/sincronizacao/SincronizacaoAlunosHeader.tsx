
import React from "react";

export interface SincronizacaoAlunosHeaderProps {
  title: string;
  subtitle?: string;
}

const SincronizacaoAlunosHeader: React.FC<SincronizacaoAlunosHeaderProps> = ({ 
  title, 
  subtitle = "Sincronize os alunos entre o LearnWorlds e o sistema de matrículas." 
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
};

export default SincronizacaoAlunosHeader;
