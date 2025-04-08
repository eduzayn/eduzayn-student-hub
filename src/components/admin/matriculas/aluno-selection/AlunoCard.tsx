
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AlunoCardProps {
  aluno: any;
  selecionado: boolean;
  onSelecionar: (aluno: any) => void;
}

const AlunoCard: React.FC<AlunoCardProps> = ({ aluno, selecionado, onSelecionar }) => {
  return (
    <Card 
      className={`cursor-pointer transition-colors ${selecionado ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
      onClick={() => onSelecionar(aluno)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {aluno.nome.split(' ').map((parte: string) => parte[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{aluno.nome}</p>
                {aluno.learnworlds_id && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    LearnWorlds
                  </Badge>
                )}
                {aluno.id.startsWith('offline-') && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                    Offline
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{aluno.email}</p>
              <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                <span>CPF: {aluno.cpf || 'Não informado'}</span>
                <span>Tel: {aluno.telefone || 'Não informado'}</span>
              </div>
            </div>
          </div>
          
          {selecionado && (
            <CheckCircle className="h-5 w-5 text-primary" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlunoCard;
