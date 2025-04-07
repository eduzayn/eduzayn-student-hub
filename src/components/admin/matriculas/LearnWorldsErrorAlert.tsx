
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LearnWorldsErrorAlertProps {
  errorMessage: string;
}

const LearnWorldsErrorAlert: React.FC<LearnWorldsErrorAlertProps> = ({ errorMessage }) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro na integração com LearnWorlds</AlertTitle>
      <AlertDescription>
        {errorMessage}
      </AlertDescription>
    </Alert>
  );
};

export default LearnWorldsErrorAlert;
