
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import MatriculasDashboard from "@/components/admin/matriculas/MatriculasDashboard";
import MatriculasList from "@/components/admin/matriculas/MatriculasList";
import MatriculasContratos from "@/components/admin/matriculas/MatriculasContratos";

const ModuloMatriculas: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Módulo de Matrículas</h1>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3 gap-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="matriculas">Matrículas</TabsTrigger>
            <TabsTrigger value="contratos">Contratos</TabsTrigger>
          </TabsList>
          
          <Card className="mt-4 p-6">
            <TabsContent value="dashboard" className="space-y-4">
              <MatriculasDashboard />
            </TabsContent>
            
            <TabsContent value="matriculas" className="space-y-4">
              <MatriculasList />
            </TabsContent>
            
            <TabsContent value="contratos" className="space-y-4">
              <MatriculasContratos />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </MatriculasLayout>
  );
};

export default ModuloMatriculas;
