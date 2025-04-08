
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LinkPagamentoCard from "../LinkPagamentoCard";

interface MatriculaStep4Props {
  alunoSelecionado: any;
  cursoSelecionado: any;
  matriculaConfig: any;
  pagamentoInfo: any;
  onVoltar: () => void;
  onNova: () => void;
}

const MatriculaStep4: React.FC<MatriculaStep4Props> = ({
  alunoSelecionado,
  cursoSelecionado,
  matriculaConfig,
  pagamentoInfo,
  onVoltar,
  onNova
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
            Matrícula Concluída com Sucesso!
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Aluno:</span>
              <span>{alunoSelecionado?.nome}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Curso:</span>
              <span>{cursoSelecionado?.titulo || cursoSelecionado?.nome}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Data Início:</span>
              <span>
                {matriculaConfig?.data_inicio ? 
                  format(new Date(matriculaConfig.data_inicio), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 
                  'Não definido'}
              </span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Forma de Pagamento:</span>
              <span className="capitalize">
                {!matriculaConfig?.com_pagamento ? 'Isento' : matriculaConfig?.forma_pagamento}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Valor:</span>
              <span className="font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(matriculaConfig?.valor_matricula || 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {matriculaConfig?.com_pagamento && pagamentoInfo?.link && (
        <LinkPagamentoCard
          link={pagamentoInfo.link}
          copiado={pagamentoInfo.copiado}
          enviado={pagamentoInfo.enviado}
          email={alunoSelecionado?.email}
          onCopiar={() => {}}
          onVoltar={onVoltar}
          onNova={onNova}
        />
      )}
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onVoltar}
        >
          Voltar para Matrículas
        </Button>
        
        <Button 
          onClick={onNova}
        >
          Criar Nova Matrícula
        </Button>
      </div>
    </div>
  );
};

export default MatriculaStep4;
