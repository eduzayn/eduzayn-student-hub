
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Download, FileCheck, Clock, Ban, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Certificado, RequisitoCertificado, StatusCertificado } from "@/types/certificados";

interface CertificadoCardProps {
  certificado: Certificado;
  onVerificarRequisitos: (cursoId: string) => void;
  onSolicitarCertificado: (cursoId: string) => void;
  onDownloadCertificado: (certificadoId: string) => void;
  onDetalhes?: (certificado: Certificado) => void; // Adicionado o prop onDetalhes
}

const CertificadoCard: React.FC<CertificadoCardProps> = ({
  certificado,
  onVerificarRequisitos,
  onSolicitarCertificado,
  onDownloadCertificado,
  onDetalhes
}) => {
  // Função para renderizar o status do certificado
  const renderStatus = (status: StatusCertificado) => {
    switch (status) {
      case "disponivel":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            <FileCheck className="h-3 w-3 mr-1" /> Disponível para solicitação
          </Badge>
        );
      case "indisponivel":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            <Ban className="h-3 w-3 mr-1" /> Indisponível
          </Badge>
        );
      case "em_processamento":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" /> Em processamento
          </Badge>
        );
      case "gerado":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Download className="h-3 w-3 mr-1" /> Disponível para download
          </Badge>
        );
      default:
        return null;
    }
  };

  // Verifica se todos os requisitos foram cumpridos
  const todosRequisitosCumpridos = certificado.requisitos.every(req => req.cumprido);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{certificado.cursoNome}</CardTitle>
          {renderStatus(certificado.status)}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <CalendarCheck className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Início: {new Date(certificado.dataInicio).toLocaleDateString('pt-BR')}</span>
          </div>
          {certificado.dataFim && (
            <div className="flex items-center text-sm">
              <CalendarCheck className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Término: {new Date(certificado.dataFim).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Carga horária: {certificado.cargaHoraria}h</span>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Requisitos para certificação:</h4>
            <ul className="space-y-1">
              {certificado.requisitos.map((req) => (
                <RequisitoCertificadoItem key={req.id} requisito={req} />
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        {certificado.status === "gerado" ? (
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => onDownloadCertificado(certificado.id)}
          >
            <Download className="h-4 w-4 mr-2" /> Baixar Certificado
          </Button>
        ) : certificado.status === "disponivel" ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => onDetalhes && onDetalhes(certificado)}
            >
              Ver Detalhes
            </Button>
            <Button 
              variant="default"
              onClick={() => onSolicitarCertificado(certificado.cursoId)}
              disabled={!todosRequisitosCumpridos}
            >
              <FileCheck className="h-4 w-4 mr-2" /> 
              Solicitar
            </Button>
          </div>
        ) : certificado.status === "em_processamento" ? (
          <Button 
            variant="outline" 
            className="w-full" 
            disabled
          >
            <Clock className="h-4 w-4 mr-2" /> 
            Processando Certificado
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onVerificarRequisitos(certificado.cursoId)}
          >
            <AlertTriangle className="h-4 w-4 mr-2" /> 
            Verificar Requisitos
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Componente para mostrar um requisito individual
const RequisitoCertificadoItem: React.FC<{ requisito: RequisitoCertificado }> = ({ requisito }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <li className="flex items-center text-sm">
            {requisito.cumprido ? (
              <span className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <FileCheck className="h-3 w-3 text-green-600" />
              </span>
            ) : (
              <span className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                <AlertTriangle className="h-3 w-3 text-red-600" />
              </span>
            )}
            <span className={requisito.cumprido ? "text-green-700" : "text-red-700"}>
              {requisito.descricao}
            </span>
          </li>
        </TooltipTrigger>
        {requisito.detalhe && (
          <TooltipContent>
            <p>{requisito.detalhe}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default CertificadoCard;
