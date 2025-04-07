
# Implantação no Vercel

Este documento fornece instruções para configurar a implantação automática do EduZayn no Vercel conectado ao GitHub.

## Pré-requisitos

1. Uma conta no [Vercel](https://vercel.com)
2. Um repositório GitHub contendo este projeto
3. Permissões de administrador em ambos

## Passos para configurar o deploy automático

### 1. Conecte sua conta GitHub ao Vercel

1. Faça login no [Vercel](https://vercel.com)
2. Vá para "Settings" > "Git"
3. Conecte sua conta GitHub (se ainda não estiver conectada)

### 2. Importe o projeto

1. No dashboard do Vercel, clique em "Add New..." > "Project"
2. Selecione o repositório GitHub que contém o projeto EduZayn
3. Configure as seguintes opções:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Configure as variáveis de ambiente

No Vercel, adicione as mesmas variáveis de ambiente do seu arquivo `.env.local`:

1. No projeto do Vercel, vá para "Settings" > "Environment Variables"
2. Adicione as seguintes variáveis:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```
   (Adicione qualquer outra variável de ambiente que seu projeto necessite)

### 4. Deploy

1. Clique em "Deploy"
2. O Vercel iniciará a construção e implantação do seu projeto

### 5. Verificar implantação contínua

Após a configuração inicial, o Vercel automaticamente:
- Fará deploy a cada push para a branch principal
- Criará deploys de preview para pull requests

### 6. Domínio personalizado (opcional)

1. No projeto do Vercel, vá para "Settings" > "Domains"
2. Adicione seu domínio personalizado e siga as instruções para configuração DNS

## Solução de problemas comuns

### Falha no build

Verifique os logs de build para identificar erros. Causas comuns:
- Dependências faltando no package.json
- Variáveis de ambiente não configuradas
- Erros de sintaxe no código

### Problemas de CORS em APIs externas

Se estiver tendo problemas com CORS ao acessar APIs externas:
1. Verifique se suas APIs permitem requisições do domínio do Vercel
2. Configure corretamente os headers CORS em suas APIs

### Problema com rotas do React Router

O arquivo `vercel.json` já está configurado para tratar corretamente as rotas do React Router.
Se encontrar erros de rota, verifique se o arquivo está presente no deploy.

Para mais informações, consulte a [documentação oficial do Vercel](https://vercel.com/docs).
