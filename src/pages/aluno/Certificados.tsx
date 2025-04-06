
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Certificado, CertificadoResponse, Disciplina, Pagamento } from "@/types/certificados";
import CertificadosGrid from "@/components/certificados/CertificadosGrid";
import LoadingSkeleton from "@/components/certificados/LoadingSkeleton";
import ErrorDisplay from "@/components/certificados/ErrorDisplay";
import DetalhesCertificadoDialog from "@/components/certificados/DetalhesCertificadoDialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Calcular tempo decorrido do curso em meses
const calcularTempoDecorrido = (dataInicio: string): { meses: number; porcentagem: number } => {
  const inicio = new Date(dataInicio);
  const hoje = new Date();
  
  // Calcular diferença em meses
  const meses = (hoje.getFullYear() - inicio.getFullYear()) * 12 + 
                (hoje.getMonth() - inicio.getMonth());
  
  // Calcular porcentagem considerando 18 meses como 100%
  const porcentagem = (meses / 18) * 100;
  
  return { meses, porcentagem };
};

const Certificados: React.FC = () => {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [filteredCertificados, setFilteredCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("todos");
  const { isLoggedIn, userEmail } = useAuth();
  
  // Estado para o diálogo de detalhes
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedCertificado, setSelectedCertificado] = useState<Certificado | null>(null);
  
  // Estados para disciplinas e pagamentos
  const [disciplinas, setDisciplinas] = useState<Record<string, Disciplina[]>>({});
  const [pagamentos, setPagamentos] = useState<Record<string, Pagamento[]>>({});
  
  // Função para buscar certificados
  const buscarCertificados = async () => {
    setLoading(true);
    
    try {
      // Buscar certificados do usuário logado
      const { data: user } = await supabase.auth.getUser();
      
      if (!user || !user.user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Buscar matrículas do aluno
      const { data: matriculasData, error: matriculasError } = await supabase
        .from('matriculas')
        .select(`
          id,
          data_inicio,
          data_conclusao,
          curso_id,
          cursos:curso_id (
            id,
            titulo,
            carga_horaria
          )
        `)
        .eq('aluno_id', user.user.id);
      
      if (matriculasError) {
        throw new Error(matriculasError.message);
      }
      
      // Buscar disciplinas (aulas) para cada curso
      const todosCursos: Record<string, Disciplina[]> = {};
      const todosPagamentos: Record<string, Pagamento[]> = {};
      
      for (const matricula of matriculasData || []) {
        // Buscar disciplinas/aulas
        const { data: aulasData, error: aulasError } = await supabase
          .from('aulas')
          .select(`
            id,
            titulo,
            modulo_id,
            modulo:modulo_id (curso_id)
          `)
          .eq('modulo:modulo_id.curso_id', matricula.curso_id);
          
        if (aulasError) {
          console.error('Erro ao buscar aulas:', aulasError);
        } else if (aulasData) {
          // Buscar progresso das aulas
          const { data: progressoData, error: progressoError } = await supabase
            .from('progresso_aulas')
            .select('aula_id, concluido')
            .eq('aluno_id', user.user.id)
            .in('aula_id', aulasData.map(aula => aula.id));
            
          if (progressoError) {
            console.error('Erro ao buscar progresso:', progressoError);
          }
          
          // Mapear aulas para disciplinas
          const disciplinas: Disciplina[] = aulasData.map(aula => {
            const progresso = progressoData?.find(p => p.aula_id === aula.id);
            const nota = progresso?.concluido ? 85 : 0; // Valor simulado para nota
            
            return {
              id: aula.id,
              nome: aula.titulo,
              nota: nota,
              concluida: !!progresso?.concluido
            };
          });
          
          todosCursos[matricula.curso_id] = disciplinas;
        }
        
        // Buscar pagamentos
        const { data: parcelasData, error: parcelasError } = await supabase
          .from('parcelas')
          .select('*')
          .eq('aluno_id', user.user.id)
          .eq('curso_id', matricula.curso_id)
          .order('numero_parcela');
          
        if (parcelasError) {
          console.error('Erro ao buscar parcelas:', parcelasError);
        } else if (parcelasData) {
          // Mapear parcelas para pagamentos
          const pagamentos: Pagamento[] = parcelasData.map(parcela => {
            let status: 'pago' | 'pendente' | 'atrasado' = 'pendente';
            
            if (parcela.status === 'pago') {
              status = 'pago';
            } else {
              // Verificar se está atrasado
              const dataVencimento = new Date(parcela.data_vencimento);
              const hoje = new Date();
              status = dataVencimento < hoje ? 'atrasado' : 'pendente';
            }
            
            return {
              id: parcela.id,
              status: status,
              dataVencimento: parcela.data_vencimento,
              valor: parcela.valor,
              numero: parcela.numero_parcela
            };
          });
          
          todosPagamentos[matricula.curso_id] = pagamentos;
        }
      }
      
      setDisciplinas(todosCursos);
      setPagamentos(todosPagamentos);
      
      // Transformar matrículas em certificados
      const certificadosMapeados: Certificado[] = matriculasData?.map(matricula => {
        const cursoId = matricula.curso_id;
        const disciplinasCurso = todosCursos[cursoId] || [];
        const pagamentosCurso = todosPagamentos[cursoId] || [];
        
        // Verificar requisitos
        const tempoDecorrido = calcularTempoDecorrido(matricula.data_inicio);
        const disciplinasConcluidas = disciplinasCurso.every(d => d.concluida && d.nota >= 70);
        const pagamentosQuitados = pagamentosCurso.every(p => p.status === 'pago');
        const tempoMinimoCumprido = tempoDecorrido.meses >= 18;
        
        // Determinar status do certificado
        let status: 'disponivel' | 'indisponivel' | 'em_processamento' | 'gerado' = 'indisponivel';
        
        if (disciplinasConcluidas && pagamentosQuitados && tempoMinimoCumprido) {
          status = 'disponivel';
          
          // Verificar se foi gerado ou está em processamento
          if (matricula.data_conclusao) {
            status = 'gerado';
          }
        }
        
        // Criar lista de requisitos
        const requisitos = [
          {
            id: `req1-${cursoId}`,
            descricao: 'Aprovado em todas as disciplinas',
            cumprido: disciplinasConcluidas,
            detalhe: !disciplinasConcluidas 
              ? `Faltam ${disciplinasCurso.filter(d => !d.concluida || d.nota < 70).length} disciplinas para concluir` 
              : undefined
          },
          {
            id: `req2-${cursoId}`,
            descricao: 'Pagamentos em dia',
            cumprido: pagamentosQuitados,
            detalhe: !pagamentosQuitados 
              ? `${pagamentosCurso.filter(p => p.status !== 'pago').length} pagamentos pendentes` 
              : undefined
          },
          {
            id: `req3-${cursoId}`,
            descricao: 'Completou o tempo mínimo de curso (18 meses)',
            cumprido: tempoMinimoCumprido,
            detalhe: !tempoMinimoCumprido 
              ? `${tempoDecorrido.meses} meses decorridos de 18 necessários` 
              : undefined
          }
        ];
        
        return {
          id: matricula.id,
          cursoId: matricula.curso_id,
          cursoNome: matricula.cursos?.titulo || 'Curso sem nome',
          dataInicio: matricula.data_inicio,
          dataFim: matricula.data_conclusao || undefined,
          cargaHoraria: matricula.cursos?.carga_horaria || 0,
          dataEmissao: matricula.data_conclusao || undefined,
          status: status,
          pdfUrl: status === 'gerado' ? `/certificados/${matricula.id}.pdf` : undefined,
          requisitos: requisitos
        };
      }) || [];
      
      setCertificados(certificadosMapeados);
      setFilteredCertificados(certificadosMapeados);
      
      setError(null);
    } catch (err: any) {
      console.error("Erro ao buscar certificados:", err);
      setError("Não foi possível carregar seus certificados. Por favor, tente novamente mais tarde.");
      toast.error("Erro ao carregar certificados", { 
        description: "Não foi possível carregar seus certificados. Tente novamente mais tarde." 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Efeito para carregar os certificados
  useEffect(() => {
    if (isLoggedIn) {
      buscarCertificados();
    } else {
      setLoading(false);
      setError("Você precisa estar logado para visualizar seus certificados.");
    }
  }, [isLoggedIn]);
  
  // Filtrar certificados ao mudar a aba
  useEffect(() => {
    if (currentTab === "todos") {
      setFilteredCertificados(certificados);
    } else if (currentTab === "disponiveis") {
      setFilteredCertificados(certificados.filter(cert => cert.status === "disponivel"));
    } else if (currentTab === "gerados") {
      setFilteredCertificados(certificados.filter(cert => cert.status === "gerado" || cert.status === "em_processamento"));
    } else if (currentTab === "indisponiveis") {
      setFilteredCertificados(certificados.filter(cert => cert.status === "indisponivel"));
    }
  }, [currentTab, certificados]);
  
  // Solicitar um certificado
  const handleSolicitar = async (cursoId: string) => {
    try {
      const certificado = certificados.find(c => c.cursoId === cursoId);
      if (!certificado) {
        throw new Error('Certificado não encontrado');
      }
      
      // Atualizar status no banco de dados
      const { error: updateError } = await supabase
        .from('matriculas')
        .update({ status: 'concluido' })
        .eq('id', certificado.id);
        
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Atualizar o estado local
      const novosCertificados = certificados.map(cert => {
        if (cert.cursoId === cursoId) {
          return { ...cert, status: "em_processamento" };
        }
        return cert;
      });
      
      setCertificados(novosCertificados);
      
      toast.success("Certificado solicitado com sucesso", { 
        description: "O seu certificado está em processamento e ficará disponível em breve." 
      });
    } catch (err: any) {
      console.error("Erro ao solicitar certificado:", err);
      toast.error("Erro ao solicitar certificado", { 
        description: "Não foi possível processar sua solicitação. Tente novamente mais tarde." 
      });
    }
  };
  
  // Verificar requisitos para certificado
  const handleVerificarRequisitos = (cursoId: string) => {
    const certificado = certificados.find(cert => cert.cursoId === cursoId);
    if (certificado) {
      setSelectedCertificado(certificado);
      setDialogOpen(true);
    }
  };
  
  // Download de certificado
  const handleDownload = async (certificadoId: string) => {
    const certificado = certificados.find(cert => cert.id === certificadoId);
    
    if (!certificado?.pdfUrl) {
      toast.error("Certificado indisponível", { 
        description: "Não foi possível baixar o certificado. Tente novamente mais tarde." 
      });
      return;
    }
    
    try {
      // Simulação de download - em produção seria implementado com o Storage do Supabase
      toast.success("Download iniciado", { 
        description: "O download do seu certificado foi iniciado." 
      });
      
      // Em um ambiente real, baixaria o PDF do Storage
      // const { data, error } = await supabase.storage
      //   .from('certificados')
      //   .download(`${certificadoId}.pdf`);
      
      // if (error) {
      //   throw error;
      // }
      
      // const url = URL.createObjectURL(data);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `certificado-${certificado.cursoNome}.pdf`;
      // a.click();
      // URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Erro ao baixar certificado:", err);
      toast.error("Erro ao baixar certificado", { 
        description: "Não foi possível baixar o certificado. Tente novamente mais tarde." 
      });
    }
  };
  
  // Renderização de carregamento
  if (loading) {
    return <LoadingSkeleton />;
  }
  
  // Renderização de erro
  if (error) {
    return <ErrorDisplay error={error} />;
  }
  
  // Renderização do tempo decorrido para o certificado selecionado
  const tempoDecorridoSelecionado = selectedCertificado 
    ? calcularTempoDecorrido(selectedCertificado.dataInicio)
    : { meses: 0, porcentagem: 0 };
  
  // Disciplinas do curso selecionado
  const disciplinasSelecionadas = selectedCertificado 
    ? disciplinas[selectedCertificado.cursoId] || []
    : [];
  
  // Pagamentos do curso selecionado
  const pagamentosSelecionados = selectedCertificado 
    ? pagamentos[selectedCertificado.cursoId] || []
    : [];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certificados</h1>
        <p className="text-muted-foreground">
          Visualize e solicite certificados dos seus cursos concluídos.
        </p>
      </div>
      
      <Tabs 
        defaultValue="todos" 
        value={currentTab} 
        onValueChange={setCurrentTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="todos">
            Todos
            <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
              {certificados.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="disponiveis">
            Disponíveis
            <span className="ml-2 bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs">
              {certificados.filter(cert => cert.status === "disponivel").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="gerados">
            Gerados
            <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">
              {certificados.filter(cert => cert.status === "gerado" || cert.status === "em_processamento").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="indisponiveis">
            Indisponíveis
            <span className="ml-2 bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-xs">
              {certificados.filter(cert => cert.status === "indisponivel").length}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos">
          <CertificadosGrid 
            certificados={filteredCertificados} 
            onVerificarRequisitos={handleVerificarRequisitos}
            onSolicitarCertificado={handleSolicitar}
            onDownloadCertificado={handleDownload}
          />
        </TabsContent>
        
        <TabsContent value="disponiveis">
          <CertificadosGrid 
            certificados={filteredCertificados} 
            onVerificarRequisitos={handleVerificarRequisitos}
            onSolicitarCertificado={handleSolicitar}
            onDownloadCertificado={handleDownload}
          />
        </TabsContent>
        
        <TabsContent value="gerados">
          <CertificadosGrid 
            certificados={filteredCertificados} 
            onVerificarRequisitos={handleVerificarRequisitos}
            onSolicitarCertificado={handleSolicitar}
            onDownloadCertificado={handleDownload}
          />
        </TabsContent>
        
        <TabsContent value="indisponiveis">
          <CertificadosGrid 
            certificados={filteredCertificados} 
            onVerificarRequisitos={handleVerificarRequisitos}
            onSolicitarCertificado={handleSolicitar}
            onDownloadCertificado={handleDownload}
          />
        </TabsContent>
      </Tabs>
      
      {/* Diálogo de detalhes do certificado */}
      <DetalhesCertificadoDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        certificado={selectedCertificado}
        disciplinas={disciplinasSelecionadas}
        pagamentos={pagamentosSelecionados}
        tempoDecorrido={tempoDecorridoSelecionado}
        onSolicitarCertificado={handleSolicitar}
        onDownloadCertificado={handleDownload}
      />
    </div>
  );
};

export default Certificados;
