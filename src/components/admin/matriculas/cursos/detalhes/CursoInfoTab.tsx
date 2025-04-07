
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Curso } from "@/types/matricula";

interface CursoInfoTabProps {
  curso: Curso;
}

const CursoInfoTab: React.FC<CursoInfoTabProps> = ({ curso }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Curso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Código do Curso</h3>
            <p>{curso.codigo}</p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Modalidade</h3>
            <p>{curso.modalidade || 'EAD'}</p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Parcelas</h3>
            <p>{curso.total_parcelas || 12}</p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <Badge variant={curso.ativo ? "success" : "destructive"}>
              {curso.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
          {curso.learning_worlds_id && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">ID na LearnWorlds</h3>
                <p>{curso.learning_worlds_id}</p>
              </div>
            </>
          )}
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Data de Cadastro</h3>
            <p>
              {curso.data_criacao ? new Date(curso.data_criacao).toLocaleDateString('pt-BR') : 'Não disponível'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CursoInfoTab;
