
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

export interface AlunosFiltroProps {
  filtroStatus: string;
  setFiltroStatus: (value: string) => void;
}

const AlunosFiltro: React.FC<AlunosFiltroProps> = ({ filtroStatus, setFiltroStatus }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Status: {filtroStatus === "todos" ? "Todos" : filtroStatus}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuRadioGroup value={filtroStatus} onValueChange={setFiltroStatus}>
          <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ativo">Ativo</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="inativo">Inativo</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pendente">Pendente</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="trancado">Trancado</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="concluido">Concluído</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AlunosFiltro;
