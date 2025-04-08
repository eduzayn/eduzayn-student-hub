
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OfflineModeIndicatorProps {
  message?: string;
}

const OfflineModeIndicator: React.FC<OfflineModeIndicatorProps> = ({ 
  message = "Modo offline ativado. Usando dados simulados." 
}) => {
  return (
    <Alert variant="warning" className="bg-yellow-50 border-yellow-300">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Modo Offline</AlertTitle>
      <AlertDescription className="text-yellow-700">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default OfflineModeIndicator;
