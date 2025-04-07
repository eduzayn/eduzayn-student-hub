import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

const loginSchema = z.object({
  email: z.string()
    .email("Digite um email válido")
    .min(1, "O email é obrigatório"),
  senha: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(100, "A senha é muito longa"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchTab: (tab: string) => void;
}

// Ampliando a lista de emails administrativos
export const ADMIN_EMAILS = [
  "ana.diretoria@eduzayn.com.br",
  "marco.diretoria@eduzayn.com.br",
  "admin@eduzayn.com.br"
];

export const ADMIN_BYPASS = {
  email: "ana.diretoria@eduzayn.com.br",
  password: "Zayn@2025"
};

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchTab }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState<string>("");
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    setNeedsEmailConfirmation(false);
    
    // Verificar se é um login de administrador por bypass
    const isAdminBypassCredentials = values.email === ADMIN_BYPASS.email && values.senha === ADMIN_BYPASS.password;
    // Verificar se é um email administrativo (para redirecionar corretamente)
    const isAdminEmail = ADMIN_EMAILS.includes(values.email.toLowerCase());
    
    if (isAdminBypassCredentials) {
      localStorage.setItem('adminBypassAuthenticated', 'true');
      localStorage.setItem('adminBypassEmail', ADMIN_BYPASS.email);
      
      toast.success("Login realizado com sucesso!", {
        description: "Bem-vindo(a) ao Portal Administrativo"
      });
      
      // Aguardar um pouco para garantir que o localStorage seja atualizado
      setTimeout(() => {
        setIsLoading(false);
        navigate("/admin");
      }, 1000);
      
      return;
    }
    
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.senha,
      });

      if (error) {
        console.error("Erro de login:", error.message);
        
        // Verificar diferentes tipos de erros
        if (error.message.includes("Email not confirmed") || 
            error.message.toLowerCase().includes("email não confirmado") ||
            error.message.includes("Invalid login credentials")) {
          setNeedsEmailConfirmation(true);
          setConfirmationEmail(values.email);
          setAuthError("Seu email ainda não foi confirmado ou as credenciais são inválidas. Por favor, verifique sua caixa de entrada ou solicite um novo link de confirmação.");
        } else {
          setAuthError(error.message);
        }
        setIsLoading(false);
      } else {
        toast.success("Login realizado com sucesso!", {
          description: isAdminEmail ? "Bem-vindo(a) ao Portal Administrativo" : "Bem-vindo(a) ao Portal do Aluno"
        });
        
        // Aguardar um pouco para garantir que a sessão seja processada corretamente
        setTimeout(() => {
          setIsLoading(false);
          // Redirecionar com base no tipo de email
          navigate(isAdminEmail ? "/admin" : "/dashboard");
        }, 1000);
      }
    } catch (error) {
      setAuthError("Ocorreu um erro durante o login. Tente novamente.");
      console.error("Erro de login:", error);
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
      setAuthError("Ocorreu um erro ao reenviar o email de confirmação.");
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
