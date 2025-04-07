
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

interface AlunosFiltroProps {
  filtroStatus: string;
  setFiltroStatus: (status: string) => void;
}

const AlunosFiltro: React.FC<AlunosFiltroProps> = ({ 
  filtroStatus, 
  setFiltroStatus 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={filtroStatus} onValueChange={setFiltroStatus}>
          <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ativo">Ativos</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="trancado">Trancados</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="concluido">Concluídos</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="cancelado">Cancelados</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AlunosFiltro;
