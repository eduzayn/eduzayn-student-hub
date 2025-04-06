
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileCheck, FileWarning } from 'lucide-react';
import { DocumentoCard } from '@/components/documentos/DocumentoCard';
import { TipoDocumentoCard } from '@/components/documentos/TipoDocumentoCard';
import { UploadDialog } from '@/components/documentos/UploadDialog';
import { ViewDocumentDialog } from '@/components/documentos/ViewDocumentDialog';
import { DocumentosTable } from '@/components/documentos/DocumentosTable';
import { EmptyState } from '@/components/documentos/EmptyState';
import { LoadingSkeleton } from '@/components/documentos/LoadingSkeleton';
import { ErrorDisplay } from '@/components/documentos/ErrorDisplay';
import { supabase } from '@/integrations/supabase/client';

const DocumentosAluno = () => {
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<any>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [tiposDocumento, setTiposDocumento] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [isLoadingTipos, setIsLoadingTipos] = useState(true);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTiposDocumento();
    fetchDocumentos();
  }, []);

  const fetchTiposDocumento = async () => {
    setIsLoadingTipos(true);
    try {
      // Em produção, use dados reais do Supabase
      setTimeout(() => {
        const mockTiposDocumento = [
          {
            id: '1',
            nome: 'RG',
            descricao: 'Documento de identidade',
            obrigatorio: true,
            formatos_aceitos: ['pdf', 'jpg', 'png'],
            tamanho_maximo: 5242880,
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
          },
          {
            id: '2',
            nome: 'CPF',
            descricao: 'Cadastro de pessoa física',
            obrigatorio: true,
            formatos_aceitos: ['pdf', 'jpg', 'png'],
            tamanho_maximo: 5242880,
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
          },
          {
            id: '3',
            nome: 'Diploma de Graduação',
            descricao: 'Documento que comprova a formação em nível superior',
            obrigatorio: true,
            formatos_aceitos: ['pdf'],
            tamanho_maximo: 10485760,
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
          },
          {
            id: '4',
            nome: 'Certidão de Nascimento',
            descricao: 'Documento registrado em cartório',
            obrigatorio: false,
            formatos_aceitos: ['pdf'],
            tamanho_maximo: 5242880,
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
          },
          {
            id: '5',
            nome: 'Histórico Escolar',
            descricao: 'Histórico escolar completo',
            obrigatorio: true,
            formatos_aceitos: ['pdf'],
            tamanho_maximo: 10485760,
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
          }
        ];
        setTiposDocumento(mockTiposDocumento);
        setIsLoadingTipos(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao buscar tipos de documento:', error);
      setError('Não foi possível carregar os tipos de documento.');
      setIsLoadingTipos(false);
    }
  };

  const fetchDocumentos = async () => {
    setIsLoadingDocs(true);
    try {
      // Em produção, use dados reais do Supabase
      setTimeout(() => {
        const mockDocumentos = [
          {
            id: '1',
            tipo_documento_id: '1',
            aluno_id: 'aluno123',
            arquivo_url: 'https://example.com/documento1.pdf',
            status: 'aprovado',
            data_envio: new Date().toISOString(),
            data_analise: new Date().toISOString(),
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString(),
            tipo_documento: {
              id: '1',
              nome: 'RG',
              descricao: 'Documento de identidade'
            }
          },
          {
            id: '2',
            tipo_documento_id: '2',
            aluno_id: 'aluno123',
            arquivo_url: 'https://example.com/documento2.pdf',
            status: 'pendente',
            data_envio: new Date().toISOString(),
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString(),
            tipo_documento: {
              id: '2',
              nome: 'CPF',
              descricao: 'Cadastro de pessoa física'
            }
          },
          {
            id: '3',
            tipo_documento_id: '3',
            aluno_id: 'aluno123',
            arquivo_url: 'https://example.com/documento3.pdf',
            status: 'rejeitado',
            motivo_rejeicao: 'Documento ilegível',
            data_envio: new Date().toISOString(),
            data_analise: new Date().toISOString(),
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString(),
            tipo_documento: {
              id: '3',
              nome: 'Diploma de Graduação',
              descricao: 'Documento que comprova a formação em nível superior'
            }
          }
        ];
        setDocumentos(mockDocumentos);
        setIsLoadingDocs(false);
      }, 1500);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      setError('Não foi possível carregar seus documentos.');
      setIsLoadingDocs(false);
    }
  };

  const handleUploadDocumento = async (formData) => {
    try {
      // Em produção, implemente o upload real para o Supabase Storage
      
      // Simular um upload bem-sucedido
      setTimeout(() => {
        // Criar novo documento no estado
        const novoDocumento = {
          id: `doc-${Date.now()}`,
          tipo_documento_id: selectedDocType.id,
          aluno_id: 'aluno123',
          arquivo_url: 'https://example.com/documento-novo.pdf',
          status: 'pendente',
          data_envio: new Date().toISOString(),
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString(),
          tipo_documento: {
            id: selectedDocType.id,
            nome: selectedDocType.nome,
            descricao: selectedDocType.descricao
          }
        };
        
        setDocumentos([...documentos, novoDocumento]);
        setIsUploadDialogOpen(false);
        
        toast({
          title: 'Documento enviado com sucesso',
          description: 'Seu documento foi enviado e está aguardando análise.',
        });
      }, 1500);
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
      toast({
        title: 'Erro ao enviar documento',
        description: 'Ocorreu um problema ao enviar seu documento. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenUploadDialog = (tipoDocumento) => {
    setSelectedDocType(tipoDocumento);
    setIsUploadDialogOpen(true);
  };

  const handleViewDocument = (documento) => {
    setSelectedDocument(documento);
    setIsViewDialogOpen(true);
  };

  // Verificar documentos pendentes para cada tipo
  const getDocumentosParaTipo = (tipoId) => {
    return documentos.filter(doc => doc.tipo_documento_id === tipoId);
  };
  
  // Determinar status geral dos documentos
  const totalDocumentosRequeridos = tiposDocumento.filter(tipo => tipo.obrigatorio).length;
  const documentosEnviados = documentos.length;
  const documentosAprovados = documentos.filter(doc => doc.status === 'aprovado').length;
  const percentualConcluido = totalDocumentosRequeridos > 0 
    ? Math.round((documentosAprovados / totalDocumentosRequeridos) * 100) 
    : 0;

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentos Acadêmicos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seus documentos acadêmicos e acompanhe o status de análise.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Documentos Enviados</h3>
          {isLoadingDocs ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse mt-2"></div>
          ) : (
            <p className="text-2xl font-bold">{documentosEnviados}</p>
          )}
        </div>
        
        <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-green-100 p-3 mb-3">
            <FileCheck className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold">Documentos Aprovados</h3>
          {isLoadingDocs ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse mt-2"></div>
          ) : (
            <p className="text-2xl font-bold">{documentosAprovados}</p>
          )}
        </div>
        
        <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-orange-100 p-3 mb-3">
            <FileWarning className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold">Progresso Geral</h3>
          {isLoadingDocs || isLoadingTipos ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse mt-2 rounded-md"></div>
          ) : (
            <p className="text-2xl font-bold">{percentualConcluido}%</p>
          )}
        </div>
      </div>

      <Tabs defaultValue="tipos">
        <TabsList>
          <TabsTrigger value="tipos">Tipos de Documentos</TabsTrigger>
          <TabsTrigger value="meus">Meus Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tipos" className="mt-6">
          {isLoadingTipos ? (
            <LoadingSkeleton />
          ) : tiposDocumento.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tiposDocumento.map(tipo => (
                <TipoDocumentoCard
                  key={tipo.id}
                  tipoDocumento={tipo}
                  documentos={getDocumentosParaTipo(tipo.id)}
                  onUpload={() => handleOpenUploadDialog(tipo)}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="Nenhum tipo de documento encontrado" 
              description="Não há tipos de documentos cadastrados no momento."
            />
          )}
        </TabsContent>
        
        <TabsContent value="meus" className="mt-6">
          {isLoadingDocs ? (
            <LoadingSkeleton />
          ) : documentos.length > 0 ? (
            <DocumentosTable 
              documentos={documentos} 
              onView={handleViewDocument}
              onUpload={handleOpenUploadDialog}
            />
          ) : (
            <EmptyState 
              title="Nenhum documento enviado" 
              description="Você ainda não enviou nenhum documento. Vá para a aba 'Tipos de Documentos' para enviar."
              action={
                <Button 
                  onClick={() => document.querySelector('[data-value="tipos"]')?.click()}
                  variant="outline"
                >
                  Ver tipos de documentos
                </Button>
              }
            />
          )}
        </TabsContent>
      </Tabs>

      {selectedDocType && (
        <UploadDialog
          isOpen={isUploadDialogOpen}
          tipoDocumento={selectedDocType}
          onClose={() => setIsUploadDialogOpen(false)}
          onUpload={handleUploadDocumento}
        />
      )}

      {selectedDocument && (
        <ViewDocumentDialog
          isOpen={isViewDialogOpen}
          documento={selectedDocument}
          onClose={() => setIsViewDialogOpen(false)}
          onReenviar={() => {
            setIsViewDialogOpen(false);
            const tipoDoc = tiposDocumento.find(t => t.id === selectedDocument.tipo_documento_id);
            if (tipoDoc) {
              handleOpenUploadDialog(tipoDoc);
            }
          }}
        />
      )}
    </div>
  );
};

export default DocumentosAluno;
