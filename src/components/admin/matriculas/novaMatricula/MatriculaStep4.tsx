
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileCheck, GitCommitHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LinkPagamentoCard from "../LinkPagamentoCard";
import LearnWorldsStatusDetails from "../LearnWorldsStatusDetails";

interface MatriculaStep4Props {
  alunoSelecionado: any;
  cursoSelecionado: any;
  matriculaConfig: {
    data_inicio: string;
    valor_matricula: number;
    forma_pagamento: string;
    observacoes: string;
    com_pagamento: boolean;
    status: string;
  };
  pagamentoInfo: any;
  learnWorldsMatriculaInfo: any;
  onVoltar: () => void;
  onNova: () => void;
}

const MatriculaStep4: React.FC<MatriculaStep4Props> = ({
  alunoSelecionado,
  cursoSelecionado,
  matriculaConfig,
  pagamentoInfo,
  learnWorldsMatriculaInfo,
  onVoltar,
  onNova,
}) => {
  // Determinar status do LearnWorlds
  const learnWorldsStatus = getLearnWorldsStatus();
  
  function getLearnWorldsStatus(): 'sucesso' | 'pendente' | 'simulado' | 'erro' {
    if (!learnWorldsMatriculaInfo) {
      return 'pendente';
    }
    
    if (learnWorldsMatriculaInfo.simulatedResponse) {
      return 'simulado';
    }
    
    return 'sucesso';
  }
  
  // Determinar status do pagamento
  const pagamentoStatus = pagamentoInfo?.status || 'pendente';
  
  // Verificar se há um link de pagamento
  const temLinkPagamento = Boolean(pagamentoInfo?.link_pagamento);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Matrícula Concluída</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detalhes da matrícula */}
        <Card className="p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Detalhes da Matrícula</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Aluno</h4>
              <p>{alunoSelecionado?.nome || `${alunoSelecionado?.firstName} ${alunoSelecionado?.lastName}`}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Curso</h4>
              <p>{cursoSelecionado?.titulo || cursoSelecionado?.nome || cursoSelecionado?.title}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Data de Início</h4>
              <p>{matriculaConfig.data_inicio}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <div className="flex items-center">
                <span className={`h-2 w-2 rounded-full ${
                  matriculaConfig.status === 'ativo' ? 'bg-green-500' : 'bg-amber-500'
                } mr-2`}></span>
                <span>{matriculaConfig.status.charAt(0).toUpperCase() + matriculaConfig.status.slice(1)}</span>
              </div>
            </div>
            
            {matriculaConfig.observacoes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Observações</h4>
                <p className="text-sm">{matriculaConfig.observacoes}</p>
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <FileCheck className="h-4 w-4 mr-1" />
              <span>Matrícula registrada com sucesso</span>
            </div>
          </div>
        </Card>

        {/* Status da integração com LearnWorlds */}
        <Card className="p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Integração com LearnWorlds</h3>
          
          <LearnWorldsStatusDetails 
            status={learnWorldsStatus}
            matriculaInfo={learnWorldsMatriculaInfo}
            offlineMode={learnWorldsMatriculaInfo?.simulatedResponse}
          />
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <GitCommitHorizontal className="h-4 w-4 mr-1" />
              <span>Sincronização {learnWorldsStatus === 'erro' ? 'falhou' : 'concluída'}</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Link de pagamento se aplicável */}
      {matriculaConfig.com_pagamento && matriculaConfig.forma_pagamento !== 'isento' && (
        <div className="mt-6">
          <LinkPagamentoCard
            pagamentoInfo={pagamentoInfo}
            alunoNome={alunoSelecionado?.nome || `${alunoSelecionado?.firstName} ${alunoSelecionado?.lastName}`}
            cursoNome={cursoSelecionado?.titulo || cursoSelecionado?.nome || cursoSelecionado?.title}
            valor={matriculaConfig.valor_matricula}
            formaPagamento={matriculaConfig.forma_pagamento}
          />
        </div>
      )}
      
      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          variant="outline"
          onClick={onVoltar}
          className="sm:mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Lista de Matrículas
        </Button>
        
        <Button onClick={onNova}>
          Criar Nova Matrícula
        </Button>
      </div>
    </div>
  );
};

export default MatriculaStep4;
