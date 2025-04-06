import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, UserPlus, Mail, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
});

const signupSchema = z.object({
  first_name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  last_name: z.string().min(2, {
    message: "O sobrenome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  confirmPassword: z.string().min(6, {
    message: "A confirmação deve ter pelo menos 6 caracteres.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem.",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleForceSignIn = async () => {
    if (!emailNotConfirmed) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailNotConfirmed,
        password: loginForm.getValues("password"),
      });
      
      if (data.session) {
        toast({
          title: "Acesso concedido",
          description: "Redirecionando para o dashboard...",
        });
        
        navigate("/dashboard");
        return;
      }
      
      if (error) {
        throw new Error("Não foi possível fazer login. Verifique suas credenciais ou entre em contato com o administrador.");
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Falha ao tentar acessar",
        description: err?.message || "Entre em contato com o administrador.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function onLogin(values: LoginFormValues) {
    setIsLoading(true);
    setEmailNotConfirmed(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        if (error.message === "Email not confirmed" || error.code === "email_not_confirmed") {
          setEmailNotConfirmed(values.email);
          throw new Error("Seu email ainda não foi confirmado. Verifique sua caixa de entrada ou clique no botão abaixo para acessar mesmo assim.");
        }
        throw error;
      }
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao fazer login",
        description: error?.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignup(values: SignupFormValues) {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
            role: 'student'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Por favor, verifique seu email para confirmar sua conta ou entre em contato com o administrador.",
      });
      
      signupForm.reset();
      
      setActiveTab("login");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao criar conta",
        description: error?.message || "Ocorreu um erro ao criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="eduzayn-container py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {activeTab === "login" ? "Acesse sua conta" : "Crie sua conta"}
            </h1>
            <p className="text-gray-600 mt-2">
              {activeTab === "login" 
                ? "Entre para acessar o portal do aluno e seus cursos" 
                : "Cadastre-se para começar sua jornada de aprendizado"}
            </p>
          </div>

          {emailNotConfirmed && (
            <Alert className="mb-6 border-amber-500">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Email não confirmado</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>Seu email ainda não foi confirmado. Por favor, verifique sua caixa de entrada ou spam.</p>
                <Button 
                  variant="outline" 
                  className="w-full border-amber-500 text-amber-600 hover:text-amber-700"
                  onClick={handleForceSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Acessar mesmo assim"
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Acesse o portal do aluno com suas credenciais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  placeholder="seuemail@exemplo.com" 
                                  className="pl-10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  type="password" 
                                  placeholder="Sua senha" 
                                  className="pl-10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                            <div className="text-right">
                              <Link to="#" className="text-sm text-primary hover:underline">
                                Esqueceu a senha?
                              </Link>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Entrando...
                          </>
                        ) : (
                          <>
                            <LogIn className="mr-2 h-4 w-4" />
                            Entrar
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center pt-2">
                  <p className="text-sm text-gray-500">
                    Não tem uma conta?{" "}
                    <button 
                      onClick={() => setActiveTab("signup")}
                      className="text-primary hover:underline font-medium"
                    >
                      Cadastre-se
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Cadastro</CardTitle>
                  <CardDescription>
                    Crie sua conta para acessar os cursos da EduZayn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                      <div className="grid gap-4 grid-cols-2">
                        <FormField
                          control={signupForm.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu nome" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signupForm.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sobrenome</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu sobrenome" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  placeholder="seuemail@exemplo.com" 
                                  className="pl-10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  type="password" 
                                  placeholder="Crie uma senha segura" 
                                  className="pl-10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirme a senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  type="password" 
                                  placeholder="Confirme sua senha" 
                                  className="pl-10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Criar conta
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center pt-2">
                  <p className="text-sm text-gray-500">
                    Já tem uma conta?{" "}
                    <button 
                      onClick={() => setActiveTab("login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Faça login
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
