
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface BuscaCursoProps {
  busca: string;
  setBusca: (value: string) => void;
  handleBusca: () => void;
  loading: boolean;
}

const BuscaCurso: React.FC<BuscaCursoProps> = ({ 
  busca, 
  setBusca, 
  handleBusca, 
  loading 
}) => {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Buscar por título ou código..."
          className="pl-9"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBusca()}
        />
      </div>
      <Button onClick={handleBusca} disabled={loading}>
        {loading ? "Buscando..." : "Buscar"}
      </Button>
    </div>
  );
};

export default BuscaCurso;
