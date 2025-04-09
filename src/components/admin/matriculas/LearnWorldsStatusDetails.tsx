
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface LearnWorldsStatusDetailsProps {
  status: 'sucesso' | 'pendente' | 'simulado' | 'erro';
  matriculaInfo?: any;
  offlineMode?: boolean;
}

const LearnWorldsStatusDetails: React.FC<LearnWorldsStatusDetailsProps> = ({
  status,
  matriculaInfo,
  offlineMode
}) => {
  if (status === 'sucesso') {
    return (
      <div className="space-y-4">
        <Alert variant="default" className="bg-green-50 border-green-300">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Matrícula Concluída</AlertTitle>
          <AlertDescription className="text-green-700">
            A matrícula no LearnWorlds foi realizada com sucesso.
          </AlertDescription>
        </Alert>
        
        {matriculaInfo && (
          <div className="text-sm space-y-2">
            <p><span className="font-medium">ID da Matrícula:</span> {matriculaInfo.id}</p>
            <p><span className="font-medium">Status:</span> {matriculaInfo.status || 'Ativo'}</p>
            <p><span className="font-medium">Data:</span> {new Date().toLocaleDateString()}</p>
          </div>
        )}
      </div>
    );
  }
  
  if (status === 'simulado') {
    return (
      <div className="space-y-4">
        <Alert variant="default" className="bg-blue-50 border-blue-300">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Matrícula Simulada</AlertTitle>
          <AlertDescription className="text-blue-700">
            Modo de simulação. A matrícula real no LearnWorlds não foi realizada pois o sistema está em manutenção.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (status === 'erro') {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro na Integração</AlertTitle>
          <AlertDescription>
            Não foi possível efetuar a matrícula no LearnWorlds. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Matrícula Pendente</AlertTitle>
        <AlertDescription>
          A sincronização com o LearnWorlds está pendente.
          {offlineMode && " O sistema está operando em modo offline devido à reformulação da integração."}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LearnWorldsStatusDetails;
