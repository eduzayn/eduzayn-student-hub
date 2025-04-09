
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface AlunosFiltroProps {
  onSearch: (termo: string, status?: string) => void;
}

const AlunosFiltro: React.FC<AlunosFiltroProps> = ({ onSearch }) => {
  const [termo, setTermo] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [filtroAberto, setFiltroAberto] = useState(false);
  
  const handleSearch = () => {
    onSearch(termo, status);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Buscar por nome, e-mail ou CPF..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setFiltroAberto(!filtroAberto)}
          className="md:w-auto"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
        
        <Button onClick={handleSearch}>
          Buscar
        </Button>
      </div>
      
      {filtroAberto && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/20">
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2 flex items-end">
            <Button 
              variant="ghost" 
              onClick={() => {
                setTermo("");
                setStatus(undefined);
                onSearch("", undefined);
              }}
              className="self-end"
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlunosFiltro;
