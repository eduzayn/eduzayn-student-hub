
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, ArrowLeftCircle, XCircle, Loader2 } from "lucide-react";

interface MatriculaStep4Props {
  alunoSelecionado: any;
  cursoSelecionado: any;
  matriculaConfig: any;
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
  onNova
}) => {
  const pagamentoStatus = pagamentoInfo ? 
    (pagamentoInfo.status === 'error' ? 'erro' : 'sucesso') : 
    (matriculaConfig.com_pagamento ? 'pendente' : 'isento');
  
  const learnWorldsStatus = learnWorldsMatriculaInfo ? 
    (learnWorldsMatriculaInfo.simulatedResponse ? 'simulado' : 'sucesso') : 
    'pendente';
    
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'sucesso':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'erro':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pendente':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'isento':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'simulado':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <CheckCircle className="h-12 w-12 text-green-500 mr-3" />
        <h2 className="text-2xl font-bold">Matrícula Concluída</h2>
      </div>
      
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Detalhes da Matrícula</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Aluno</p>
              <p className="font-medium">{alunoSelecionado?.nome}</p>
              <p className="text-sm text-gray-600">{alunoSelecionado?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Curso</p>
              <p className="font-medium">{cursoSelecionado?.titulo || cursoSelecionado?.title}</p>
              <p className="text-sm text-gray-600">Código: {cursoSelecionado?.codigo || cursoSelecionado?.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Data de Início</p>
              <p>{matriculaConfig?.data_inicio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="capitalize">{matriculaConfig?.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Forma de Pagamento</p>
              <p className="capitalize">{matriculaConfig?.forma_pagamento}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Valor</p>
              <p>R$ {matriculaConfig?.valor_matricula.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-2">Status</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              {renderStatusIcon('sucesso')}
              <span className="ml-2">Matrícula criada no sistema local</span>
            </div>
            
            <div className="flex items-center">
              {renderStatusIcon(learnWorldsStatus)}
              <span className="ml-2">
                {learnWorldsStatus === 'sucesso' && 'Matrícula criada no LearnWorlds'}
                {learnWorldsStatus === 'simulado' && 'Matrícula simulada no LearnWorlds (modo offline)'}
                {learnWorldsStatus === 'pendente' && 'Aguardando confirmação do LearnWorlds'}
                {learnWorldsStatus === 'erro' && 'Erro ao criar matrícula no LearnWorlds'}
              </span>
            </div>
            
            {matriculaConfig.com_pagamento && (
              <div className="flex items-center">
                {renderStatusIcon(pagamentoStatus)}
                <span className="ml-2">
                  {pagamentoStatus === 'sucesso' && 'Link de pagamento gerado'}
                  {pagamentoStatus === 'pendente' && 'Aguardando geração do link de pagamento'}
                  {pagamentoStatus === 'erro' && 'Erro ao gerar link de pagamento'}
                  {pagamentoStatus === 'isento' && 'Matrícula isenta de pagamento'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {pagamentoInfo?.paymentUrl && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-2">Link de Pagamento</h3>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md mb-2">
              <a 
                href={pagamentoInfo.paymentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium break-all flex items-center"
              >
                {pagamentoInfo.paymentUrl}
                <span className="ml-1">↗</span>
              </a>
            </div>
            <p className="text-sm text-gray-500">Compartilhe este link com o aluno para efetuar o pagamento</p>
          </div>
        )}
        
        {learnWorldsMatriculaInfo && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-2">Informações da Matrícula no LearnWorlds</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500">ID da Matrícula</p>
                <p className="font-mono bg-gray-50 p-1 text-sm rounded">{learnWorldsMatriculaInfo.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="capitalize">{learnWorldsMatriculaInfo.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Data da Matrícula</p>
                <p>{new Date(learnWorldsMatriculaInfo.enrollmentDate).toLocaleString()}</p>
              </div>
              {learnWorldsMatriculaInfo.simulatedResponse && (
                <div className="bg-yellow-50 border border-yellow-100 rounded p-3 mt-2">
                  <p className="text-sm text-yellow-700">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Esta é uma matrícula simulada devido ao modo offline. Quando a conexão com o LearnWorlds for restaurada, 
                    a matrícula será sincronizada automaticamente.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onVoltar}>
          <ArrowLeftCircle className="h-4 w-4 mr-2" />
          Voltar para Matrículas
        </Button>
        <Button onClick={onNova}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Nova Matrícula
        </Button>
      </div>
    </div>
  );
};

export default MatriculaStep4;
