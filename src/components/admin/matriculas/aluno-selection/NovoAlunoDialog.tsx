
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
import { Info, CheckCircle, Loader2 } from "lucide-react";
import { NovoAlunoForm } from "./types";

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
}) => {
  // Função para validar o email
  const isEmailValid = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Verificar se o formulário tem os campos mínimos preenchidos corretamente
  const isFormValid = (): boolean => {
    return !!formData.nome && isEmailValid(formData.email);
  };

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Aluno</DialogTitle>
          <DialogDescription>
            Preencha os dados do aluno para cadastrá-lo na plataforma LearnWorlds e no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <Alert variant="default" className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Integração API Direta</AlertTitle>
          <AlertDescription className="text-green-600">
            O cadastro será realizado diretamente na API da plataforma LearnWorlds da sua escola (grupozayneducacional.com.br/admin/api).
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="nome" className="text-right">
                Nome*
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="mt-1"
                required
                placeholder="Nome"
                disabled={loading}
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
                placeholder="Sobrenome"
                disabled={loading}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-right">
              E-mail*
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 ${formData.email && !isEmailValid(formData.email) ? 'border-red-500' : ''}`}
              required
              placeholder="aluno@exemplo.com"
              disabled={loading}
            />
            {formData.email && !isEmailValid(formData.email) && (
              <p className="text-red-500 text-sm mt-1">Email inválido</p>
            )}
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
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              O CPF será armazenado no campo customField1 do LearnWorlds
            </p>
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
              disabled={loading}
            />
          </div>
        </div>
        
        <Alert className="mt-2">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Nome e e-mail são campos obrigatórios para o cadastro na plataforma LearnWorlds.
          </AlertDescription>
        </Alert>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleCriarNovoAluno}
            disabled={loading || !isFormValid()}
            className="min-w-[150px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Cadastrar Aluno"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoAlunoDialog;
