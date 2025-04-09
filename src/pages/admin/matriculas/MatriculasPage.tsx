
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MatriculasPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Módulo de Matrículas</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
          <CardDescription>
            O módulo de matrículas está sendo reformulado para melhorar a integração com LearnWorlds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Estamos trabalhando em uma nova versão mais robusta e confiável 
            para o gerenciamento de matrículas. Em breve, novas funcionalidades 
            estarão disponíveis.
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <p className="text-blue-800 font-medium">Nota de desenvolvimento</p>
            <p className="text-blue-600 text-sm">
              A integração com LearnWorlds está sendo replanejada para oferecer 
              uma experiência mais consistente e confiável.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatriculasPage;
