
import { useState } from "react";

export const useMatriculaFormSteps = () => {
  const [activeTab, setActiveTab] = useState("aluno");
  const [formStep, setFormStep] = useState(1);
  
  const nextStep = () => {
    setFormStep(prevStep => prevStep + 1);
  };
  
  const prevStep = () => {
    setFormStep(prevStep => Math.max(1, prevStep - 1));
  };
  
  const resetSteps = () => {
    setFormStep(1);
    setActiveTab("aluno");
  };
  
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
    voltarAba,
    formStep,
    nextStep,
    prevStep,
    resetSteps
  };
};
