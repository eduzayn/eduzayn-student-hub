
# EduZayn - Plataforma de Cursos Online

![Logo EduZayn](public/logo.png)

## Visão Geral

EduZayn é uma plataforma educacional online completa que permite a criação, distribuição e gerenciamento de cursos digitais. A plataforma oferece uma experiência integrada para alunos e administradores, com recursos de matrícula em cursos, controle de acesso, processamento de pagamentos e acompanhamento de progresso.

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Supabase (Autenticação, Banco de Dados, Storage)
- **Gerenciamento de Estado**: React Query
- **Roteamento**: React Router
- **Formulários**: React Hook Form com validação Zod
- **Estilização**: Tailwind CSS com sistema de design personalizado

## Integrações Externas

### 1. Supabase
- **Autenticação**: Sistema completo de login, registro e recuperação de senha
- **Banco de Dados**: PostgreSQL para armazenamento estruturado de dados
- **Storage**: Armazenamento de arquivos como imagens, vídeos e documentos
- **Row Level Security (RLS)**: Controle de acesso granular aos dados
- **Edge Functions**: Para processamento em backend

### 2. Gateway de Pagamento (ASAAS)
- Processamento seguro de pagamentos
- Suporte a pagamentos recorrentes para assinaturas
- Gestão de faturas e notificações
- Armazenamento seguro de informações de pagamento

### 3. Plataforma Learning Worlds
- Integração para consumo de conteúdos educacionais
- Rastreamento de progresso de aprendizagem
- Sistema de avaliação e certificados

### 4. Sistemas de Email
- Notificações automáticas
- Emails de confirmação e boas-vindas
- Lembretes de aulas e eventos

### 5. Integração com Redes Sociais
- Login social (Google, Facebook)
- Compartilhamento de conquistas e certificados

## Estrutura do Banco de Dados

### Tabelas Principais

1. **profiles**: Informações dos usuários (estudantes, consultores, administradores)
   - Campos: id, first_name, last_name, email, phone, avatar_url, role, etc.

2. **categories**: Categorias de cursos
   - Campos: id, name, slug, description, image_url, etc.

3. **courses**: Informações dos cursos
   - Campos: id, title, slug, description, price, discount_price, category_id, etc.

4. **enrollments**: Matrículas dos estudantes nos cursos
   - Campos: id, student_id, course_id, status, enrollment_date, etc.

## Funcionalidades Implementadas

### 1. Sistema de Autenticação
- Registro de usuários
- Login com email/senha
- Recuperação de senha
- Perfis de usuário com diferentes níveis de acesso (aluno, consultor, admin)

### 2. Gerenciamento de Cursos
- Listagem de cursos por categoria
- Página de detalhes do curso
- Sistema de matrículas em cursos

### 3. Área do Aluno
- Dashboard personalizado
- Lista de cursos matriculados
- Acompanhamento de progresso

### 4. Área Administrativa
- Gerenciamento de usuários
- Criação e edição de cursos
- Monitoramento de matrículas e pagamentos

### 5. Funcionalidades Públicas
- Página inicial com destaque para cursos populares
- Página "Quem Somos" com informações sobre a EduZayn
- Formulário de contato para visitantes
- Listagem pública de cursos

## Etapas do Desenvolvimento

### Fase 1: Configuração Inicial e Estrutura Base
- [x] Configuração do projeto React com TypeScript e Vite
- [x] Integração com Tailwind CSS e Shadcn/UI
- [x] Configuração de roteamento com React Router
- [x] Estruturação de layouts e componentes base
- [x] Implementação do tema visual EduZayn

### Fase 2: Integração com Supabase e Estrutura de Dados
- [x] Conexão com Supabase
- [x] Criação do esquema de banco de dados
- [x] Configuração de políticas de segurança (RLS)
- [x] Implementação de funções e triggers para operações do banco de dados

### Fase 3: Autenticação e Gerenciamento de Usuários
- [x] Implementação do sistema de autenticação
- [x] Criação de páginas de login e registro
- [x] Rotas protegidas com base no perfil do usuário
- [ ] Gerenciamento de perfil de usuário

### Fase 4: Funcionalidades de Cursos
- [x] Página principal com listagem de cursos em destaque
- [x] Implementação da página de listagem de todos os cursos
- [x] Página de detalhes do curso
- [ ] Sistema de filtragem e busca de cursos

### Fase 5: Sistema de Matrículas
- [ ] Processo de checkout para matrícula em cursos
- [ ] Integração com gateway de pagamento ASAAS
- [ ] Geração de comprovantes de matrícula
- [ ] Configuração de acesso aos materiais do curso

### Fase 6: Dashboard do Aluno
- [ ] Dashboard personalizado para alunos
- [ ] Lista de cursos matriculados
- [ ] Sistema de acompanhamento de progresso
- [ ] Notificações e lembretes

### Fase 7: Painel Administrativo
- [ ] Dashboard para administradores
- [ ] CRUD completo de cursos e categorias
- [ ] Gerenciamento de usuários
- [ ] Análise de vendas e matrículas

### Fase 8: Refinamento e Otimização
- [ ] Performance e otimização
- [ ] Responsividade para todos os dispositivos
- [ ] Testes e correção de bugs
- [ ] Melhorias de UX/UI

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- NPM ou Yarn

### Passos para Configuração

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd eduzayn-student-hub
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

4. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse o projeto**
   Abra seu navegador e acesse `http://localhost:5173`

## Comandos Úteis

- **Desenvolvimento**: `npm run dev`
- **Build**: `npm run build`
- **Preview da build**: `npm run preview`
- **Lint**: `npm run lint`

## Convenções de Código

### Estrutura de Arquivos
```
src/
├── components/         # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI básicos
│   ├── layout/         # Componentes de layout
│   └── ...             # Outros componentes agrupados por função
├── hooks/              # Custom hooks React
├── lib/                # Utilidades e helpers
├── pages/              # Componentes de página
├── integrations/       # Código de integração com serviços externos
│   └── supabase/       # Cliente e tipos do Supabase
└── App.tsx             # Componente principal
```

### Convenções de Nomenclatura
- **Componentes**: PascalCase
- **Hooks**: camelCase com prefixo "use"
- **Utilitários**: camelCase
- **Constantes**: SNAKE_CASE maiúsculo
- **Tipos TypeScript**: PascalCase com sufixo descritivo (ex: UserData, CourseProps)

## Contribuição

Para contribuir com o projeto:

1. Crie um branch para sua feature
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. Faça suas alterações seguindo as convenções do projeto

3. Teste suas alterações

4. Envie um pull request com descrição clara das mudanças

## Contato

Para questões sobre o projeto, entre em contato:
- **Email**: contato@eduzayn.com.br
- **Site**: www.eduzayn.com.br

---

Desenvolvido com 💙 pela equipe EduZayn
