
import React, { useState, useEffect } from "react";
import { 
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Curso } from "@/types/matricula";

// Componentes refatorados
import CursosHeader from "./lista/CursosHeader";
import CursosSearchBar from "./lista/CursosSearchBar";
import CursosTable from "./lista/CursosTable";
import CursosPagination from "./lista/CursosPagination";

interface CursosListProps {
  onCursoSelect: (cursoId: string) => void;
}

const CursosList: React.FC<CursosListProps> = ({ onCursoSelect }) => {
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filtro, setFiltro] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limitPorPagina = 10;

  useEffect(() => {
    carregarCursos();
  }, [page]);

  const carregarCursos = async () => {
    setLoading(true);
    try {
      // Buscar total para paginação
      const { count, error: countError } = await supabase
        .from('cursos')
        .select('*', { count: 'exact', head: true })
        .ilike('titulo', `%${filtro}%`);

      if (countError) throw countError;
      
      // Calcular total de páginas
      if (count) {
        setTotalPages(Math.ceil(count / limitPorPagina));
      }

      // Buscar cursos para a página atual
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .ilike('titulo', `%${filtro}%`)
        .order('titulo', { ascending: true })
        .range((page - 1) * limitPorPagina, page * limitPorPagina - 1);

      if (error) throw error;
      
      setCursos(data || []);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      toast.error("Falha ao carregar cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1); // Voltar para primeira página ao filtrar
    carregarCursos();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CursosHeader onRefresh={carregarCursos} />
      </CardHeader>
      <CardContent>
        <CursosSearchBar 
          filtro={filtro} 
          setFiltro={setFiltro}
          handleSearch={handleSearch}
          handleKeyPress={handleKeyPress}
        />

        <CursosTable
          loading={loading}
          cursos={cursos}
          onCursoSelect={onCursoSelect}
        />

        <CursosPagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </CardContent>
    </Card>
  );
};

export default CursosList;
