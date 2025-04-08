
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

interface OfflineModeIndicatorProps {
  message?: string;
}

/**
 * Componente para exibir um indicador de modo offline 
 * quando a API do LearnWorlds não está disponível
 */
const OfflineModeIndicator: React.FC<OfflineModeIndicatorProps> = ({
  message = "Operando em modo offline. Alguns recursos podem estar limitados."
}) => {
  return (
    <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-4">
      <WifiOff className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 text-sm font-medium">Modo Offline Ativado</AlertTitle>
      <AlertDescription className="text-amber-700 text-xs">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default OfflineModeIndicator;
