
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import ModuloItem from "./ModuloItem";

interface Aula {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: string;
  duracao: number;
  ordem: number;
  url: string | null;
}

interface Modulo {
  id: string;
  titulo: string;
  descricao: string | null;
  ordem: number;
  aulas: Aula[];
}

interface ModulosListaProps {
  modulos: Modulo[];
  formatarDuracao: (minutos: number) => string;
}

const ModulosLista: React.FC<ModulosListaProps> = ({ modulos, formatarDuracao }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {modulos.map((modulo) => (
        <ModuloItem 
          key={modulo.id} 
          modulo={modulo} 
          formatarDuracao={formatarDuracao}
        />
      ))}
    </Accordion>
  );
};

export default ModulosLista;
