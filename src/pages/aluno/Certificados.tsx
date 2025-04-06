
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Certificado, Disciplina, Pagamento } from "@/types/certificados";
import { Skeleton } from "@/components/ui/skeleton";
import CertificadosGrid from "@/components/certificados/CertificadosGrid";
import LoadingSkeleton from "@/components/certificados/LoadingSkeleton";
import ErrorDisplay from "@/components/certificados/ErrorDisplay";
import DetalhesCertificadoDialog from "@/components/certificados/DetalhesCertificadoDialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Dados simulados para desenvolvimento
const MOCK_CERTIFICADOS: Certificado[] = [
  {
    id: "cert-001",
    cursoId: "curso-001",
    cursoNome: "Graduação em Pedagogia",
    dataInicio: "2023-09-15",
    cargaHoraria: 3200,
    status: "disponivel",
    requisitos: [
      { id: "req1", descricao: "Aprovado em todas as disciplinas", cumprido: true },
      { id: "req2", descricao: "Pagamentos em dia", cumprido: true },
      { id: "req3", descricao: "Completou o tempo mínimo de curso (18 meses)", cumprido: true }
    ]
  },
  {
    id: "cert-002",
    cursoId: "curso-002",
    cursoNome: "Pós-graduação em Gestão Escolar",
    dataInicio: "2023-05-10",
    cargaHoraria: 420,
    status: "indisponivel",
    requisitos: [
      { id: "req1", descricao: "Aprovado em todas as disciplinas", cumprido: false, detalhe: "Faltam 2 disciplinas para concluir" },
      { id: "req2", descricao: "Pagamentos em dia", cumprido: true },
      { id: "req3", descricao: "Completou o tempo mínimo de curso (18 meses)", cumprido: false, detalhe: "10 meses decorridos de 18 necessários" }
    ]
  },
  {
    id: "cert-003",
    cursoId: "curso-003",
    cursoNome: "Segunda Licenciatura em História",
    dataInicio: "2022-02-20",
    dataFim: "2023-10-15",
    cargaHoraria: 1400,
    status: "gerado",
    dataEmissao: "2023-10-20",
    pdfUrl: "/certificados/certificado-historia.pdf",
    requisitos: [
      { id: "req1", descricao: "Aprovado em todas as disciplinas", cumprido: true },
      { id: "req2", descricao: "Pagamentos em dia", cumprido: true },
      { id: "req3", descricao: "Completou o tempo mínimo de curso (18 meses)", cumprido: true }
    ]
  }
];

const MOCK_DISCIPLINAS: Record<string, Disciplina[]> = {
  "curso-001": [
    { id: "disc-001", nome: "Fundamentos da Educação", nota: 85, concluida: true },
    { id: "disc-002", nome: "Psicologia da Educação", nota: 92, concluida: true },
    { id: "disc-003", nome: "Metodologia de Ensino", nota: 78, concluida: true },
    { id: "disc-004", nome: "Práticas Pedagógicas", nota: 81, concluida: true },
  ],
  "curso-002": [
    { id: "disc-005", nome: "Gestão Educacional", nota: 88, concluida: true },
    { id: "disc-006", nome: "Políticas Públicas", nota: 75, concluida: true },
    { id: "disc-007", nome: "Liderança e Inovação", nota: 0, concluida: false },
    { id: "disc-008", nome: "Projeto Final", nota: 0, concluida: false },
  ],
  "curso-003": [
    { id: "disc-009", nome: "História Antiga", nota: 82, concluida: true },
    { id: "disc-010", nome: "História Medieval", nota: 79, concluida: true },
    { id: "disc-011", nome: "História Contemporânea", nota: 85, concluida: true },
    { id: "disc-012", nome: "Metodologia da Pesquisa", nota: 90, concluida: true },
  ]
};

const MOCK_PAGAMENTOS: Record<string, Pagamento[]> = {
  "curso-001": [
    { id: "pag-001", status: 'pago', dataVencimento: "2023-09-15", valor: 499.90, numero: 1 },
    { id: "pag-002", status: 'pago', dataVencimento: "2023-10-15", valor: 499.90, numero: 2 },
    { id: "pag-003", status: 'pago', dataVencimento: "2023-11-15", valor: 499.90, numero: 3 },
    { id: "pag-004", status: 'pago', dataVencimento: "2023-12-15", valor: 499.90, numero: 4 },
    { id: "pag-005", status: 'pago', dataVencimento: "2024-01-15", valor: 499.90, numero: 5 },
    { id: "pag-006", status: 'pago', dataVencimento: "2024-02-15", valor: 499.90, numero: 6 },
  ],
  "curso-002": [
    { id: "pag-007", status: 'pago', dataVencimento: "2023-05-10", valor: 399.90, numero: 1 },
    { id: "pag-008", status: 'pago', dataVencimento: "2023-06-10", valor: 399.90, numero: 2 },
    { id: "pag-009", status: 'pago', dataVencimento: "2023-07-10", valor: 399.90, numero: 3 },
    { id: "pag-010", status: 'pendente', dataVencimento: "2023-08-10", valor: 399.90, numero: 4 },
    { id: "pag-011", status: 'pendente', dataVencimento: "2023-09-10", valor: 399.90, numero: 5 },
  ],
  "curso-003": [
    { id: "pag-012", status: 'pago', dataVencimento: "2022-02-20", valor: 549.90, numero: 1 },
    { id: "pag-013", status: 'pago', dataVencimento: "2022-03-20", valor: 549.90, numero: 2 },
    { id: "pag-014", status: 'pago', dataVencimento: "2022-04-20", valor: 549.90, numero: 3 },
    { id: "pag-015", status: 'pago', dataVencimento: "2022-05-20", valor: 549.90, numero: 4 },
    { id: "pag-016", status: 'pago', dataVencimento: "2022-06-20", valor: 549.90, numero: 5 },
    { id: "pag-017", status: 'pago', dataVencimento: "2022-07-20", valor: 549.90, numero: 6 },
  ]
};

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
  const { toast } = useToast();
  
  // Estado para o diálogo de detalhes
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedCertificado, setSelectedCertificado] = useState<Certificado | null>(null);
  
  // Função para buscar certificados
  const buscarCertificados = async () => {
    setLoading(true);
    
    try {
      // Em um ambiente real, aqui você buscaria os dados do Supabase
      // Exemplo:
      // const { data, error } = await supabase
      //   .from('certificados')
      //   .select('*')
      //   .eq('aluno_id', userId);
      
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usando dados de exemplo para desenvolvimento
      setCertificados(MOCK_CERTIFICADOS);
      setFilteredCertificados(MOCK_CERTIFICADOS);
      
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar certificados:", err);
      setError("Não foi possível carregar seus certificados. Por favor, tente novamente mais tarde.");
      toast({
        variant: "destructive",
        title: "Erro ao carregar certificados",
        description: "Não foi possível carregar seus certificados. Tente novamente mais tarde.",
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
      // Simula a chamada para a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualiza o estado local
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
    } catch (err) {
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
  const handleDownload = (certificadoId: string) => {
    const certificado = certificados.find(cert => cert.id === certificadoId);
    
    // Em um ambiente real, você redirecionaria para a URL do PDF
    // ou faria download via API
    if (certificado?.pdfUrl) {
      toast.success("Download iniciado", { 
        description: "O download do seu certificado foi iniciado." 
      });
      // Simulação: window.open(certificado.pdfUrl, '_blank');
    } else {
      toast.error("Certificado indisponível", { 
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
    ? MOCK_DISCIPLINAS[selectedCertificado.cursoId] || []
    : [];
  
  // Pagamentos do curso selecionado
  const pagamentosSelecionados = selectedCertificado 
    ? MOCK_PAGAMENTOS[selectedCertificado.cursoId] || []
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
