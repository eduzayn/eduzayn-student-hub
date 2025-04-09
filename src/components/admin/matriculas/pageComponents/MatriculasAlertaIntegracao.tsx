
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MatriculasAlertaIntegracao: React.FC = () => {
  return (
    <Alert variant="warning" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Integração em Desenvolvimento</AlertTitle>
      <AlertDescription>
        O módulo de matrículas está sendo reformulado. A integração com o LearnWorlds está em desenvolvimento.
      </AlertDescription>
    </Alert>
  );
};

export default MatriculasAlertaIntegracao;
