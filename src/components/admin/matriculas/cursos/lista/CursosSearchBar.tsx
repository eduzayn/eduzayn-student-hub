
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CursosSearchBarProps {
  filtro: string;
  setFiltro: (filtro: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const CursosSearchBar: React.FC<CursosSearchBarProps> = ({
  filtro,
  setFiltro,
  handleSearch,
  handleKeyPress
}) => {
  return (
    <div className="flex gap-2 mb-6">
      <Input
        placeholder="Buscar curso por título..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        onKeyDown={handleKeyPress}
        className="flex-1"
      />
      <Button onClick={handleSearch}>
        <Search className="h-4 w-4 mr-2" /> Buscar
      </Button>
    </div>
  );
};

export default CursosSearchBar;
