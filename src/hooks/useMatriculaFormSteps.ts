
import { useState } from "react";

export const useMatriculaFormSteps = () => {
  const [activeTab, setActiveTab] = useState("aluno");
  
  const proximaAba = () => {
    if (activeTab === "aluno") setActiveTab("curso");
    else if (activeTab === "curso") setActiveTab("configuracao");
    else if (activeTab === "configuracao") setActiveTab("pagamento");
  };
  
  const voltarAba = () => {
    if (activeTab === "pagamento") setActiveTab("configuracao");
    else if (activeTab === "configuracao") setActiveTab("curso");
    else if (activeTab === "curso") setActiveTab("aluno");
  };
  
  return {
    activeTab,
    setActiveTab,
    proximaAba,
    voltarAba
  };
};
