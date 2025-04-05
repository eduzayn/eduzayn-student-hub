
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  Clock, 
  CreditCard, 
  FileText, 
  Award, 
  MessageSquare, 
  BookOpen 
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Cursos de Alta Qualidade",
    description: "Conteúdo atualizado e produzido por especialistas do mercado.",
  },
  {
    icon: Clock,
    title: "Acesso Vitalício",
    description: "Estude no seu ritmo com acesso permanente ao material do curso.",
  },
  {
    icon: CreditCard,
    title: "Pagamento Facilitado",
    description: "Diversas formas de pagamento com parcelas que cabem no seu bolso.",
  },
  {
    icon: CheckCircle,
    title: "Matrícula Instantânea",
    description: "Comece a estudar imediatamente após a confirmação do pagamento.",
  },
  {
    icon: FileText,
    title: "Documentos Digitais",
    description: "Acesse contratos e documentos acadêmicos em um só lugar.",
  },
  {
    icon: Award,
    title: "Certificado Reconhecido",
    description: "Receba certificados com valor no mercado após concluir seus estudos.",
  },
  {
    icon: MessageSquare,
    title: "Suporte ao Aluno",
    description: "Conte com nossa equipe para resolver dúvidas e problemas.",
  },
  {
    icon: BookOpen,
    title: "Portal Completo",
    description: "Gerencie toda sua vida acadêmica em uma plataforma moderna.",
  },
];

const FeatureHighlights = () => {
  return (
    <section className="eduzayn-section bg-white">
      <div className="eduzayn-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="eduzayn-heading">Por que escolher a EduZayn?</h2>
          <p className="text-gray-600">
            Nossa plataforma oferece uma experiência completa para alunos e instituições, 
            combinando facilidade de matrícula, gestão acadêmica e financeira em um só lugar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
