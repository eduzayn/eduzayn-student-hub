
import React from "react";
import { Link } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthTabsProps {
  defaultTab?: string;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ defaultTab = "login" }) => {
  const [activeTab, setActiveTab] = React.useState<string>(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs 
      defaultValue={defaultTab} 
      value={activeTab} 
      onValueChange={handleTabChange} 
      className="w-full"
    >
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
            <LoginForm onSwitchTab={handleTabChange} />
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
            <RegisterForm onSwitchTab={handleTabChange} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
