
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileUp } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Documento } from "@/types/documentos";

interface ViewDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documento: Documento | null;
  onReenviar: (doc: Documento) => void;
}

const ViewDocumentDialog: React.FC<ViewDocumentDialogProps> = ({
  isOpen,
  onClose,
  documento,
  onReenviar
}) => {
  if (!documento) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {documento.tipoDocumento.nome}
          </DialogTitle>
          <DialogDescription>
            Status: {documento.status}
            {documento.dataEnvio && ` • Enviado em: ${documento.dataEnvio}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center py-4">
          <div className="bg-muted rounded-md p-4 w-full h-64 flex items-center justify-center">
            <p className="text-muted-foreground">
              Visualização do documento não disponível nesta versão.
            </p>
          </div>
        </div>
        
        {documento.motivoRejeicao && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm mb-4">
            <p className="font-medium">Motivo da rejeição:</p>
            <p>{documento.motivoRejeicao}</p>
          </div>
        )}
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline"
            onClick={onClose}
          >
            Fechar
          </Button>
          
          {documento.status === "rejeitado" && (
            <Button
              onClick={() => {
                onClose();
                onReenviar(documento);
              }}
            >
              <FileUp className="h-4 w-4 mr-2" />
              Reenviar
            </Button>
          )}
          
          {documento.status === "aprovado" && (
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
  );
};

export default ViewDocumentDialog;
