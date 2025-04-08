
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Code, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LearnWorldsStatusDetailsProps {
  schoolId: string;
  offlineMode: boolean;
  error: string | null;
}

const LearnWorldsStatusDetails: React.FC<LearnWorldsStatusDetailsProps> = ({ schoolId, offlineMode, error }) => {
  return (
    <div className="space-y-4">
      <Alert className={offlineMode ? "border-amber-500 bg-amber-50" : "border-green-500 bg-green-50"}>
        <AlertTriangle className={`h-4 w-4 ${offlineMode ? "text-amber-500" : "text-green-500"}`} />
        <AlertTitle>Status da Integração com LearnWorlds</AlertTitle>
        <AlertDescription>
          <div className="text-sm space-y-2 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Status:</span>
                <span className={offlineMode ? "text-amber-600" : "text-green-600"}>
                  {offlineMode ? "Offline" : "Online"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">School ID:</span>
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{schoolId}</code>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Método de autenticação:</span>
                <span className="text-blue-600 flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  API Key
                </span>
              </div>
            </div>
            
            {error && (
              <div className="mt-2">
                <div className="font-semibold text-red-600">Erro:</div>
                <div className="bg-gray-100 p-2 rounded text-sm font-mono overflow-auto max-h-32">
                  {error}
                </div>
              </div>
            )}
            
            <div className="mt-3 text-xs flex flex-col space-y-2">
              <p className="font-medium">Recomendações se estiver tendo problemas:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verifique se a função edge do Supabase está ativa e configurada corretamente</li>
                <li>Confirme que o School ID "{schoolId}" está correto (deve corresponder ao subdomínio da sua escola)</li>
                <li>Verifique se a API Key do LearnWorlds está configurada corretamente nas variáveis de ambiente</li>
              </ul>
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs" 
                  onClick={() => window.open('https://bioarzkfmcobctblzztm.supabase.co/functions/learnworlds-sync/logs', '_blank')}
                >
                  <Code className="h-3 w-3 mr-1" />
                  Logs da função edge
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LearnWorldsStatusDetails;
