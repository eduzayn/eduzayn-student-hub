
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MatriculasPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Módulo de Matrículas</h1>
      
      <Alert variant="warning" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Integração em Desenvolvimento</AlertTitle>
        <AlertDescription>
          O módulo de matrículas está sendo reformulado. A integração com o LearnWorlds está em desenvolvimento.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Módulo de Matrículas - Nova Versão</CardTitle>
          <CardDescription>
            O sistema de matrículas está sendo redesenhado para uma melhor experiência.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Estamos trabalhando em uma nova versão mais robusta e confiável 
            para o gerenciamento de matrículas. Em breve, novas funcionalidades 
            estarão disponíveis.
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <p className="text-blue-800 font-medium">Nota de desenvolvimento</p>
            <p className="text-blue-600 text-sm">
              Aguarde as próximas atualizações para ter acesso a todas as funcionalidades.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatriculasPage;
