
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Protocolo } from "@/types/comunicacao";

interface ProtocolosListProps {
  protocolos: Protocolo[];
  isLoading: boolean;
  onSelect: (protocolo: Protocolo) => void;
}

export const ProtocolosList: React.FC<ProtocolosListProps> = ({ 
  protocolos, 
  isLoading, 
  onSelect 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (protocolos.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">Nenhum protocolo encontrado</h3>
        <p className="text-muted-foreground mt-1">
          Você não possui protocolos com esse status.
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'em_andamento':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'respondido':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'encerrado':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberto':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Aberto</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Em andamento</Badge>;
      case 'respondido':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Respondido</Badge>;
      case 'encerrado':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Encerrado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getSetorBadge = (setor: string) => {
    switch (setor) {
      case 'secretaria':
        return <Badge variant="secondary">Secretaria</Badge>;
      case 'tutoria':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">Tutoria</Badge>;
      case 'financeiro':
        return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Financeiro</Badge>;
      case 'suporte':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Suporte</Badge>;
      default:
        return <Badge variant="secondary">Geral</Badge>;
    }
  };

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Protocolo</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead className="w-[130px]">Setor</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[180px]">Data</TableHead>
            <TableHead className="w-[100px]">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {protocolos.map((protocolo) => (
            <TableRow key={protocolo.id}>
              <TableCell className="font-medium">{protocolo.numero}</TableCell>
              <TableCell>{protocolo.titulo}</TableCell>
              <TableCell>{getSetorBadge(protocolo.setor)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(protocolo.status)}
                  {getStatusBadge(protocolo.status)}
                </div>
              </TableCell>
              <TableCell>
                {new Date(protocolo.dataCriacao).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelect(protocolo)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
