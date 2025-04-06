
import React from "react";
import { AtendenteBadge } from "./AtendenteBadge";
import { AtendentesNenhum } from "./AtendentesNenhum";
import { SetorAtendimento } from "@/types/comunicacao";

export interface AtendentesOnline {
  id: string;
  nome: string;
  setor: SetorAtendimento;
  disponivel: boolean;
  ultimoStatus: string;
}

interface AtendentesOnlineGroupProps {
  atendentes: AtendentesOnline[];
  setor: SetorAtendimento;
}

export const AtendentesOnlineGroup: React.FC<AtendentesOnlineGroupProps> = ({ 
  atendentes, 
  setor 
}) => {
  const atendentesDisponiveis = atendentes.filter(a => a.setor === setor && a.disponivel);

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">
        {setor.charAt(0).toUpperCase() + setor.slice(1)}
      </h4>
      <div className="flex flex-wrap gap-2">
        {atendentesDisponiveis.length > 0 ? (
          atendentesDisponiveis.map(atendente => (
            <AtendenteBadge 
              key={atendente.id}
              nome={atendente.nome}
              setor={atendente.setor}
            />
          ))
        ) : (
          <AtendentesNenhum />
        )}
      </div>
    </div>
  );
};
