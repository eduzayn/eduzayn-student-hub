
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Clock, Video, File, BookOpen, CheckCircle } from "lucide-react";

interface Aula {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: string;
  duracao: number;
  ordem: number;
  url: string | null;
}

interface ModuloItemProps {
  modulo: {
    id: string;
    titulo: string;
    descricao: string | null;
    ordem: number;
    aulas: Aula[];
  };
  formatarDuracao: (minutos: number) => string;
}

const ModuloItem: React.FC<ModuloItemProps> = ({ modulo, formatarDuracao }) => {
  const getTipoAulaIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'documento':
        return <File className="h-4 w-4" />;
      case 'quiz':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <AccordionItem key={modulo.id} value={modulo.id}>
      <AccordionTrigger>
        <div className="flex items-center gap-2 text-left">
          <Badge variant="outline" className="mr-2">
            {modulo.ordem}
          </Badge>
          <div>
            {modulo.titulo}
            <p className="text-xs text-muted-foreground font-normal">
              {modulo.aulas.length} aulas
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {modulo.descricao && (
          <div className="mb-4 text-muted-foreground">
            {modulo.descricao}
          </div>
        )}
        
        <div className="space-y-2">
          {modulo.aulas.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Nenhuma aula cadastrada neste módulo
            </div>
          ) : (
            modulo.aulas.map((aula) => (
              <div 
                key={aula.id} 
                className="flex items-center justify-between p-3 rounded-md border bg-muted/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    {getTipoAulaIcon(aula.tipo || 'video')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm" className="h-5 px-1">
                        {aula.ordem}
                      </Badge>
                      <p className="font-medium">{aula.titulo}</p>
                    </div>
                    {aula.descricao && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {aula.descricao}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs">{formatarDuracao(aula.duracao || 0)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ModuloItem;
