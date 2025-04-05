
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Roberto Silva",
    role: "Estudante de Administração",
    message: "A EduZayn transformou minha experiência acadêmica. O portal do aluno tem tudo o que preciso em um só lugar e os cursos são excelentes!",
    rating: 5,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Carla Mendes",
    role: "Profissional de Marketing",
    message: "Consegui uma promoção no trabalho graças aos conhecimentos adquiridos nos cursos. O certificado tem peso no mercado e o conteúdo é prático.",
    rating: 5,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "André Gomes",
    role: "Empresário",
    message: "Como gestor, valorizo a organização da plataforma. A área financeira é clara e as opções de negociação são flexíveis quando precisamos.",
    rating: 4,
    image: "/placeholder.svg",
  },
];

const renderStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
};

const TestimonialSection = () => {
  return (
    <section className="eduzayn-section bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="eduzayn-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="eduzayn-heading">O que dizem nossos alunos</h2>
          <p className="text-gray-600">
            Conheça as histórias de quem já transformou sua carreira com os cursos da EduZayn
            e aproveitou todos os recursos da nossa plataforma.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.message}"
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
