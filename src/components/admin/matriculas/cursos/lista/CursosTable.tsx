
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileEdit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Curso } from "@/types/matricula";

interface CursosTableProps {
  loading: boolean;
  cursos: Curso[];
  onCursoSelect: (cursoId: string) => void;
}

const CursosTable: React.FC<CursosTableProps> = ({ loading, cursos, onCursoSelect }) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Modalidade</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cursos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhum curso encontrado
              </TableCell>
            </TableRow>
          ) : (
            cursos.map((curso) => (
              <TableRow key={curso.id}>
                <TableCell className="font-medium">{curso.titulo}</TableCell>
                <TableCell>{curso.codigo}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {curso.modalidade || 'EAD'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(curso.valor_total || 0)}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onCursoSelect(curso.id)}
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CursosTable;
