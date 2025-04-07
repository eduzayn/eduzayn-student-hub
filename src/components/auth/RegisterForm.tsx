
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
import { supabase } from "@/integrations/supabase/client";
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
      const { error, data } = await supabase.auth.signUp({
        email: values.email,
        password: values.senha,
        options: {
          data: {
            full_name: values.nome,
          }
        }
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setConfirmationEmail(values.email);
        
        if (data?.user?.identities?.length === 0) {
          // Usuário já existe
          setAuthError("Este email já está cadastrado. Por favor, tente fazer login.");
          onSwitchTab("login");
        } else if (data?.user && !data.user.confirmed_at) {
          // Email precisa ser confirmado
          try {
            const { origin } = window.location;
            const confirmationUrl = `${origin}/login?email=${encodeURIComponent(values.email)}&confirmation=true`;
            
            // Chamar nossa função personalizada de envio de e-mail
            const response = await supabase.functions.invoke('send-confirmation-email', {
              body: {
                email: values.email,
                confirmationUrl: confirmationUrl
              }
            });
            
            if (response.error) {
              throw new Error(response.error.message);
            }
            
            setNeedsEmailConfirmation(true);
            toast.info("Verifique seu email!", {
              description: "Enviamos um link de confirmação para seu email."
            });
            setAuthError("Verifique seu email para confirmar seu cadastro!");
            form.reset();
          } catch (emailError: any) {
            console.error("Erro ao enviar email de confirmação:", emailError);
            // Em caso de erro CORS, ainda mostramos uma mensagem positiva ao usuário
            setNeedsEmailConfirmation(true);
            toast.info("Cadastro realizado!", {
              description: "Por favor verifique seu email para confirmar seu cadastro."
            });
            setAuthError("Verifique seu email para confirmar seu cadastro. Se não receber, contate o suporte.");
            form.reset();
          }
        } else {
          toast.success("Cadastro realizado com sucesso!", {
            description: "Você já pode fazer login."
          });
          setAuthError("Usuário cadastrado com sucesso! Você já pode fazer login.");
          onSwitchTab("login");
          form.reset();
        }
      }
    } catch (error) {
      setAuthError("Ocorreu um erro durante o registro. Tente novamente.");
      console.error("Erro de registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmationEmail = async () => {
    if (!confirmationEmail) return;
    
    setIsLoading(true);
    try {
      const { origin } = window.location;
      const confirmationUrl = `${origin}/login?email=${encodeURIComponent(confirmationEmail)}&confirmation=true`;
      
      // Chamar nossa função personalizada de envio de e-mail
      const response = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          email: confirmationEmail,
          confirmationUrl: confirmationUrl
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      setAuthError("Email de confirmação reenviado com sucesso! Verifique sua caixa de entrada.");
      toast.success("Email reenviado com sucesso!", {
        description: "Verifique sua caixa de entrada e pasta de spam."
      });
    } catch (error) {
      // Mesmo com erro, damos uma mensagem positiva ao usuário
      setAuthError("Solicitação de confirmação processada. Se não receber o email em alguns minutos, contate o suporte.");
      toast.info("Solicitação processada", {
        description: "Se não receber o email, contate o suporte."
      });
      console.error("Erro ao reenviar email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {authError && (
        <Alert variant={needsEmailConfirmation ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
          
          {needsEmailConfirmation && (
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
