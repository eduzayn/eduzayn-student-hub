
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LearnWorldsErrorAlertProps {
  error?: string;
  retry?: () => void;
}

const LearnWorldsErrorAlert: React.FC<LearnWorldsErrorAlertProps> = ({
  error,
  retry
}) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro na API</AlertTitle>
        <AlertDescription>
          <p>{error}</p>
          {retry && (
            <button 
              onClick={retry}
              className="text-red-100 hover:text-white underline mt-2 text-sm">
              Tentar novamente
            </button>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default LearnWorldsErrorAlert;
