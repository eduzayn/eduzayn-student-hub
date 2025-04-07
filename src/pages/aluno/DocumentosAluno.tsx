
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContratosAluno from "@/components/aluno/documentos/ContratosAluno";

const DocumentosAluno: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Documentos</h1>
      
      <Tabs defaultValue="contratos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="documentos_academicos">Documentos Acadêmicos</TabsTrigger>
          <TabsTrigger value="documentos_pessoais">Documentos Pessoais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contratos">
          <ContratosAluno />
        </TabsContent>
        
        <TabsContent value="documentos_academicos">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Acadêmicos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nesta seção você pode acessar seus documentos acadêmicos como históricos, 
                declarações e certificados.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentos_pessoais">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aqui você pode enviar e gerenciar seus documentos pessoais como RG, CPF
                e comprovante de endereço.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentosAluno;
