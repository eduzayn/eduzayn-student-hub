
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TipoDocumento } from "@/types/documentos";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tipoDocumento: TipoDocumento | null;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
  uploadProgress: number;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  onClose,
  tipoDocumento,
  onUpload,
  uploading = false,
  uploadProgress = 0
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (tipoDocumento && fileExt) {
        const formatosPermitidos = tipoDocumento.formatosAceitos.map(f => f.toLowerCase());
        
        if (!formatosPermitidos.includes(fileExt)) {
          alert(`Formato de arquivo não permitido. Use: ${formatosPermitidos.join(', ')}`);
          return;
        }
        
        if (selectedFile.size > tipoDocumento.tamanhoMaximo) {
          const tamanhoMaxMB = (tipoDocumento.tamanhoMaximo / (1024 * 1024)).toFixed(2);
          alert(`O arquivo é muito grande. Tamanho máximo permitido: ${tamanhoMaxMB}MB`);
          return;
        }
        
        setFile(selectedFile);
      }
    }
  };

  const handleUploadClick = async () => {
    if (file) {
      await onUpload(file);
      setFile(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Documento</DialogTitle>
          <DialogDescription>
            {tipoDocumento?.nome} - Formatos aceitos: {tipoDocumento?.formatosAceitos.join(", ")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="documento">Selecione o arquivo</Label>
            <Input 
              id="documento" 
              type="file" 
              onChange={handleFileChange} 
              accept={tipoDocumento?.formatosAceitos.map(f => `.${f.toLowerCase()}`).join(',')}
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground">
              Tamanho máximo: {tipoDocumento ? (tipoDocumento.tamanhoMaximo / (1024 * 1024)).toFixed(2) : 5}MB
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
            onClick={onClose}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUploadClick} 
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
  );
};

export default UploadDialog;
