
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DataTableProps {
  columns: {
    accessorKey: string;
    header: string;
    cell?: (props: { row: { getValue: (key: string) => any } }) => React.ReactNode;
  }[];
  data: any[];
  pageSize?: number;
}

export function DataTable({ columns, data, pageSize = 10 }: DataTableProps) {
  const [page, setPage] = React.useState(0);
  const totalPages = Math.ceil(data.length / pageSize);
  
  const startIndex = page * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const paginatedData = data.slice(startIndex, endIndex);
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column.accessorKey}`}>
                      {column.cell 
                        ? column.cell({ row: { getValue: (key: string) => row[key] } })
                        : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <div className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(0)}
              disabled={page === 0}
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={page === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages - 1)}
              disabled={page === totalPages - 1}
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
