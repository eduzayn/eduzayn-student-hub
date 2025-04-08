
import React from "react";
import DashboardCard from "./dashboard/DashboardCard";
import AlertasAcoes from "./dashboard/AlertasAcoes";
import GraficoMatriculas from "./dashboard/GraficoMatriculas";
import GraficoStatus from "./dashboard/GraficoStatus";
import BotoesAcaoRapida from "./dashboard/BotoesAcaoRapida";
import { 
  cardsData,
  matriculasData,
  statusData,
  pagamentosData
} from "./dashboard/DadosDashboard";

const MatriculasDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            trendDown={card.trendDown}
            description={card.description}
          />
        ))}
      </div>
      
      {/* Alertas e Ações */}
      <AlertasAcoes />
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico de Matrículas por Mês */}
        <GraficoMatriculas data={matriculasData} />
        
        {/* Gráficos de Status e Pagamentos */}
        <div className="space-y-4">
          {/* Status das Matrículas */}
          <GraficoStatus 
            data={statusData} 
            title="Status das Matrículas" 
          />
          
          {/* Status dos Pagamentos */}
          <GraficoStatus 
            data={pagamentosData} 
            title="Status dos Pagamentos" 
          />
        </div>
      </div>
      
      {/* Botões de Ação Rápida */}
      <BotoesAcaoRapida />
    </div>
  );
};

export default MatriculasDashboard;
