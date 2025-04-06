
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TipoDocumento } from "@/types/documentos";

interface TipoDocumentoCardProps {
  tipoDocumento: TipoDocumento;
  onUpload: (tipoDoc: TipoDocumento) => void;
}

const TipoDocumentoCard: React.FC<TipoDocumentoCardProps> = ({ 
  tipoDocumento, 
  onUpload 
}) => {
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
            {tipoDocumento.nome}
            {renderRequisitoInfo(tipoDocumento)}
          </CardTitle>
          {tipoDocumento.obrigatorio && (
            <Badge variant="destructive">Obrigatório</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tipoDocumento.descricao && (
            <p className="text-sm text-muted-foreground">{tipoDocumento.descricao}</p>
          )}
          <div className="text-sm text-muted-foreground">
            <p>Formatos aceitos: {tipoDocumento.formatosAceitos.join(", ")}</p>
            <p>Tamanho máximo: {(tipoDocumento.tamanhoMaximo / (1024 * 1024)).toFixed(2)}MB</p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              className="w-full" 
              onClick={() => onUpload(tipoDocumento)}
            >
              <FileUp className="h-5 w-5 mr-2" />
              Enviar Documento
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TipoDocumentoCard;
