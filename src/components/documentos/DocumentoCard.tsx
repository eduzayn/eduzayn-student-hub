
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, FileUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Documento, TipoDocumento } from "@/types/documentos";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DocumentoCardProps {
  documento: Documento;
  onView: (doc: Documento) => void;
  onReenviar: (doc: Documento) => void;
}

const DocumentoCard: React.FC<DocumentoCardProps> = ({ 
  documento, 
  onView, 
  onReenviar 
}) => {
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            {documento.tipoDocumento.nome}
            {renderRequisitoInfo(documento.tipoDocumento)}
          </CardTitle>
          {renderStatusBadge(documento.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Data de Envio:</span>
              <span>{documento.dataEnvio || "-"}</span>
            </div>
            {documento.dataAnalise && (
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Data de Análise:</span>
                <span>{documento.dataAnalise}</span>
              </div>
            )}
          </div>
          
          {documento.motivoRejeicao && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
              <p className="font-medium">Motivo da rejeição:</p>
              <p>{documento.motivoRejeicao}</p>
            </div>
          )}
          
          <div className="flex justify-between gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onView(documento)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Visualizar
            </Button>
            
            {documento.status === "rejeitado" && (
              <Button 
                className="flex-1"
                onClick={() => onReenviar(documento)}
              >
                <FileUp className="h-4 w-4 mr-1" />
                Reenviar
              </Button>
            )}
            
            {documento.status === "aprovado" && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  toast.success("Download iniciado");
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentoCard;
