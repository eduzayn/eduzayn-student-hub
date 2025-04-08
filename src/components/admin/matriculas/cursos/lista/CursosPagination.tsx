
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface CursosPaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const CursosPagination: React.FC<CursosPaginationProps> = ({
  page,
  totalPages,
  setPage
}) => {
  if (totalPages <= 1) {
    return null;
  }

  // Função para gerar os números de página a serem exibidos
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Se o total de páginas for menor que o máximo visível, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostra a primeira página
      pages.push(1);
      
      // Decide quais páginas do meio mostrar
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(startPage + 2, totalPages - 1);
      
      // Ajusta se estamos perto do início
      if (page <= 3) {
        startPage = 2;
        endPage = Math.min(4, totalPages - 1);
      }
      
      // Ajusta se estamos perto do final
      if (page >= totalPages - 2) {
        endPage = totalPages - 1;
        startPage = Math.max(2, endPage - 2);
      }
      
      // Adiciona elipses se necessário
      if (startPage > 2) {
        pages.push("...");
      }
      
      // Adiciona as páginas do meio
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Adiciona elipses se necessário
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      
      // Sempre mostra a última página
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Números de página a serem exibidos
  const pageNumbers = getPageNumbers();

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            aria-disabled={page === 1}
          />
        </PaginationItem>
        
        {pageNumbers.map((pageNumber, index) => (
          <PaginationItem key={index}>
            {pageNumber === "..." ? (
              <span className="px-4 py-2">...</span>
            ) : (
              <PaginationLink
                isActive={pageNumber === page}
                onClick={() => typeof pageNumber === 'number' && setPage(pageNumber)}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            aria-disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CursosPagination;
