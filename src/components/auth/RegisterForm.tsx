import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase, isEmailConfirmationBypassed } from "@/integrations/supabase/client";
import { toast } from "sonner";

const registroSchema = z.object({
  nome: z.string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  email: z.string()
    .email("Digite um email válido")
    .min(1, "O email é obrigatório"),
  senha: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(100, "A senha é muito longa"),
  confirmarSenha: z.string()
    .min(1, "Confirme sua senha"),
}).refine(data => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

export type RegistroFormValues = z.infer<typeof registroSchema>;

interface RegisterFormProps {
  onSwitchTab: (tab: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchTab }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState<string>("");
  const bypassEmailConfirmation = isEmailConfirmationBypassed();

  const form = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = async (values: RegistroFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    setNeedsEmailConfirmation(false);
    
    try {
      console.log("Iniciando registro para:", values.email);
      console.log("Bypass de confirmação de email:", bypassEmailConfirmation ? "ATIVADO" : "DESATIVADO");
      
      const { error, data } = await supabase.auth.signUp({
        email: values.email,
        password: values.senha,
        options: {
          data: {
            full_name: values.nome,
          },
          emailRedirectTo: bypassEmailConfirmation ? undefined : window.location.origin + '/login'
        }
      });

      if (error) {
        console.error("Erro ao registrar:", error.message);
        setAuthError(error.message);
      } else {
        setConfirmationEmail(values.email);
        
        if (data?.user?.identities?.length === 0) {
          console.log("Email já cadastrado, redirecionando para login");
          setAuthError("Este email já está cadastrado. Por favor, tente fazer login.");
          onSwitchTab("login");
        } else if (!bypassEmailConfirmation && data?.user && !data.user.confirmed_at) {
          console.log("Email precisa ser confirmado (bypass desativado)");
          
          setNeedsEmailConfirmation(true);
          toast.info("Verificação de email desativada!", {
            description: "Normalmente enviamos um link de confirmação, mas esta função está temporariamente desativada."
          });
          setAuthError("Registro realizado com sucesso! Em um ambiente de produção, você receberia um email de confirmação.");
          form.reset();
        } else {
          console.log("Registro concluído com sucesso");
          toast.success("Cadastro realizado com sucesso!", {
            description: "Você já pode fazer login."
          });
          setAuthError(null);
          onSwitchTab("login");
          form.reset();
        }
      }
    } catch (error: any) {
      console.error("Erro não tratado durante o registro:", error);
      setAuthError("Ocorreu um erro durante o registro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmationEmail = async () => {
    toast.info("Função de confirmação de email desativada", {
      description: "A verificação por email está temporariamente desativada."
    });
  };

  return (
    <>
      {authError && (
        <Alert variant={needsEmailConfirmation ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
          
          {needsEmailConfirmation && !bypassEmailConfirmation && (
            <Button 
              variant="link" 
              onClick={resendConfirmationEmail} 
              disabled={isLoading} 
              className="mt-2 p-0"
            >
              Reenviar email de confirmação
            </Button>
          )}
        </Alert>
      )}
      
      {bypassEmailConfirmation && (
        <Alert variant="default" className="bg-yellow-50 border-yellow-200 mb-4">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700">
            A confirmação de email está temporariamente desativada. Registros são concluídos automaticamente.
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu Nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmarSenha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirme a Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
