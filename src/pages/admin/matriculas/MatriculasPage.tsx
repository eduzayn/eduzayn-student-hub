
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Importando os componentes refatorados
import MatriculasPageHeader from "@/components/admin/matriculas/pageComponents/MatriculasPageHeader";
import MatriculasAlertaIntegracao from "@/components/admin/matriculas/pageComponents/MatriculasAlertaIntegracao";
import TabVisaoGeral from "@/components/admin/matriculas/pageComponents/TabVisaoGeral";
import TabRecursos from "@/components/admin/matriculas/pageComponents/TabRecursos";
import TabConfiguracao from "@/components/admin/matriculas/pageComponents/TabConfiguracao";

const MatriculasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("visao-geral");
  const navigate = useNavigate();

  // Funções para navegar para outras páginas
  const irParaNovaMatricula = () => navigate("/admin/matriculas/nova");
  const irParaCursos = () => navigate("/admin/matriculas/cursos");
  const irParaAlunos = () => navigate("/admin/matriculas/alunos");
  const irParaConfiguracoes = () => navigate("/admin/matriculas/configuracoes");

  // Função para lidar com botões ainda não implementados
  const handleConfigurarClick = (tipo: string) => {
    if (tipo === "LearnWorlds" || tipo === "e-mail" || tipo === "gerais") {
      navigate("/admin/matriculas/configuracoes");
    } else {
      toast.info(`Configurações de ${tipo} serão implementadas em breve`, {
        duration: 3000,
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <MatriculasPageHeader irParaNovaMatricula={irParaNovaMatricula} />
      
      <MatriculasAlertaIntegracao />
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="configuracao">Configuração</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visao-geral">
          <TabVisaoGeral />
        </TabsContent>
        
        <TabsContent value="recursos">
          <TabRecursos />
        </TabsContent>
        
        <TabsContent value="configuracao">
          <TabConfiguracao handleConfigurarClick={handleConfigurarClick} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatriculasPage;
