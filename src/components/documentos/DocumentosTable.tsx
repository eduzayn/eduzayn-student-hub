
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Info } from "lucide-react";
import { Documento, TipoDocumento } from "@/types/documentos";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DocumentosTableProps {
  tiposDocumentos: TipoDocumento[];
  documentosAluno: Documento[];
  tipoCurso: string;
  onUpload: (tipoDoc: TipoDocumento) => void;
  onView: (doc: Documento) => void;
  onReenviar: (doc: Documento) => void;
}

const DocumentosTable: React.FC<DocumentosTableProps> = ({
  tiposDocumentos,
  documentosAluno,
  tipoCurso,
  onUpload,
  onView,
  onReenviar
}) => {
  const tiposDocumentosApplicaveis = tiposDocumentos.filter(tipo => 
    !tipo.requisitoTipo || tipo.requisitoTipo.includes(tipoCurso as any)
  );

  const renderStatusBadge = (status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado') => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pendente</Badge>
        );
      case "em_analise":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Em Análise</Badge>
        );
      case "aprovado":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Aprovado</Badge>
        );
      case "rejeitado":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejeitado</Badge>
        );
      default:
        return null;
    }
  };

  const renderRequisitoInfo = (tipoDoc: TipoDocumento) => {
    if (!tipoDoc.requisitoTipo || tipoDoc.requisitoTipo.length === 0) {
      return null;
    }
    
    const reqFormatted = tipoDoc.requisitoTipo.map(req => {
      switch(req) {
        case 'graduacao': return 'Graduação';
        case 'posgraduacao': return 'Pós-Graduação';
        case 'segunda_graduacao': return 'Segunda Graduação';
        case 'segunda_licenciatura': return 'Segunda Licenciatura';
        case 'formacao_pedagogica': return 'Formação Pedagógica';
        case 'formacao_livre': return 'Formação Livre';
        default: return req;
      }
    }).join(', ');
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info size={16} className="text-muted-foreground ml-1" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Requisito para: {reqFormatted}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Documento</TableHead>
            <TableHead>Obrigatório</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Envio</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiposDocumentosApplicaveis.map((tipo) => {
            const docExistente = documentosAluno.find(d => d.tipoDocumentoId === tipo.id);
            
            return (
              <TableRow key={tipo.id}>
                <TableCell className="flex items-center">
                  {tipo.nome}
                  {renderRequisitoInfo(tipo)}
                </TableCell>
                <TableCell>{tipo.obrigatorio ? "Sim" : "Não"}</TableCell>
                <TableCell>
                  {docExistente ? renderStatusBadge(docExistente.status) : (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pendente</Badge>
                  )}
                </TableCell>
                <TableCell>{docExistente?.dataEnvio || "-"}</TableCell>
                <TableCell className="text-right">
                  {!docExistente ? (
                    <Button 
                      size="sm"
                      onClick={() => onUpload(tipo)}
                    >
                      Enviar
                    </Button>
                  ) : docExistente.status === "rejeitado" ? (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => onReenviar(docExistente)}
                    >
                      Reenviar
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onView(docExistente)}
                    >
                      Visualizar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentosTable;
