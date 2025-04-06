
// Define proper types for our courses
export type CourseModule = {
  module: string;
  hours: number;
};

export type BaseCourse = {
  id: number;
  title: string;
  category: string;
  duration: string;
  modalidade: string;
  price: string;
  originalPrice: string;
  payment: string;
  certification: string;
  image: string;
  description: string;
  requirements: string[];
  benefits: string[];
};

export type CourseWithEmenta = BaseCourse & {
  ementa: string[];
};

export type CourseWithCurriculum = BaseCourse & {
  curriculum: CourseModule[];
  totalHours: string;
};

export type Course = CourseWithEmenta | CourseWithCurriculum;

// Dados simulados para os cursos
const mockCourses: Record<string, Course> = {
  // Curso básico padrão
  "176": {
    id: 176,
    title: "Neuropsicopedagogia Institucional, Clínica e Hospitalar",
    category: "Pós-Graduação",
    duration: "6 meses",
    modalidade: "Online",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    payment: "1 matrícula de R$ 150,00 + 16x de R$ 155,00",
    certification: "Certificado de Pós-Graduação",
    image: "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png",
    description: "Este curso de pós-graduação em Neuropsicopedagogia Institucional, Clínica e Hospitalar prepara profissionais para atuar na avaliação, diagnóstico e intervenção em distúrbios de aprendizagem no contexto clínico, hospitalar e institucional.",
    requirements: [
      "Diploma de graduação em áreas relacionadas à educação ou saúde",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Fundamentos da Neuropsicopedagogia",
      "Neurociências e Aprendizagem",
      "Avaliação Neuropsicopedagógica",
      "Intervenção Neuropsicopedagógica",
      "Neuropsicopedagogia Institucional",
      "Neuropsicopedagogia Clínica",
      "Neuropsicopedagogia Hospitalar",
      "Transtornos e Distúrbios de Aprendizagem"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Plataforma de aprendizado intuitiva",
      "Tutores especializados",
      "Avaliações online",
      "Flexibilidade de horários"
    ]
  },
  
  // Adicionar curso com ID 1
  "1": {
    id: 1,
    title: "Gestão de Projetos",
    category: "Administração",
    duration: "60 horas",
    modalidade: "Online",
    price: "R$ 597,00",
    originalPrice: "R$ 797,00",
    payment: "1 matrícula de R$ 597,00 + 12x de R$ 59,00",
    certification: "Certificado Profissional",
    image: "/placeholder.svg",
    description: "O curso de Gestão de Projetos proporciona aos participantes conhecimentos avançados em planejamento, execução e controle de projetos em diferentes áreas, utilizando metodologias ágeis e tradicionais para garantir resultados de excelência.",
    requirements: [
      "Ensino médio completo",
      "Conhecimentos básicos em administração",
      "Acesso a computador com internet"
    ],
    ementa: [
      "Fundamentos da Gestão de Projetos",
      "Metodologias Ágeis e Tradicionais",
      "Planejamento e Escopo",
      "Gestão de Riscos",
      "Cronograma e Orçamento",
      "Liderança em Projetos",
      "Ferramentas de Gestão",
      "Estudos de Caso Práticos"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Professores com experiência de mercado",
      "Certificado reconhecido",
      "Estudos de caso reais",
      "Flexibilidade de horários"
    ]
  },
  
  // Curso de Nutrição Esportiva
  "422": {
    id: 422,
    title: "Nutrição Esportiva",
    category: "Pós-Graduação",
    duration: "6 meses",
    modalidade: "Online",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    payment: "1 matrícula de R$ 150,00 + 16x de R$ 155,00",
    certification: "Certificado de Pós-Graduação",
    image: "/placeholder.svg",
    description: "O curso de Pós-Graduação em Nutrição Esportiva prepara profissionais para atuação especializada na área de nutrição aplicada ao esporte e atividade física, fornecendo conhecimentos avançados sobre estratégias nutricionais para melhora do desempenho atlético e recuperação física.",
    requirements: [
      "Diploma de graduação em Nutrição ou áreas relacionadas à saúde",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Fisiologia do exercício aplicada à nutrição",
      "Avaliação nutricional do atleta",
      "Nutrição aplicada a diferentes modalidades esportivas",
      "Suplementação no esporte",
      "Hidratação e desempenho físico",
      "Periodização nutricional",
      "Estratégias nutricionais para competição",
      "Recursos ergogênicos nutricionais"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Plataforma de aprendizado intuitiva",
      "Tutores especializados",
      "Avaliações online",
      "Flexibilidade de horários"
    ]
  },
  
  // Formação Livre em Psicanálise
  "500": {
    id: 500,
    title: "Formação Livre em Psicanálise",
    category: "Formação Livre",
    duration: "12 meses",
    modalidade: "Online",
    price: "R$ 197,00",
    originalPrice: "R$ 297,00",
    payment: "1 matrícula de R$ 197,00 + 12x de R$ 197,00",
    certification: "Certificado de Formação Livre",
    image: "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
    description: "O curso de Formação Livre em Psicanálise oferece uma base sólida para compreensão dos fundamentos teóricos e práticos da psicanálise, permitindo ao aluno desenvolver habilidades para atuação como psicanalista.",
    totalHours: "800 horas",
    curriculum: [
      { module: "Introdução à EAD", hours: 30 },
      { module: "Diversidade Étnico Racial, Gênero e Direitos Humanos", hours: 40 },
      { module: "Formação e Ética do Psicanalista", hours: 40 },
      { module: "Complexo de Édipo e Castração", hours: 40 },
      { module: "Introdução à Psicanálise", hours: 40 },
      { module: "Libido, Pulsões e Sexualidade", hours: 40 },
      { module: "Metodologia da Pesquisa Científica", hours: 40 },
      { module: "Narcisismo e a Cultura da Indiferença", hours: 40 },
      { module: "O Aparelho psíquico, aspectos clínicos e Teóricos", hours: 40 },
      { module: "O Método Psicanalítico", hours: 40 },
      { module: "Práticas e Procedimentos em Clínica", hours: 40 },
      { module: "Processos de Transferência e Resistência", hours: 40 },
      { module: "Psicanálise da Criança e do Adolescente", hours: 40 },
      { module: "Psicanálise II", hours: 40 },
      { module: "Psicopatologias I", hours: 40 },
      { module: "Psicopatologias II", hours: 40 },
      { module: "Sonhos, Simbologia e Representação", hours: 40 },
      { module: "Tópicos Avançados em Clínica", hours: 40 },
      { module: "Tópicos Avançados em Sexualidade", hours: 40 }
    ],
    requirements: [
      "Ensino médio completo",
      "Documentação pessoal",
      "Interesse pela psicanálise"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Plataforma de aprendizado intuitiva",
      "Tutores especializados",
      "Avaliações online",
      "Flexibilidade de horários",
      "Certificado de conclusão reconhecido"
    ]
  },
  
  // Novo curso de Pós-Graduação em Psicanálise
  "501": {
    id: 501,
    title: "Pós-Graduação em Psicanálise",
    category: "Pós-Graduação",
    duration: "6 meses",
    modalidade: "Online",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    payment: "1 matrícula de R$ 150,00 + 16x de R$ 155,00",
    certification: "Certificado de Pós-Graduação",
    image: "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
    description: "O curso de Pós-Graduação em Psicanálise oferece formação especializada para profissionais que desejam atuar na área clínica psicanalítica, desenvolvendo competências para o atendimento terapêutico e compreensão dos processos psíquicos.",
    totalHours: "600 horas",
    curriculum: [
      { module: "Introdução à EAD", hours: 30 },
      { module: "Diversidade Étnico Racial, Gênero e Direitos Humanos", hours: 40 },
      { module: "Formação e Ética do Psicanalista", hours: 40 },
      { module: "Complexo de Édipo e Castração", hours: 40 },
      { module: "Introdução à Psicanálise", hours: 40 },
      { module: "Libido, Pulsões e Sexualidade", hours: 40 },
      { module: "Metodologia da Pesquisa Científica", hours: 40 },
      { module: "Narcisismo e a Cultura da Indiferença", hours: 40 },
      { module: "O Aparelho psíquico, aspectos clínicos e Teóricos", hours: 40 },
      { module: "O Método Psicanalítico", hours: 40 },
      { module: "Práticas e Procedimentos em Clínica", hours: 40 },
      { module: "Processos de Transferência e Resistência", hours: 40 },
      { module: "Psicanálise da Criança e do Adolescente", hours: 40 },
      { module: "Psicanálise II", hours: 40 },
      { module: "Psicopatologias I", hours: 40 },
      { module: "Psicopatologias II", hours: 40 },
      { module: "Sonhos, Simbologia e Representação", hours: 40 },
      { module: "Tópicos Avançados em Clínica", hours: 40 },
      { module: "Tópicos Avançados em Sexualidade", hours: 40 },
      { module: "Trabalho de Conclusão de Curso (Opcional)", hours: 0 }
    ],
    requirements: [
      "Diploma de graduação em Psicologia ou áreas relacionadas à saúde mental",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Plataforma de aprendizado intuitiva",
      "Tutores especializados",
      "Avaliações online",
      "Flexibilidade de horários",
      "Certificado de Pós-Graduação reconhecido pelo MEC"
    ]
  }
};

// Adicionar cursos da página Cursos.tsx
const graduationCourses = {
  "2": {
    id: 2,
    title: "Pedagogia",
    category: "Graduação",
    duration: "4 anos",
    modalidade: "Online",
    price: "R$ 547,00",
    originalPrice: "R$ 847,00",
    payment: "1 matrícula de R$ 547,00 + 48x de R$ 547,00",
    certification: "Diploma de Licenciatura",
    image: "/placeholder.svg",
    description: "O curso de Pedagogia prepara profissionais para atuar na educação infantil, ensino fundamental e gestão escolar, com foco em metodologias pedagógicas modernas e inclusivas.",
    requirements: [
      "Ensino médio completo",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Fundamentos da Educação",
      "Psicologia da Educação",
      "Didática",
      "Educação Inclusiva",
      "Gestão Educacional",
      "Alfabetização e Letramento",
      "Tecnologias na Educação",
      "Estágio Supervisionado"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Tutoria especializada",
      "Diploma reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Plataforma de aprendizado intuitiva"
    ]
  },
  "9": {
    id: 9,
    title: "Análise e Desenvolvimento de Sistemas",
    category: "Graduação",
    duration: "18 meses",
    modalidade: "Online",
    price: "R$ 497,00",
    originalPrice: "R$ 797,00",
    payment: "1 matrícula de R$ 497,00 + 18x de R$ 497,00",
    certification: "Diploma de Tecnólogo",
    image: "/placeholder.svg",
    description: "O curso de Análise e Desenvolvimento de Sistemas forma profissionais capacitados para projetar, implementar e gerenciar sistemas de informação, com conhecimentos em programação, banco de dados e engenharia de software.",
    requirements: [
      "Ensino médio completo",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Lógica de Programação",
      "Linguagens de Programação",
      "Banco de Dados",
      "Engenharia de Software",
      "Desenvolvimento Web",
      "Desenvolvimento Mobile",
      "Redes de Computadores",
      "Gestão de Projetos de Software"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Projetos práticos",
      "Diploma reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Laboratórios virtuais"
    ]
  },
  "10": {
    id: 10,
    title: "Gestão da Tecnologia da Informação",
    category: "Graduação",
    duration: "18 meses",
    modalidade: "Online",
    price: "R$ 497,00",
    originalPrice: "R$ 797,00",
    payment: "1 matrícula de R$ 497,00 + 18x de R$ 497,00",
    certification: "Diploma de Tecnólogo",
    image: "/placeholder.svg",
    description: "O curso de Gestão da Tecnologia da Informação forma profissionais capazes de planejar, implementar e gerenciar a infraestrutura de TI em organizações, alinhando recursos tecnológicos aos objetivos estratégicos do negócio.",
    requirements: [
      "Ensino médio completo",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Fundamentos de TI",
      "Infraestrutura Tecnológica",
      "Governança de TI",
      "Segurança da Informação",
      "Gestão de Projetos em TI",
      "Gestão de Serviços de TI",
      "Sistemas de Informação",
      "Inovação Tecnológica"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Estudos de caso reais",
      "Diploma reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Plataforma de aprendizado intuitiva"
    ]
  },
  "11": {
    id: 11,
    title: "Marketing Digital",
    category: "Graduação",
    duration: "18 meses",
    modalidade: "Online",
    price: "R$ 497,00",
    originalPrice: "R$ 797,00",
    payment: "1 matrícula de R$ 497,00 + 18x de R$ 497,00",
    certification: "Diploma de Tecnólogo",
    image: "/placeholder.svg",
    description: "O curso de Marketing Digital forma profissionais especialistas em estratégias de marketing para o ambiente digital, com conhecimentos em mídias sociais, SEO, marketing de conteúdo e análise de dados.",
    requirements: [
      "Ensino médio completo",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Introdução ao Marketing Digital",
      "Comportamento do Consumidor Online",
      "SEO e SEM",
      "Mídias Sociais",
      "Marketing de Conteúdo",
      "E-commerce",
      "Analytics e Métricas",
      "Planejamento de Marketing Digital"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Projetos práticos",
      "Diploma reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Plataforma de aprendizado intuitiva"
    ]
  },
  "14": {
    id: 14,
    title: "Ciências Contábeis",
    category: "Graduação",
    duration: "4 anos",
    modalidade: "Online",
    price: "R$ 597,00",
    originalPrice: "R$ 897,00",
    payment: "1 matrícula de R$ 597,00 + 48x de R$ 597,00",
    certification: "Diploma de Bacharelado",
    image: "/placeholder.svg",
    description: "O curso de Ciências Contábeis forma profissionais capacitados para atuar na gestão contábil de empresas, com conhecimentos em contabilidade financeira, tributária, auditoria e perícia contábil.",
    requirements: [
      "Ensino médio completo",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Contabilidade Básica",
      "Contabilidade Avançada",
      "Contabilidade de Custos",
      "Contabilidade Tributária",
      "Auditoria",
      "Perícia Contábil",
      "Análise das Demonstrações Contábeis",
      "Controladoria"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Casos práticos",
      "Diploma reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Plataforma de aprendizado intuitiva"
    ]
  },
  "15": {
    id: 15,
    title: "Engenharia Civil",
    category: "Graduação",
    duration: "5 anos",
    modalidade: "Online",
    price: "R$ 647,00",
    originalPrice: "R$ 947,00",
    payment: "1 matrícula de R$ 647,00 + 60x de R$ 647,00",
    certification: "Diploma de Bacharelado",
    image: "/placeholder.svg",
    description: "O curso de Engenharia Civil forma profissionais capacitados para projetar, construir e manter obras de infraestrutura, com conhecimentos em estruturas, hidráulica, materiais de construção e gestão de obras.",
    requirements: [
      "Ensino médio completo",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Cálculo e Física",
      "Resistência dos Materiais",
      "Estruturas de Concreto",
      "Estruturas Metálicas",
      "Hidráulica e Hidrologia",
      "Materiais de Construção",
      "Geotecnia",
      "Gestão de Obras"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Laboratórios virtuais",
      "Diploma reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Plataforma de aprendizado intuitiva"
    ]
  }
};

// Segunda licenciatura
const secondLicenciaturaCourses = {
  "3": {
    id: 3,
    title: "Artes Visuais",
    category: "Segunda Licenciatura",
    duration: "1 ano",
    modalidade: "Online",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    payment: "1 matrícula de R$ 397,00 + 12x de R$ 397,00",
    certification: "Diploma de Segunda Licenciatura",
    image: "/placeholder.svg",
    description: "O curso de Segunda Licenciatura em Artes Visuais é destinado a profissionais já licenciados em outras áreas que desejam expandir sua atuação para o ensino de artes.",
    requirements: [
      "Diploma de licenciatura em qualquer área",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "História da Arte",
      "Fundamentos da Linguagem Visual",
      "Metodologias do Ensino de Artes",
      "Expressão Bidimensional",
      "Expressão Tridimensional",
      "Cultura Visual",
      "Estágio Supervisionado",
      "Trabalho de Conclusão de Curso"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Tutoria especializada",
      "Diploma reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Plataforma de aprendizado intuitiva"
    ]
  }
};

// Outros cursos variados
const otherCourses = {
  "4": {
    id: 4,
    title: "Gestão de Recursos Humanos",
    category: "Pós-Graduação",
    duration: "1.5 anos",
    modalidade: "Online",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    payment: "1 matrícula de R$ 397,00 + 18x de R$ 397,00",
    certification: "Certificado de Pós-Graduação",
    image: "/placeholder.svg",
    description: "A pós-graduação em Gestão de Recursos Humanos prepara profissionais para atuar estrategicamente na gestão de pessoas, com foco em recrutamento, desenvolvimento, retenção de talentos e legislação trabalhista.",
    requirements: [
      "Diploma de graduação em qualquer área",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Gestão Estratégica de Pessoas",
      "Recrutamento e Seleção",
      "Treinamento e Desenvolvimento",
      "Remuneração e Benefícios",
      "Clima e Cultura Organizacional",
      "Legislação Trabalhista e Previdenciária",
      "Gestão de Desempenho",
      "Gestão por Competências"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Tutoria especializada",
      "Certificado reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Plataforma de aprendizado intuitiva"
    ]
  },
  "5": {
    id: 5,
    title: "Marketing Digital",
    category: "Pós-Graduação",
    duration: "1.5 anos",
    modalidade: "Online",
    price: "R$ 427,00",
    originalPrice: "R$ 627,00",
    payment: "1 matrícula de R$ 427,00 + 18x de R$ 427,00",
    certification: "Certificado de Pós-Graduação",
    image: "/placeholder.svg",
    description: "A pós-graduação em Marketing Digital forma profissionais capacitados para planejar, implementar e gerenciar estratégias de marketing no ambiente digital, utilizando as mais recentes ferramentas e tecnologias do mercado.",
    requirements: [
      "Diploma de graduação em qualquer área",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Fundamentos do Marketing Digital",
      "SEO e SEM",
      "Mídias Sociais",
      "E-mail Marketing",
      "Análise de Dados e Métricas",
      "Gestão de Conteúdo",
      "Inbound Marketing",
      "Planejamento de Campanhas Digitais"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Tutoria especializada",
      "Certificado reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Plataforma de aprendizado intuitiva"
    ]
  },
  "6": {
    id: 6,
    title: "Excel Avançado",
    category: "Formação Livre",
    duration: "60 horas",
    modalidade: "Online",
    price: "R$ 197,00",
    originalPrice: "R$ 297,00",
    payment: "1 matrícula de R$ 197,00 + 6x de R$ 197,00",
    certification: "Certificado de Formação Livre",
    image: "/placeholder.svg",
    description: "O curso de Excel Avançado oferece um aprofundamento nas funcionalidades mais complexas desta ferramenta, permitindo ao aluno dominar fórmulas avançadas, VBA, macros e tabelas dinâmicas para uso profissional.",
    requirements: [
      "Conhecimentos básicos de Excel",
      "Acesso a computador com Excel instalado",
      "Documentação pessoal"
    ],
    ementa: [
      "Fórmulas Avançadas",
      "Tabelas Dinâmicas",
      "Gráficos Avançados",
      "Macros",
      "Programação em VBA",
      "Power Query",
      "Power Pivot",
      "Dashboards Profissionais"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Exemplos práticos",
      "Certificado de conclusão",
      "Flexibilidade de horários",
      "Suporte técnico"
    ]
  },
  "7": {
    id: 7,
    title: "Técnicas de Vendas",
    category: "Capacitação Profissional",
    duration: "80 horas",
    modalidade: "Online",
    price: "R$ 247,00",
    originalPrice: "R$ 347,00",
    payment: "1 matrícula de R$ 247,00 + 6x de R$ 247,00",
    certification: "Certificado Profissional",
    image: "/placeholder.svg",
    description: "O curso de Técnicas de Vendas capacita profissionais para atuarem de forma eficiente no processo comercial, desenvolvendo habilidades de negociação, abordagem ao cliente e fechamento de vendas.",
    requirements: [
      "Ensino médio completo",
      "Documentação pessoal",
      "Acesso a computador com internet"
    ],
    ementa: [
      "Fundamentos de Vendas",
      "Prospecção de Clientes",
      "Abordagem Eficiente",
      "Identificação de Necessidades",
      "Técnicas de Negociação",
      "Objeções e Contornos",
      "Fechamento de Vendas",
      "Pós-venda e Fidelização"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Estudos de caso práticos",
      "Certificado profissional",
      "Flexibilidade de horários",
      "Suporte técnico"
    ]
  },
  "8": {
    id: 8,
    title: "Data Science",
    category: "Capacitação Profissional",
    duration: "120 horas",
    modalidade: "Online",
    price: "R$ 347,00",
    originalPrice: "R$ 447,00",
    payment: "1 matrícula de R$ 347,00 + 6x de R$ 347,00",
    certification: "Certificado Profissional",
    image: "/placeholder.svg",
    description: "O curso de Data Science capacita profissionais para extrair conhecimento e insights valiosos a partir de dados estruturados e não estruturados, utilizando técnicas estatísticas, programação e visualização de dados.",
    requirements: [
      "Conhecimentos básicos de matemática e estatística",
      "Noções de programação são recomendáveis",
      "Documentação pessoal",
      "Acesso a computador com internet"
    ],
    ementa: [
      "Introdução à Ciência de Dados",
      "Linguagem Python para Análise de Dados",
      "Estatística Aplicada",
      "Machine Learning",
      "Visualização de Dados",
      "Big Data",
      "Projetos Práticos",
      "Ética em Ciência de Dados"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Projetos práticos",
      "Certificado profissional",
      "Flexibilidade de horários",
      "Suporte técnico especializado"
    ]
  }
};

// Adicionar cursos de segunda licenciatura (100-106)
const licenciaturaCourses: Record<string, CourseWithEmenta> = {};
Object.entries({
  "100": "Sociologia",
  "101": "Ciências da Religião",
  "102": "Educação Especial",
  "103": "Educação Física",
  "104": "Filosofia",
  "105": "Geografia",
  "106": "História"
}).forEach(([id, title]) => {
  licenciaturaCourses[id] = {
    id: Number(id),
    title,
    category: "Segunda Licenciatura",
    duration: "1 ano",
    modalidade: "Online",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    payment: "1 matrícula de R$ 397,00 + 12x de R$ 397,00",
    certification: "Diploma de Segunda Licenciatura",
    image: "/placeholder.svg",
    description: `O curso de Segunda Licenciatura em ${title} é destinado a profissionais já licenciados em outras áreas que desejam expandir sua atuação para o ensino desta disciplina.`,
    requirements: [
      "Diploma de licenciatura em qualquer área",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      `Fundamentos de ${title}`,
      `História do Ensino de ${title} no Brasil`,
      `Metodologias do Ensino de ${title}`,
      "Didática Aplicada",
      "Tecnologias Educacionais",
      "Avaliação da Aprendizagem",
      "Estágio Supervisionado",
      "Trabalho de Conclusão de Curso"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Tutoria especializada",
      "Diploma reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Plataforma de aprendizado intuitiva"
    ]
  };
});

// Adicionar cursos MBA (200-220)
const mbaCourses: Record<string, CourseWithEmenta> = {};
for (let id = 200; id <= 220; id++) {
  const titles: Record<number, string> = {
    200: "MBA em Administração de Pessoal",
    201: "MBA em Auditoria Contábil",
    202: "MBA em Contabilidade Gerencial",
    203: "MBA em Finanças Corporativas e Controladoria",
    204: "MBA em Gestão Ambiental",
    205: "MBA em Gestão da Produção",
    206: "MBA em Gestão da Tecnologia da Informação",
    207: "MBA em Gestão de Cadeia de Suprimentos",
    208: "MBA em Gestão Estratégica e Inovação",
    209: "MBA em Gestão de Farmácias e Drogarias",
    210: "MBA em Gestão de Marketing Digital",
    211: "MBA em Gestão de Pessoas e Talentos",
    212: "MBA em Gestão de Saúde",
    213: "MBA em Gestão Empresarial",
    214: "MBA em Gestão Hospitalar",
    215: "MBA em Gestão Pública",
    216: "MBA em Gestão Social",
    217: "MBA em Logística Empresarial",
    218: "MBA em Logística e Supply Chain Management",
    219: "MBA em Marketing Estratégico",
    220: "MBA em Modelagem e Gestão de Processos"
  };
  
  mbaCourses[id.toString()] = {
    id: id,
    title: titles[id] || `MBA em Gestão Empresarial ${id}`,
    category: "MBA",
    duration: "6 meses",
    modalidade: "Online",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    payment: "1 matrícula de R$ 150,00 + 16x de R$ 155,00",
    certification: "Certificado de MBA",
    image: "/placeholder.svg",
    description: `O ${titles[id] || 'MBA'} proporciona conhecimentos avançados em gestão para profissionais que buscam aprimorar suas competências e assumir posições de liderança em organizações.`,
    requirements: [
      "Diploma de graduação em qualquer área",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Gestão Estratégica",
      "Liderança e Desenvolvimento de Equipes",
      "Finanças Corporativas",
      "Marketing Estratégico",
      "Gestão de Projetos",
      "Inovação e Empreendedorismo",
      "Governança Corporativa",
      "Estudos de Caso e Aplicações Práticas"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Estudos de caso de empresas reais",
      "Certificado reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Networking com profissionais da área"
    ]
  };
}

// Adicionar templates para cursos de pós-graduação (300-425)
const pgCourses: Record<string, CourseWithEmenta> = {};
for (let id = 300; id <= 425; id++) {
  // Pular o curso 422 que já foi definido anteriormente
  if (id === 422) {
    continue;
  }
  
  const area = id >= 400 ? "Saúde" : "Direito";
  const titleBase = id >= 400
    ? [
        "Análises Clínicas", "Atenção e Cuidado com Idosos", "Atendimento na UBS", 
        "Farmacologia Clínica", "Fisioterapia", "Gestão da Saúde", 
        "Neuropsicologia", "Psicanálise", "Psicologia", "Nutrição"
      ]
    : [
        "Direito Administrativo", "Direito Civil", "Direito Penal",
        "Direito Tributário", "Direito Digital", "Direito do Trabalho",
        "Direito Empresarial", "Direito Ambiental", "Direito Previdenciário"
      ];
  
  const randomTitle = `${area === "Saúde" ? "Especialização em" : "Pós-Graduação em"} ${
    titleBase[id % titleBase.length]
  } ${id}`;
  
  pgCourses[id.toString()] = {
    id: id,
    title: randomTitle,
    category: "Pós-Graduação",
    duration: "6 meses",
    modalidade: "Online",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    payment: "1 matrícula de R$ 150,00 + 16x de R$ 155,00",
    certification: "Certificado de Pós-Graduação",
    image: "/placeholder.svg",
    description: `O curso de Pós-Graduação em ${randomTitle} forma especialistas qualificados para atuar em sua área de especialização, com conhecimentos teóricos e práticos atualizados.`,
    requirements: [
      "Diploma de graduação em áreas relacionadas",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Fundamentos Teóricos",
      "Aspectos Práticos e Aplicados",
      "Metodologia de Pesquisa",
      "Estudos de Caso",
      "Tendências e Inovações",
      "Ética Profissional",
      "Legislação Aplicada",
      "Trabalho de Conclusão de Curso"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Tutoria especializada",
      "Certificado reconhecido pelo MEC",
      "Flexibilidade de horários",
      "Plataforma de aprendizado intuitiva"
    ]
  };
}

// Mesclar todos os cursos em um único objeto
const allCourses: Record<string, Course> = {
  ...mockCourses,
  ...graduationCourses,
  ...secondLicenciaturaCourses,
  ...licenciaturaCourses,
  ...mbaCourses,
  ...pgCourses,
  ...otherCourses
};

export default allCourses;
