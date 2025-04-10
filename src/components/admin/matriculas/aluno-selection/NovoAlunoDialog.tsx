
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NovoAlunoDialogProps } from "./types";
import { Loader2 } from "lucide-react";

const NovoAlunoDialog: React.FC<NovoAlunoDialogProps> = ({
  aberto,
  setAberto,
  formData,
  handleInputChange,
  handleCriarNovoAluno,
  loading
}) => {
  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Aluno</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              placeholder="Nome do aluno"
              value={formData.nome}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sobrenome">Sobrenome</Label>
            <Input
              id="sobrenome"
              name="sobrenome"
              placeholder="Sobrenome do aluno"
              value={formData.sobrenome}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF (opcional)</Label>
            <Input
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone (opcional)</Label>
            <Input
              id="telefone"
              name="telefone"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setAberto(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCriarNovoAluno}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : "Cadastrar Aluno"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovoAlunoDialog;
