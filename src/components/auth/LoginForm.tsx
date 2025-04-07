import React, { useState, useEffect } from "react";
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
import { supabase, setAdminBypassAuthentication, isEmailConfirmationBypassed } from "@/integrations/supabase/client";
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
  const [isSuccessful, setIsSuccessful] = useState(false);
  const navigate = useNavigate();
  const bypassEmailConfirmation = isEmailConfirmationBypassed();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  // Limpar qualquer estado de autenticação anterior ao carregar o componente
  useEffect(() => {
    // Apenas para desenvolvimento - facilita o login após reload
    // supabase.auth.signOut();
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    setNeedsEmailConfirmation(false);
    setIsSuccessful(false);
    
    // Verificar se é um login de administrador por bypass
    const isAdminBypassCredentials = values.email === ADMIN_BYPASS.email && values.senha === ADMIN_BYPASS.password;
    // Verificar se é um email administrativo (para redirecionar corretamente)
    const isAdminEmail = ADMIN_EMAILS.includes(values.email.toLowerCase());
    
    if (isAdminBypassCredentials) {
      console.log("Login bypass de administrador iniciado");
      
      // Usar a nova função de configuração de bypass
      setAdminBypassAuthentication(ADMIN_BYPASS.email);
      
      toast.success("Login realizado com sucesso!", {
        description: "Bem-vindo(a) ao Portal Administrativo"
      });
      
      setIsSuccessful(true);
      
      // Garantir que todos os estados e localStorage sejam atualizados antes de redirecionar
      setTimeout(() => {
        setIsLoading(false);
        console.log("Redirecionando para /admin após login bypass");
        navigate("/admin", { replace: true });
      }, 1000);
      
      return;
    }
    
    try {
      console.log("Tentando login com email:", values.email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.senha,
      });

      if (error) {
        console.error("Erro de login:", error.message);
        
        // Se o bypass de confirmação de email estiver ativo, tentar automaticamente concluir o registro
        if (bypassEmailConfirmation && (
          error.message.includes("Email not confirmed") || 
          error.message.toLowerCase().includes("email não confirmado"))
        ) {
          console.log("Email não confirmado, mas bypass está ativo. Tentando login novamente após pequeno delay...");
          
          // Mostrar mensagem para o usuário indicando que o sistema está processando
          toast.info("Processando seu login...", {
            description: "Aguarde um momento enquanto configuramos sua conta."
          });
          
          // Tentar login novamente após um pequeno delay
          setTimeout(async () => {
            try {
              const secondAttempt = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.senha,
              });
              
              if (secondAttempt.error) {
                console.error("Segunda tentativa falhou:", secondAttempt.error.message);
                setAuthError("Não foi possível fazer login. Tente novamente ou contate o suporte.");
                setIsLoading(false);
              } else {
                console.log("Login concluído com sucesso após segunda tentativa");
                handleSuccessfulLogin(isAdminEmail);
              }
            } catch (err) {
              console.error("Erro na segunda tentativa:", err);
              setAuthError("Ocorreu um erro durante o login. Tente novamente.");
              setIsLoading(false);
            }
          }, 1500);
          
          return;
        }
        
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
        handleSuccessfulLogin(isAdminEmail);
      }
    } catch (error) {
      setAuthError("Ocorreu um erro durante o login. Tente novamente.");
      console.error("Erro de login:", error);
      setIsLoading(false);
    }
  };
  
  const handleSuccessfulLogin = (isAdminEmail: boolean) => {
    console.log("Login bem-sucedido");
    
    toast.success("Login realizado com sucesso!", {
      description: isAdminEmail ? "Bem-vindo(a) ao Portal Administrativo" : "Bem-vindo(a) ao Portal do Aluno"
    });
    
    setIsSuccessful(true);
    
    // Garantir que a sessão seja processada antes de redirecionar
    setTimeout(() => {
      setIsLoading(false);
      
      // Forçar refresh da sessão antes de redirecionar
      supabase.auth.refreshSession().then(() => {
        // Redirecionar com base no tipo de email
        const redirectPath = isAdminEmail ? "/admin" : "/dashboard";
        console.log(`Redirecionando para ${redirectPath} após login normal`);
        navigate(redirectPath, { replace: true });
      });
    }, 1000);
  };

  // Função simplificada para reenvio apenas para exibição na interface
  const resendConfirmationEmail = async () => {
    toast.info("Verificação de email desativada!", {
      description: "A verificação por email está temporariamente desativada."
    });
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
      
      {bypassEmailConfirmation && (
        <Alert variant="default" className="bg-yellow-50 border-yellow-200 mb-4">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700">
            Modo de desenvolvimento: confirmação de email desativada
          </AlertDescription>
        </Alert>
      )}
      
      {isSuccessful && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Login realizado com sucesso! Redirecionando...
          </AlertDescription>
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
          <Button type="submit" className="w-full" disabled={isLoading || isSuccessful}>
            {isLoading ? "Entrando..." : isSuccessful ? "Redirecionando..." : "Entrar"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
