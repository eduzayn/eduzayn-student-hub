
import React from "react";
import { Certificado } from "@/types/certificados";
import CertificadoCard from "./CertificadoCard";
import { BookOpen } from "lucide-react";

interface CertificadosGridProps {
  certificados: Certificado[];
  onVerificarRequisitos: (cursoId: string) => void;
  onSolicitarCertificado: (cursoId: string) => void;
  onDownloadCertificado: (certificadoId: string) => void;
  onDetalhes?: (certificado: Certificado) => void; // Nova prop adicionada
  children?: React.ReactNode;
}

const CertificadosGrid: React.FC<CertificadosGridProps> = ({
  certificados,
  onVerificarRequisitos,
  onSolicitarCertificado,
  onDownloadCertificado,
  onDetalhes,
  children
}) => {
  if (certificados.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">
          Você não tem certificados disponíveis no momento.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Ao concluir seus cursos e cumprir os requisitos, seus certificados ficarão disponíveis aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children ? children : certificados.map((certificado) => (
        <CertificadoCard
          key={certificado.id}
          certificado={certificado}
          onVerificarRequisitos={onVerificarRequisitos}
          onSolicitarCertificado={onSolicitarCertificado}
          onDownloadCertificado={onDownloadCertificado}
          onDetalhes={onDetalhes}
        />
      ))}
    </div>
  );
};

export default CertificadosGrid;
