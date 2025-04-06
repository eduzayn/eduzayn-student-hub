
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileUp, FileCheck, FileX, Eye, Download } from "lucide-react";

const DocumentosAluno: React.FC = () => {
  // Dados mock dos documentos
  const documentos = [
    {
      id: 1,
      nome: "RG / Documento de Identidade",
      tipo: "documento_pessoal",
      status: "aprovado" as const,
      obrigatorio: true,
      formatosAceitos: ["PDF", "JPG", "PNG"],
      tamanhoMaximo: "5MB",
      dataEnvio: "10/01/2025",
      dataAnalise: "12/01/2025",
      url: "#"
    },
    {
      id: 2,
      nome: "CPF",
      tipo: "documento_pessoal",
      status: "aprovado" as const,
      obrigatorio: true,
      formatosAceitos: ["PDF", "JPG", "PNG"],
      tamanhoMaximo: "5MB",
      dataEnvio: "10/01/2025",
      dataAnalise: "12/01/2025",
      url: "#"
    },
    {
      id: 3,
      nome: "Comprovante de Residência",
      tipo: "documento_pessoal",
      status: "rejeitado" as const,
      obrigatorio: true,
      formatosAceitos: ["PDF", "JPG", "PNG"],
      tamanhoMaximo: "5MB",
      dataEnvio: "10/01/2025",
      dataAnalise: "12/01/2025",
      url: "#",
      motivoRejeicao: "Documento ilegível ou com data expirada."
    },
    {
      id: 4,
      nome: "Diploma de Graduação",
      tipo: "documento_academico",
      status: "pendente" as const,
      obrigatorio: true,
      formatosAceitos: ["PDF"],
      tamanhoMaximo: "10MB"
    },
    {
      id: 5,
      nome: "Histórico Escolar",
      tipo: "documento_academico",
      status: "em_analise" as const,
      obrigatorio: true,
      formatosAceitos: ["PDF"],
      tamanhoMaximo: "10MB",
      dataEnvio: "15/03/2025"
    },
    {
      id: 6,
      nome: "Foto 3x4",
      tipo: "documento_pessoal",
      status: "pendente" as const,
      obrigatorio: false,
      formatosAceitos: ["JPG", "PNG"],
      tamanhoMaximo: "2MB"
    }
  ];
  
  // Filtra documentos por status
  const documentosPendentes = documentos.filter(doc => doc.status === "pendente");
  const documentosEnviados = documentos.filter(doc => ["em_analise", "aprovado", "rejeitado"].includes(doc.status));
  
  // Função para renderizar o badge do status
  const renderStatusBadge = (status: string) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
        <p className="text-muted-foreground">
          Gerencie seus documentos acadêmicos e cadastrais.
        </p>
      </div>
      
      <Tabs defaultValue="pendentes" className="w-full">
        <TabsList>
          <TabsTrigger value="pendentes">Documentos Pendentes</TabsTrigger>
          <TabsTrigger value="enviados">Documentos Enviados</TabsTrigger>
          <TabsTrigger value="todos">Todos os Documentos</TabsTrigger>
        </TabsList>
        
        {/* Tab de Documentos Pendentes */}
        <TabsContent value="pendentes" className="mt-6">
          {documentosPendentes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {documentosPendentes.map(doc => (
                <Card key={doc.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{doc.nome}</CardTitle>
                      {doc.obrigatorio && (
                        <Badge variant="destructive">Obrigatório</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <p>Formatos aceitos: {doc.formatosAceitos.join(", ")}</p>
                        <p>Tamanho máximo: {doc.tamanhoMaximo}</p>
                      </div>
                      
                      <div className="flex justify-center">
                        <button className="flex items-center justify-center w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-4 rounded-md font-medium gap-2">
                          <FileUp className="h-5 w-5" />
                          Enviar Documento
                        </button>
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
        
        {/* Tab de Documentos Enviados */}
        <TabsContent value="enviados" className="mt-6">
          {documentosEnviados.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {documentosEnviados.map(doc => (
                <Card key={doc.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{doc.nome}</CardTitle>
                      {renderStatusBadge(doc.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Data de Envio:</span>
                          <span>{doc.dataEnvio}</span>
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
                        <button className="flex items-center justify-center flex-1 bg-muted hover:bg-muted/80 py-2 px-3 rounded-md text-sm font-medium gap-1">
                          <Eye className="h-4 w-4" />
                          Visualizar
                        </button>
                        
                        {doc.status === "rejeitado" && (
                          <button className="flex items-center justify-center flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-3 rounded-md text-sm font-medium gap-1">
                            <FileUp className="h-4 w-4" />
                            Reenviar
                          </button>
                        )}
                        
                        {doc.status === "aprovado" && (
                          <button className="flex items-center justify-center flex-1 bg-muted hover:bg-muted/80 py-2 px-3 rounded-md text-sm font-medium gap-1">
                            <Download className="h-4 w-4" />
                            Download
                          </button>
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
        
        {/* Tab de Todos os Documentos */}
        <TabsContent value="todos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lista Completa de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Documento</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Obrigatório</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Data de Envio</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.map(doc => (
                      <tr key={doc.id} className="border-b">
                        <td className="py-3 px-4">{doc.nome}</td>
                        <td className="py-3 px-4">{doc.obrigatorio ? "Sim" : "Não"}</td>
                        <td className="py-3 px-4">{renderStatusBadge(doc.status)}</td>
                        <td className="py-3 px-4">{doc.dataEnvio || "-"}</td>
                        <td className="py-3 px-4 text-right">
                          {doc.status === "pendente" ? (
                            <button className="bg-primary text-primary-foreground hover:bg-primary/90 py-1 px-3 rounded-md text-sm">
                              Enviar
                            </button>
                          ) : doc.status === "rejeitado" ? (
                            <button className="bg-amber-500 text-white hover:bg-amber-600 py-1 px-3 rounded-md text-sm">
                              Reenviar
                            </button>
                          ) : (
                            <button className="bg-muted hover:bg-muted/80 py-1 px-3 rounded-md text-sm">
                              Visualizar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentosAluno;
