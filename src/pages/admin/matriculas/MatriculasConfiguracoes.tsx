
import React, { useState } from "react";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Settings2, MailCheck, Database, Link } from "lucide-react";

const MatriculasConfiguracoes: React.FC = () => {
  const [activeTab, setActiveTab] = useState("geral");
  
  const form = useForm({
    defaultValues: {
      habilitar_notificacoes: true,
      usar_api_externa: false,
      permitir_matriculas_offline: true,
      url_api: "https://api.learnworlds.com/v2",
      formato_email: "html",
      modo_debug: false
    }
  });

  const handleSalvar = () => {
    const values = form.getValues();
    console.log("Configurações salvas:", values);
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <MatriculasLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Configurações do Módulo de Matrículas</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="geral" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="integracao" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Integração
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <MailCheck className="h-4 w-4" />
              E-mail
            </TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <TabsContent value="geral">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Ajuste as configurações gerais do sistema de matrículas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="habilitar_notificacoes"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Notificações</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Habilitar notificações para eventos de matrícula
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="permitir_matriculas_offline"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Modo Offline</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Permitir matrículas em modo offline
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="modo_debug"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Modo de Depuração</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Ativar logs detalhados para depuração
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integracao">
              <Card>
                <CardHeader>
                  <CardTitle>Integração API</CardTitle>
                  <CardDescription>
                    Configure a integração com a API do LearnWorlds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="usar_api_externa"
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Usar API Externa</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Conectar com API externa para processamento de matrículas
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="url_api"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da API</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-sm text-blue-700">
                      Atenção: Para alterar as chaves de API, acesse as configurações avançadas no painel de administração.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de E-mail</CardTitle>
                  <CardDescription>
                    Personalize as notificações por e-mail
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="formato_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formato de E-mail</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um formato" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="html">HTML</SelectItem>
                            <SelectItem value="texto">Texto Simples</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <p className="text-sm text-muted-foreground">
                    Os templates de e-mail podem ser personalizados no editor de templates.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Form>
          
          <div className="mt-6 flex justify-end">
            <Button variant="outline" className="mr-2">
              Cancelar
            </Button>
            <Button onClick={handleSalvar}>
              Salvar Configurações
            </Button>
          </div>
        </Tabs>
      </div>
    </MatriculasLayout>
  );
};

export default MatriculasConfiguracoes;
