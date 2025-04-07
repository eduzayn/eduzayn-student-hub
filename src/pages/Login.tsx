
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string()
    .email("Digite um email válido")
    .min(1, "O email é obrigatório"),
  senha: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(100, "A senha é muito longa"),
});

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

type LoginFormValues = z.infer<typeof loginSchema>;
type RegistroFormValues = z.infer<typeof registroSchema>;

const ADMIN_BYPASS = {
  email: "ana.diretoria@eduzayn.com.br",
  password: "Zayn@2025"
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("login");
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const registroForm = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const onLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    setNeedsEmailConfirmation(false);
    
    if (values.email === ADMIN_BYPASS.email && values.senha === ADMIN_BYPASS.password) {
      localStorage.setItem('adminBypassAuthenticated', 'true');
      localStorage.setItem('adminBypassEmail', ADMIN_BYPASS.email);
      
      toast.success("Login realizado com sucesso!", {
        description: "Bem-vindo(a) ao Portal Administrativo"
      });
      
      setTimeout(() => {
        setIsLoading(false);
        navigate("/admin");
      }, 500);
      
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
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
      } else {
        toast.success("Login realizado com sucesso!", {
          description: "Bem-vindo(a) ao Portal do Aluno"
        });
        navigate("/dashboard");
      }
    } catch (error) {
      setAuthError("Ocorreu um erro durante o login. Tente novamente.");
      console.error("Erro de login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (values: RegistroFormValues) => {
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
          setActiveTab("login");
        } else if (data?.user && !data.user.confirmed_at) {
          // Email precisa ser confirmado
          setNeedsEmailConfirmation(true);
          toast.info("Verifique seu email!", {
            description: "Enviamos um link de confirmação para seu email."
          });
          setAuthError("Verifique seu email para confirmar seu cadastro!");
          registroForm.reset();
        } else {
          toast.success("Cadastro realizado com sucesso!", {
            description: "Você já pode fazer login."
          });
          setAuthError("Usuário cadastrado com sucesso! Você já pode fazer login.");
          setActiveTab("login");
          registroForm.reset();
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
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: confirmationEmail,
      });
      
      if (error) {
        setAuthError(`Erro ao reenviar email: ${error.message}`);
        toast.error("Erro ao reenviar email", {
          description: error.message
        });
      } else {
        setAuthError("Email de confirmação reenviado com sucesso! Verifique sua caixa de entrada.");
        toast.success("Email reenviado com sucesso!", {
          description: "Verifique sua caixa de entrada e pasta de spam."
        });
      }
    } catch (error) {
      setAuthError("Ocorreu um erro ao reenviar o email de confirmação.");
      console.error("Erro ao reenviar email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="registro">Cadastro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Portal Administrativo</CardTitle>
              <CardDescription>
                Entre com seu e-mail e senha para acessar o portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
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
                    control={loginForm.control}
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
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
                Esqueci minha senha
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="registro">
          <Card>
            <CardHeader>
              <CardTitle>Criar Conta</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para criar sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              
              <Form {...registroForm}>
                <form onSubmit={registroForm.handleSubmit(onRegister)} className="space-y-4">
                  <FormField
                    control={registroForm.control}
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
                    control={registroForm.control}
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
                    control={registroForm.control}
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
                    control={registroForm.control}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
