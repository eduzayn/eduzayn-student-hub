import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileUp, FileCheck, FileX, Eye, Download, Loader2, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TipoDocumento = {
  id: string;
  nome: string;
  descricao?: string;
  obrigatorio: boolean;
  formatosAceitos: string[];
  tamanhoMaximo: number;
  requisitoTipo?: string[];
};

type StatusDocumento = 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';

type Documento = {
  id: string;
  tipoDocumentoId: string;
  tipoDocumento: TipoDocumento;
  status: StatusDocumento;
  dataEnvio?: string;
  dataAnalise?: string;
  arquivoUrl?: string;
  motivoRejeicao?: string;
};

type TipoCurso = 'graduacao' | 'posgraduacao' | 'segunda_graduacao' | 'segunda_licenciatura' | 'formacao_pedagogica' | 'formacao_livre';

const DocumentosAluno: React.FC = () => {
  const { isLoggedIn, isAdminBypass } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tiposDocumentos, setTiposDocumentos] = useState<TipoDocumento[]>([]);
  const [documentosAluno, setDocumentosAluno] = useState<Documento[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentTipoDocumento, setCurrentTipoDocumento] = useState<TipoDocumento | null>(null);
  const [file, setFile] = useState<File | null>(null);
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
    setFile(null);
    setUploadDialogOpen(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      const tipoDocAtual = currentTipoDocumento;
      
      if (tipoDocAtual && fileExt) {
        const formatosPermitidos = tipoDocAtual.formatosAceitos.map(f => f.toLowerCase());
        
        if (!formatosPermitidos.includes(fileExt)) {
          toast.error(`Formato de arquivo não permitido. Use: ${formatosPermitidos.join(', ')}`);
          return;
        }
        
        if (selectedFile.size > tipoDocAtual.tamanhoMaximo) {
          const tamanhoMaxMB = (tipoDocAtual.tamanhoMaximo / (1024 * 1024)).toFixed(2);
          toast.error(`O arquivo é muito grande. Tamanho máximo permitido: ${tamanhoMaxMB}MB`);
          return;
        }
        
        setFile(selectedFile);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file || !currentTipoDocumento) return;
    
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
    setFile(null);
    setUploadDialogOpen(true);
  };
  
  const renderStatusBadge = (status: StatusDocumento) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pendente</Badge>
        );
      case "em_analise":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Em Análise</Badge>
        );
      case "aprovado":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Aprovado</Badge>
        );
      case "rejeitado":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejeitado</Badge>
        );
      default:
        return null;
    }
  };

  const renderRequisitoInfo = (tipoDoc: TipoDocumento) => {
    if (!tipoDoc.requisitoTipo || tipoDoc.requisitoTipo.length === 0) {
      return null;
    }
    
    const reqFormatted = tipoDoc.requisitoTipo.map(req => {
      switch(req) {
        case 'graduacao': return 'Graduação';
        case 'posgraduacao': return 'Pós-Graduação';
        case 'segunda_graduacao': return 'Segunda Graduação';
        case 'segunda_licenciatura': return 'Segunda Licenciatura';
        case 'formacao_pedagogica': return 'Formação Pedagógica';
        case 'formacao_livre': return 'Formação Livre';
        default: return req;
      }
    }).join(', ');
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info size={16} className="text-muted-foreground ml-1" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Requisito para: {reqFormatted}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );

  const ErrorDisplay = () => (
    <Card className="border-red-200">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Não foi possível carregar seus documentos</h3>
        <p className="text-muted-foreground text-center mb-4">
          {error || "Ocorreu um erro ao carregar os dados. Tente novamente mais tarde."}
        </p>
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );

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
        <ErrorDisplay />
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
                  <Card key={doc.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center">
                          {doc.nome}
                          {renderRequisitoInfo(doc)}
                        </CardTitle>
                        {doc.obrigatorio && (
                          <Badge variant="destructive">Obrigatório</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {doc.descricao && (
                          <p className="text-sm text-muted-foreground">{doc.descricao}</p>
                        )}
                        <div className="text-sm text-muted-foreground">
                          <p>Formatos aceitos: {doc.formatosAceitos.join(", ")}</p>
                          <p>Tamanho máximo: {(doc.tamanhoMaximo / (1024 * 1024)).toFixed(2)}MB</p>
                        </div>
                        
                        <div className="flex justify-center">
                          <Button 
                            className="w-full" 
                            onClick={() => handleOpenUploadDialog(doc)}
                          >
                            <FileUp className="h-5 w-5 mr-2" />
                            Enviar Documento
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileCheck className="h-16 w-16 text-green-500 mb-4" />
                  <p className="text-lg font-medium mb-2">Não há documentos pendentes!</p>
                  <p className="text-muted-foreground text-center">
                    Todos os seus documentos foram enviados e estão em análise ou já foram aprovados.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="enviados" className="mt-6">
            {documentosEnviados.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {documentosEnviados.map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg flex items-center">
                          {doc.tipoDocumento.nome}
                          {renderRequisitoInfo(doc.tipoDocumento)}
                        </CardTitle>
                        {renderStatusBadge(doc.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="text-muted-foreground">Data de Envio:</span>
                            <span>{doc.dataEnvio || "-"}</span>
                          </div>
                          {doc.dataAnalise && (
                            <div className="flex justify-between mb-1">
                              <span className="text-muted-foreground">Data de Análise:</span>
                              <span>{doc.dataAnalise}</span>
                            </div>
                          )}
                        </div>
                        
                        {doc.motivoRejeicao && (
                          <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                            <p className="font-medium">Motivo da rejeição:</p>
                            <p>{doc.motivoRejeicao}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Visualizar
                          </Button>
                          
                          {doc.status === "rejeitado" && (
                            <Button 
                              className="flex-1"
                              onClick={() => handleReenviarDocumento(doc)}
                            >
                              <FileUp className="h-4 w-4 mr-1" />
                              Reenviar
                            </Button>
                          )}
                          
                          {doc.status === "aprovado" && (
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                toast.success("Download iniciado");
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileX className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Nenhum documento enviado</p>
                  <p className="text-muted-foreground text-center">
                    Você ainda não enviou nenhum documento. Confira a aba "Documentos Pendentes".
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="todos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lista Completa de Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Documento</TableHead>
                        <TableHead>Obrigatório</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data de Envio</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tiposDocumentosApplicaveis.map((tipo) => {
                        const docExistente = documentosAluno.find(d => d.tipoDocumentoId === tipo.id);
                        
                        return (
                          <TableRow key={tipo.id}>
                            <TableCell className="flex items-center">
                              {tipo.nome}
                              {renderRequisitoInfo(tipo)}
                            </TableCell>
                            <TableCell>{tipo.obrigatorio ? "Sim" : "Não"}</TableCell>
                            <TableCell>
                              {docExistente ? renderStatusBadge(docExistente.status) : (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pendente</Badge>
                              )}
                            </TableCell>
                            <TableCell>{docExistente?.dataEnvio || "-"}</TableCell>
                            <TableCell className="text-right">
                              {!docExistente ? (
                                <Button 
                                  size="sm"
                                  onClick={() => handleOpenUploadDialog(tipo)}
                                >
                                  Enviar
                                </Button>
                              ) : docExistente.status === "rejeitado" ? (
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReenviarDocumento(docExistente)}
                                >
                                  Reenviar
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewDocument(docExistente)}
                                >
                                  Visualizar
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Documento</DialogTitle>
            <DialogDescription>
              {currentTipoDocumento?.nome} - Formatos aceitos: {currentTipoDocumento?.formatosAceitos.join(", ")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="documento">Selecione o arquivo</Label>
              <Input 
                id="documento" 
                type="file" 
                onChange={handleFileChange} 
                accept={currentTipoDocumento?.formatosAceitos.map(f => `.${f.toLowerCase()}`).join(',')}
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground">
                Tamanho máximo: {currentTipoDocumento ? (currentTipoDocumento.tamanhoMaximo / (1024 * 1024)).toFixed(2) : 5}MB
              </p>
            </div>
            
            {uploading && (
              <div className="space-y-2">
                <Label>Progresso do Upload</Label>
                <Progress value={uploadProgress} />
                <p className="text-xs text-center text-muted-foreground">
                  {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setUploadDialogOpen(false)}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <FileUp className="h-4 w-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {currentDocumento?.tipoDocumento.nome}
              {currentDocumento && renderRequisitoInfo(currentDocumento.tipoDocumento)}
            </DialogTitle>
            <DialogDescription>
              Status: {currentDocumento?.status}
              {currentDocumento?.dataEnvio && ` • Enviado em: ${currentDocumento.dataEnvio}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-4">
            <div className="bg-muted rounded-md p-4 w-full h-64 flex items-center justify-center">
              <p className="text-muted-foreground">
                Visualização do documento não disponível nesta versão.
              </p>
            </div>
          </div>
          
          {currentDocumento?.motivoRejeicao && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm mb-4">
              <p className="font-medium">Motivo da rejeição:</p>
              <p>{currentDocumento.motivoRejeicao}</p>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
            >
              Fechar
            </Button>
            
            {currentDocumento?.status === "rejeitado" && (
              <Button
                onClick={() => {
                  setViewDialogOpen(false);
                  handleReenviarDocumento(currentDocumento);
                }}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Reenviar
              </Button>
            )}
            
            {currentDocumento?.status === "aprovado" && (
              <Button
                variant="outline"
                onClick={() => {
                  toast.success("Download iniciado");
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentosAluno;
