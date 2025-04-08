
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle } from "lucide-react";

interface NovoAlunoForm {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  telefone: string;
}

interface NovoAlunoDialogProps {
  aberto: boolean;
  setAberto: (aberto: boolean) => void;
  formData: NovoAlunoForm;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCriarNovoAluno: () => void;
  loading: boolean;
  offlineMode: boolean;
}

const NovoAlunoDialog: React.FC<NovoAlunoDialogProps> = ({
  aberto,
  setAberto,
  formData,
  handleInputChange,
  handleCriarNovoAluno,
  loading,
  offlineMode,
}) => {
  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Aluno</DialogTitle>
          <DialogDescription>
            {offlineMode 
              ? "Você está em modo offline. Os dados serão armazenados localmente até que a conexão seja restabelecida."
              : "Preencha os dados do aluno para cadastrá-lo na plataforma LearnWorlds e no sistema."}
          </DialogDescription>
        </DialogHeader>
        
        {offlineMode && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Modo Offline Ativo</AlertTitle>
            <AlertDescription>
              A conexão com a API do LearnWorlds está indisponível. Você pode cadastrar o aluno no modo offline, 
              mas ele será sincronizado apenas quando a conexão for restabelecida.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="sobrenome" className="text-right">
                Sobrenome
              </Label>
              <Input
                id="sobrenome"
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-right">
              E-mail
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="cpf" className="text-right">
              CPF
            </Label>
            <Input
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="000.000.000-00"
            />
          </div>
          
          <div>
            <Label htmlFor="telefone" className="text-right">
              Telefone
            </Label>
            <Input
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleCriarNovoAluno}
            disabled={loading || !formData.nome || !formData.email}
          >
            {loading ? "Cadastrando..." : offlineMode ? "Cadastrar Offline" : "Cadastrar Aluno"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoAlunoDialog;
