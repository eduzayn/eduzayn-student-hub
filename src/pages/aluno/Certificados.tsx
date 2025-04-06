import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CertificadoCard from "@/components/certificados/CertificadoCard";
import DetalhesCertificadoDialog from "@/components/certificados/DetalhesCertificadoDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSkeleton from "@/components/certificados/LoadingSkeleton";
import ErrorDisplay from "@/components/certificados/ErrorDisplay";
import CertificadosGrid from "@/components/certificados/CertificadosGrid";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Certificado, 
  RequisitoCertificado, 
  StatusCertificado,
  CertificadoResponse
} from "@/types/certificados";

const Certificados = () => {
  const { toast } = useToast();
  const [certificadoSelecionado, setCertificadoSelecionado] = useState<Certificado | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState<'todos' | StatusCertificado>('todos');

  const { data: matriculas, isLoading: isLoadingMatriculas, error: matriculasError } = useQuery({
    queryKey: ['matriculas-aluno'],
    queryFn: async () => {
      const alunoId = "aluno-id";
      return [
        {
          id: "1",
          aluno_id: alunoId,
          curso_id: "curso-1",
          data_inicio: new Date('2023-01-15').toISOString(),
          status: "ativo",
          curso: {
            titulo: "MBA em Gestão de Projetos",
            carga_horaria: 420
          }
        },
        {
          id: "2",
          aluno_id: alunoId,
          curso_id: "curso-2",
          data_inicio: new Date('2022-08-10').toISOString(),
          data_conclusao: new Date('2024-02-15').toISOString(),
          status: "formado",
          curso: {
            titulo: "Especialização em Marketing Digital",
            carga_horaria: 380
          }
        }
      ];
    }
  });

  const { data: certificados, isLoading: isLoadingCertificados, error: certificadosError, refetch: refetchCertificados } = useQuery({
    queryKey: ['certificados'],
    queryFn: async () => {
      const certificadosMock: CertificadoResponse[] = [
        {
          id: "cert-1",
          cursoId: "curso-2",
          cursoNome: "Especialização em Marketing Digital",
          dataInicio: new Date('2022-08-10').toISOString(),
          dataFim: new Date('2024-02-15').toISOString(),
          cargaHoraria: 380,
          dataEmissao: new Date('2024-03-01').toISOString(),
          status: "gerado",
          pdfUrl: "https://exemplo.com/certificado.pdf",
          requisitos: [
            { id: "req-1", descricao: "Mínimo de 70% em cada disciplina", cumprido: true },
            { id: "req-2", descricao: "Todas as parcelas pagas", cumprido: true },
            { id: "req-3", descricao: "Tempo mínimo de curso (18 meses)", cumprido: true }
          ]
        }
      ];
      
      return certificadosMock.map(cert => ({
        ...cert,
        status: cert.status as StatusCertificado
      })) as Certificado[];
    },
    enabled: !isLoadingMatriculas && !!matriculas
  });

  const { data: requisitos, isLoading: isLoadingRequisitos } = useQuery({
    queryKey: ['requisitos-certificado'],
    queryFn: async () => {
      const requisitosMock = {
        "curso-1": [
          { 
            id: "req-notas-1", 
            descricao: "Mínimo de 70% em cada disciplina", 
            cumprido: true 
          },
          { 
            id: "req-pagto-1", 
            descricao: "Todas as parcelas pagas", 
            cumprido: false,
            detalhe: "Parcelas 10, 11 e 12 pendentes"
          },
          { 
            id: "req-tempo-1", 
            descricao: "Tempo mínimo de curso (18 meses)", 
            cumprido: false,
            detalhe: "Cursado: 15 meses (faltam 3 meses)"
          }
        ],
        "curso-2": [
          { 
            id: "req-notas-2", 
            descricao: "Mínimo de 70% em cada disciplina", 
            cumprido: true 
          },
          { 
            id: "req-pagto-2", 
            descricao: "Todas as parcelas pagas", 
            cumprido: true 
          },
          { 
            id: "req-tempo-2", 
            descricao: "Tempo mínimo de curso (18 meses)", 
            cumprido: true 
          }
        ]
      };
      
      return requisitosMock;
    },
    enabled: !isLoadingMatriculas && !!matriculas
  });

  const solicitarCertificado = useMutation({
    mutationFn: async (cursoId: string) => {
      return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1500));
    },
    onSuccess: () => {
      toast({
        title: "Solicitação realizada com sucesso",
        description: "Seu certificado está sendo processado e ficará disponível em breve.",
      });
      refetchCertificados();
    },
    onError: () => {
      toast({
        title: "Erro ao solicitar certificado",
        description: "Ocorreu um problema ao processar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (matriculas && requisitos && !certificados) {
      const processarCertificados = async () => {
        try {
          const certProcessados = matriculas.map(matricula => {
            const reqs = requisitos[matricula.curso_id] || [];
            const todosRequisitosCumpridos = reqs.every(req => req.cumprido);
            
            let status: StatusCertificado = "indisponivel";
            
            if (todosRequisitosCumpridos) {
              status = "disponivel";
            }
            
            return {
              id: `cert-${matricula.id}`,
              cursoId: matricula.curso_id,
              cursoNome: matricula.curso.titulo,
              dataInicio: matricula.data_inicio,
              dataFim: matricula.data_conclusao,
              cargaHoraria: matricula.curso.carga_horaria,
              status,
              requisitos: reqs
            };
          });
        } catch (error) {
          console.error("Erro ao processar certificados:", error);
        }
      };
      
      processarCertificados();
    }
  }, [matriculas, requisitos, certificados]);

  const handleVerificarRequisitos = (cursoId: string | Certificado) => {
    if (typeof cursoId !== 'string') {
      setCertificadoSelecionado(cursoId);
      setIsDialogOpen(true);
      return;
    }
    
    const certificado = certificados?.find(c => c.cursoId === cursoId);
    if (certificado) {
      setCertificadoSelecionado(certificado);
      setIsDialogOpen(true);
    }
  };

  const handleAbrirDetalhes = (certificado: Certificado) => {
    handleVerificarRequisitos(certificado);
  };

  const handleSolicitarCertificado = (cursoId: string | Certificado) => {
    const id = typeof cursoId === 'string' ? cursoId : cursoId.cursoId;
    
    solicitarCertificado.mutate(id);
  };

  const handleDownloadCertificado = (certificadoId: string) => {
    const certificado = certificados?.find(c => c.id === certificadoId);
    if (certificado?.pdfUrl) {
      toast({
        title: "Download iniciado",
        description: "Seu certificado está sendo baixado.",
      });
    } else {
      toast({
        title: "Certificado indisponível",
        description: "O arquivo do certificado não está disponível para download.",
        variant: "destructive",
      });
    }
  };

  const certificadosFiltrados = certificados?.filter(cert => 
    statusFiltro === 'todos' || cert.status === statusFiltro
  );

  const isLoading = isLoadingMatriculas || isLoadingCertificados || isLoadingRequisitos;
  const error = matriculasError || certificadosError;

  if (error) {
    return <ErrorDisplay message="Ocorreu um erro ao carregar seus certificados." />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Meus Certificados</h1>
      
      <Tabs defaultValue="todos" onValueChange={(value) => setStatusFiltro(value as any)}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="disponivel">Disponíveis</TabsTrigger>
          <TabsTrigger value="em_processamento">Em Processamento</TabsTrigger>
          <TabsTrigger value="gerado">Emitidos</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFiltro} className="mt-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : certificados && certificados.length > 0 ? (
            <CertificadosGrid
              certificados={certificadosFiltrados || []}
              onVerificarRequisitos={handleVerificarRequisitos}
              onSolicitarCertificado={handleSolicitarCertificado}
              onDownloadCertificado={handleDownloadCertificado}
              onDetalhes={handleAbrirDetalhes}
            >
              {certificadosFiltrados?.map(certificado => (
                <CertificadoCard
                  key={certificado.id}
                  certificado={certificado}
                  onVerificarRequisitos={handleVerificarRequisitos}
                  onSolicitarCertificado={handleSolicitarCertificado}
                  onDownloadCertificado={handleDownloadCertificado}
                  onDetalhes={handleAbrirDetalhes}
                />
              ))}
            </CertificadosGrid>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium">Nenhum certificado encontrado</h3>
              <p className="text-muted-foreground mt-2">
                Você ainda não possui certificados {statusFiltro !== 'todos' ? `com status "${statusFiltro}"` : ''}.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {certificadoSelecionado && (
        <DetalhesCertificadoDialog
          certificado={certificadoSelecionado}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSolicitar={handleSolicitarCertificado}
          onDownload={handleDownloadCertificado}
        />
      )}
    </div>
  );
};

export default Certificados;
