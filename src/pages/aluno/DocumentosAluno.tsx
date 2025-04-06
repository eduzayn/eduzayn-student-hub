
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

// Componentes refatorados
import TipoDocumentoCard from "@/components/documentos/TipoDocumentoCard";
import DocumentoCard from "@/components/documentos/DocumentoCard";
import DocumentosTable from "@/components/documentos/DocumentosTable";
import EmptyState from "@/components/documentos/EmptyState";
import LoadingSkeleton from "@/components/documentos/LoadingSkeleton";
import ErrorDisplay from "@/components/documentos/ErrorDisplay";
import UploadDialog from "@/components/documentos/UploadDialog";
import ViewDocumentDialog from "@/components/documentos/ViewDocumentDialog";

// Tipos
import { TipoDocumento, Documento, TipoCurso, StatusDocumento } from "@/types/documentos";

const DocumentosAluno: React.FC = () => {
  const { isLoggedIn, isAdminBypass } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tiposDocumentos, setTiposDocumentos] = useState<TipoDocumento[]>([]);
  const [documentosAluno, setDocumentosAluno] = useState<Documento[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentTipoDocumento, setCurrentTipoDocumento] = useState<TipoDocumento | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentDocumento, setCurrentDocumento] = useState<Documento | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tipoCurso, setTipoCurso] = useState<TipoCurso>('graduacao');

  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erro ao buscar sessão:", sessionError);
          setError("Não foi possível verificar sua identidade");
          return;
        }
        
        const userId = sessionData.session?.user?.id;
        
        if (!userId && !isAdminBypass) {
          setError("Usuário não identificado");
          return;
        }
        
        const { data: tiposData, error: tiposError } = await supabase
          .from('tipos_documentos')
          .select('*');
        
        if (tiposError) {
          console.error("Erro ao buscar tipos de documentos:", tiposError);
          setError("Erro ao buscar tipos de documentos");
          return;
        }
        
        const tiposFormatados = tiposData.map((tipo) => ({
          id: tipo.id,
          nome: tipo.nome,
          descricao: tipo.descricao,
          obrigatorio: tipo.obrigatorio,
          formatosAceitos: tipo.formatos_aceitos,
          tamanhoMaximo: tipo.tamanho_maximo,
          requisitoTipo: tipo.requisito_tipo
        }));
        
        setTiposDocumentos(tiposFormatados);
        
        if (userId) {
          const { data: matriculaData, error: matriculaError } = await supabase
            .from('matriculas')
            .select(`
              curso_id,
              cursos (
                modalidade
              )
            `)
            .eq('aluno_id', userId)
            .order('data_inicio', { ascending: false })
            .limit(1)
            .single();
          
          if (matriculaData && !matriculaError) {
            const modalidadeCurso = matriculaData?.cursos?.modalidade;
            
            if (modalidadeCurso) {
              setTipoCurso('graduacao');
            }
          } else if (isAdminBypass) {
            setTipoCurso('graduacao');
          }
          
          const { data: docsData, error: docsError } = await supabase
            .from('documentos_alunos')
            .select(`
              id, 
              status, 
              data_envio, 
              data_analise, 
              arquivo_url, 
              motivo_rejeicao,
              tipo_documento_id,
              tipos_documentos (*)
            `)
            .eq('aluno_id', userId);
          
          if (docsError) {
            console.error("Erro ao buscar documentos do aluno:", docsError);
            setError("Erro ao buscar seus documentos");
            return;
          }
          
          const docsFormatados = docsData.map((doc) => ({
            id: doc.id,
            tipoDocumentoId: doc.tipo_documento_id,
            tipoDocumento: {
              id: doc.tipos_documentos.id,
              nome: doc.tipos_documentos.nome,
              descricao: doc.tipos_documentos.descricao,
              obrigatorio: doc.tipos_documentos.obrigatorio,
              formatosAceitos: doc.tipos_documentos.formatos_aceitos,
              tamanhoMaximo: doc.tipos_documentos.tamanho_maximo,
              requisitoTipo: doc.tipos_documentos.requisito_tipo
            },
            status: doc.status as StatusDocumento,
            dataEnvio: doc.data_envio ? new Date(doc.data_envio).toLocaleDateString('pt-BR') : undefined,
            dataAnalise: doc.data_analise ? new Date(doc.data_analise).toLocaleDateString('pt-BR') : undefined,
            arquivoUrl: doc.arquivo_url,
            motivoRejeicao: doc.motivo_rejeicao
          }));
          
          setDocumentosAluno(docsFormatados);
        } else if (isAdminBypass) {
          const mockDocs: Documento[] = [
            {
              id: '1',
              tipoDocumentoId: tiposFormatados[0]?.id || '1',
              tipoDocumento: tiposFormatados[0] || {
                id: '1',
                nome: 'RG / Documento de Identidade',
                obrigatorio: true,
                formatosAceitos: ['PDF', 'JPG', 'PNG'],
                tamanhoMaximo: 5242880,
                requisitoTipo: ['graduacao', 'posgraduacao', 'segunda_graduacao', 'formacao_livre']
              },
              status: 'aprovado',
              dataEnvio: '10/01/2025',
              dataAnalise: '12/01/2025',
              arquivoUrl: '#'
            },
            {
              id: '2',
              tipoDocumentoId: tiposFormatados[1]?.id || '2',
              tipoDocumento: tiposFormatados[1] || {
                id: '2',
                nome: 'CPF',
                obrigatorio: true,
                formatosAceitos: ['PDF', 'JPG', 'PNG'],
                tamanhoMaximo: 5242880,
                requisitoTipo: ['graduacao', 'posgraduacao', 'segunda_graduacao', 'formacao_livre']
              },
              status: 'aprovado',
              dataEnvio: '10/01/2025',
              dataAnalise: '12/01/2025',
              arquivoUrl: '#'
            },
            {
              id: '3',
              tipoDocumentoId: tiposFormatados[2]?.id || '3',
              tipoDocumento: tiposFormatados[2] || {
                id: '3',
                nome: 'Histórico do Ensino Médio',
                obrigatorio: true,
                formatosAceitos: ['PDF', 'JPG', 'PNG'],
                tamanhoMaximo: 5242880,
                requisitoTipo: ['graduacao', 'segunda_graduacao', 'formacao_livre']
              },
              status: 'rejeitado',
              dataEnvio: '10/01/2025',
              dataAnalise: '12/01/2025',
              arquivoUrl: '#',
              motivoRejeicao: 'Documento ilegível ou com data expirada.'
            },
            {
              id: '4',
              tipoDocumentoId: tiposFormatados[3]?.id || '4',
              tipoDocumento: tiposFormatados[3] || {
                id: '4',
                nome: 'Diploma da Primeira Graduação',
                obrigatorio: true,
                formatosAceitos: ['PDF', 'JPG', 'PNG'],
                tamanhoMaximo: 5242880,
                requisitoTipo: ['posgraduacao', 'segunda_graduacao', 'segunda_licenciatura', 'formacao_pedagogica']
              },
              status: 'pendente',
              dataEnvio: null,
              dataAnalise: null,
              arquivoUrl: null
            }
          ];
          
          setDocumentosAluno(mockDocs);
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDados();
  }, [isLoggedIn, isAdminBypass]);
  
  const tiposDocumentosApplicaveis = tiposDocumentos.filter(tipo => 
    !tipo.requisitoTipo || tipo.requisitoTipo.includes(tipoCurso)
  );
  
  const documentosPendentes = tiposDocumentosApplicaveis.filter(tipo => 
    !documentosAluno.some(doc => doc.tipoDocumentoId === tipo.id)
  );
  
  const documentosEnviados = documentosAluno.filter(doc => 
    ['em_analise', 'aprovado', 'rejeitado'].includes(doc.status) &&
    (!doc.tipoDocumento.requisitoTipo || doc.tipoDocumento.requisitoTipo.includes(tipoCurso))
  );
  
  const handleOpenUploadDialog = (tipoDoc: TipoDocumento) => {
    setCurrentTipoDocumento(tipoDoc);
    setUploadDialogOpen(true);
  };
  
  const handleUpload = async (file: File) => {
    if (!currentTipoDocumento) return;
    
    try {
      setUploading(true);
      setUploadProgress(10);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error("Não foi possível verificar sua identidade");
      }
      
      const userId = sessionData.session?.user?.id;
      
      if (!userId) {
        throw new Error("Usuário não identificado");
      }
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      const mockFileUrl = `https://storage.example.com/documents/${userId}/${Date.now()}-${file.name}`;
      
      setUploadProgress(95);
      
      const { data, error } = await supabase
        .from('documentos_alunos')
        .insert([
          {
            aluno_id: userId,
            tipo_documento_id: currentTipoDocumento.id,
            arquivo_url: mockFileUrl,
            status: 'em_analise'
          }
        ])
        .select('*')
        .single();
      
      if (error) throw error;
      
      setUploadProgress(100);
      clearInterval(interval);
      
      const novoDoc: Documento = {
        id: data.id,
        tipoDocumentoId: data.tipo_documento_id,
        tipoDocumento: currentTipoDocumento,
        status: 'em_analise',
        dataEnvio: new Date().toLocaleDateString('pt-BR'),
        arquivoUrl: mockFileUrl
      };
      
      setDocumentosAluno(prev => [...prev, novoDoc]);
      
      toast.success("Documento enviado com sucesso!");
      setUploadDialogOpen(false);
      
    } catch (error: any) {
      console.error("Erro ao enviar documento:", error);
      toast.error(error.message || "Erro ao enviar documento. Tente novamente.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleViewDocument = (documento: Documento) => {
    setCurrentDocumento(documento);
    setViewDialogOpen(true);
  };
  
  const handleReenviarDocumento = (documento: Documento) => {
    setCurrentTipoDocumento(documento.tipoDocumento);
    setUploadDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
        <p className="text-muted-foreground">
          Gerencie seus documentos acadêmicos e cadastrais.
        </p>
      </div>
      
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorDisplay error={error} />
      ) : (
        <Tabs defaultValue="pendentes" className="w-full">
          <TabsList>
            <TabsTrigger value="pendentes">Documentos Pendentes</TabsTrigger>
            <TabsTrigger value="enviados">Documentos Enviados</TabsTrigger>
            <TabsTrigger value="todos">Todos os Documentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pendentes" className="mt-6">
            {documentosPendentes.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {documentosPendentes.map((doc) => (
                  <TipoDocumentoCard
                    key={doc.id}
                    tipoDocumento={doc}
                    onUpload={handleOpenUploadDialog}
                  />
                ))}
              </div>
            ) : (
              <EmptyState tipo="pendentes" />
            )}
          </TabsContent>
          
          <TabsContent value="enviados" className="mt-6">
            {documentosEnviados.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {documentosEnviados.map((doc) => (
                  <DocumentoCard
                    key={doc.id}
                    documento={doc}
                    onView={handleViewDocument}
                    onReenviar={handleReenviarDocumento}
                  />
                ))}
              </div>
            ) : (
              <EmptyState tipo="enviados" />
            )}
          </TabsContent>
          
          <TabsContent value="todos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lista Completa de Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentosTable
                  tiposDocumentos={tiposDocumentos}
                  documentosAluno={documentosAluno}
                  tipoCurso={tipoCurso}
                  onUpload={handleOpenUploadDialog}
                  onView={handleViewDocument}
                  onReenviar={handleReenviarDocumento}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      <UploadDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        tipoDocumento={currentTipoDocumento}
        onUpload={handleUpload}
        uploading={uploading}
        uploadProgress={uploadProgress}
      />
      
      <ViewDocumentDialog
        isOpen={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        documento={currentDocumento}
        onReenviar={handleReenviarDocumento}
      />
    </div>
  );
};

export default DocumentosAluno;
