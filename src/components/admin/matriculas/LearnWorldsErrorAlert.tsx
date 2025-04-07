
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LearnWorldsErrorAlertProps {
  errorMessage?: string;
  showLocalMatriculaNote?: boolean;
}

const LearnWorldsErrorAlert: React.FC<LearnWorldsErrorAlertProps> = ({ 
  errorMessage = "A API do LearnWorlds está offline ou indisponível no momento.",
  showLocalMatriculaNote = true
}) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertDescription>
        {errorMessage}
        {showLocalMatriculaNote && (
          <p className="text-xs mt-1">A matrícula será criada apenas no sistema local.</p>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default LearnWorldsErrorAlert;
