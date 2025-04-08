
import React, { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface BuscaCursoProps {
  busca: string;
  setBusca: (value: string) => void;
  handleBusca: () => void;
  loading: boolean;
}

const BuscaCurso: React.FC<BuscaCursoProps> = ({ busca, setBusca, handleBusca, loading }) => {
  // Função para lidar com a tecla Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBusca();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar curso por nome ou código..."
          className="pl-8"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
      </div>
      <Button onClick={handleBusca} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Buscando...
          </>
        ) : (
          "Buscar"
        )}
      </Button>
    </div>
  );
};

export default BuscaCurso;
