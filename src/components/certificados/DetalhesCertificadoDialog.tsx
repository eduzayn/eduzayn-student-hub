
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Certificado, Disciplina, Pagamento } from "@/types/certificados";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Check, AlertTriangle, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DetalhesCertificadoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificado: Certificado | null;
  disciplinas: Disciplina[];
  pagamentos: Pagamento[];
  tempoDecorrido: {
    meses: number;
    porcentagem: number;
  };
  onSolicitarCertificado?: (cursoId: string) => void;
  onDownloadCertificado?: (certificadoId: string) => void;
}

const DetalhesCertificadoDialog: React.FC<DetalhesCertificadoDialogProps> = ({
  open,
  onOpenChange,
  certificado,
  disciplinas,
  pagamentos,
  tempoDecorrido,
  onSolicitarCertificado,
  onDownloadCertificado
}) => {
  if (!certificado) return null;
  
  // Calcular o progresso acadêmico
  const disciplinasConcluidas = disciplinas.filter(d => d.concluida && d.nota >= 70).length;
  const totalDisciplinas = disciplinas.length;
  const progressoAcademico = totalDisciplinas > 0 
    ? Math.floor((disciplinasConcluidas / totalDisciplinas) * 100)
    : 0;
  
  // Verificar situação financeira
  const pagamentosPendentes = pagamentos.filter(p => p.status !== 'pago').length;
  const situacaoFinanceira = pagamentosPendentes === 0;
  
  // Verificar tempo mínimo (18 meses)
  const tempoMinimoCumprido = tempoDecorrido.meses >= 18;
  
  // Todos os requisitos atendem para geração de certificado
  const certificacaoDisponivel = 
    progressoAcademico === 100 && 
    situacaoFinanceira && 
    tempoMinimoCumprido;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Certificado</DialogTitle>
          <DialogDescription>
            Confira os requisitos para emissão do seu certificado do curso {certificado.cursoNome}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Informações do curso */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Informações do Curso</h4>
            <div className="bg-muted/40 p-3 rounded-md space-y-2">
              <div className="flex items-center text-sm">
                <CalendarCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Início: {new Date(certificado.dataInicio).toLocaleDateString('pt-BR')}</span>
              </div>
              {certificado.dataFim && (
                <div className="flex items-center text-sm">
                  <CalendarCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Término: {new Date(certificado.dataFim).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <span className="mr-2 text-muted-foreground">•</span>
                <span>Carga horária: {certificado.cargaHoraria}h</span>
              </div>
            </div>
          </div>
          
          {/* Situação acadêmica */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Situação Acadêmica</h4>
            <div className="bg-muted/40 p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Progresso: {progressoAcademico}%</span>
                <span className="text-sm">{disciplinasConcluidas} de {totalDisciplinas} disciplinas</span>
              </div>
              <Progress value={progressoAcademico} className="h-2" />
              
              <div className="mt-4 space-y-1">
                {disciplinas.map(disciplina => (
                  <div key={disciplina.id} className="flex justify-between text-sm">
                    <div className="flex items-center">
                      {disciplina.concluida && disciplina.nota >= 70 ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                      )}
                      <span>{disciplina.nome}</span>
                    </div>
                    <span className={disciplina.nota >= 70 ? "text-green-600" : "text-red-600"}>
                      {disciplina.nota}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Situação Financeira */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Situação Financeira</h4>
            <div className="bg-muted/40 p-3 rounded-md">
              <div className="flex items-center mb-3">
                {situacaoFinanceira ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                )}
                <span className={situacaoFinanceira ? "text-green-700" : "text-amber-700"}>
                  {situacaoFinanceira 
                    ? "Todas as mensalidades quitadas" 
                    : `${pagamentosPendentes} mensalidades pendentes`}
                </span>
              </div>
              
              {!situacaoFinanceira && (
                <div className="space-y-1">
                  {pagamentos
                    .filter(p => p.status !== 'pago')
                    .map(pagamento => (
                      <div key={pagamento.id} className="flex justify-between text-sm">
                        <span>Parcela {pagamento.numero}</span>
                        <span className="text-red-600">
                          {pagamento.valor.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Tempo de Curso */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tempo de Curso</h4>
            <div className="bg-muted/40 p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">
                  {tempoDecorrido.meses} meses decorridos (mínimo: 18 meses)
                </span>
                <span className="text-sm">
                  {Math.min(tempoDecorrido.porcentagem, 100)}%
                </span>
              </div>
              <Progress value={Math.min(tempoDecorrido.porcentagem, 100)} className="h-2" />
              
              <div className="mt-4 flex items-center">
                {tempoMinimoCumprido ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                )}
                <span className={tempoMinimoCumprido ? "text-green-700" : "text-amber-700"}>
                  {tempoMinimoCumprido 
                    ? "Tempo mínimo de curso atingido" 
                    : `Faltam ${18 - tempoDecorrido.meses} meses para o tempo mínimo`}
                </span>
              </div>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            
            {certificado.status === "gerado" && onDownloadCertificado ? (
              <Button 
                variant="default" 
                onClick={() => onDownloadCertificado(certificado.id)}
              >
                <Download className="h-4 w-4 mr-2" /> Baixar Certificado
              </Button>
            ) : certificacaoDisponivel && certificado.status === "disponivel" && onSolicitarCertificado ? (
              <Button 
                variant="default" 
                onClick={() => {
                  onSolicitarCertificado(certificado.cursoId);
                  onOpenChange(false);
                }}
              >
                Solicitar Certificado
              </Button>
            ) : (
              <Button 
                variant="default" 
                disabled={!certificacaoDisponivel}
              >
                {certificado.status === "em_processamento" 
                  ? "Certificado em processamento" 
                  : "Solicitar Certificado"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesCertificadoDialog;
