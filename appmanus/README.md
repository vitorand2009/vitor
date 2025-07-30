# Momentos Charutos - Aplicativo de Degustação

Um aplicativo web completo para gerenciar estoque de charutos e registrar degustações, desenvolvido com Next.js e otimizado para deploy na Vercel.

## 🚀 Funcionalidades

### 📦 **Gestão de Estoque**
- Cadastro completo de charutos (nome, bitola, país, valor, data de aquisição)
- Controle de quantidade em estoque
- Upload de fotos dos charutos
- Busca e filtros por nome, país ou bitola
- Edição e exclusão de charutos

### 🍃 **Sistema de Degustação em 2 Momentos**
- **Momento 1 (Iniciar):** Seleção do charuto, momento, corte, fluxo e observações da folha anilhada
- **Momento 2 (Finalizar):** Roda de sabores, nota, duração, construção/queima, observações e foto da anilha
- Controle de degustações em andamento
- Redução automática do estoque após finalização

### 📊 **Dashboard Inteligente**
- Estatísticas em tempo real
- Total de charutos em estoque
- Total de degustações realizadas
- Média de notas
- Charuto favorito
- Principais sabores identificados

### 📋 **Histórico Completo**
- Lista de todas as degustações finalizadas
- Busca por charuto ou observações
- Visualização detalhada de cada avaliação
- Exibição de fotos das anilhas

## 🛠️ Tecnologias

- **Framework:** Next.js 15 (React 18)
- **Styling:** Tailwind CSS
- **Database:** Vercel Postgres
- **File Storage:** Vercel Blob
- **Deployment:** Vercel
- **Language:** TypeScript

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta na Vercel
- Vercel Postgres database
- Vercel Blob storage

## 🚀 Deploy na Vercel

### 1. Preparação do Projeto

```bash
# Clone ou faça upload do projeto para seu repositório Git
git init
git add .
git commit -m "Initial commit"
git remote add origin <seu-repositorio>
git push -u origin main
```

### 2. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Importe seu repositório
4. Configure as variáveis de ambiente (veja seção abaixo)
5. Clique em "Deploy"

### 3. Configuração do Banco de Dados

1. No dashboard da Vercel, vá para seu projeto
2. Clique na aba "Storage"
3. Clique em "Create Database" → "Postgres"
4. Siga as instruções para criar o banco
5. A variável `POSTGRES_URL` será criada automaticamente

### 4. Configuração do Blob Storage

1. Na aba "Storage", clique em "Create Database" → "Blob"
2. Siga as instruções para criar o storage
3. A variável `BLOB_READ_WRITE_TOKEN` será criada automaticamente

### 5. Inicialização do Banco

Após o deploy, acesse:
```
https://seu-app.vercel.app/api/init
```

Isso criará as tabelas necessárias no banco de dados.

## ⚙️ Variáveis de Ambiente

Configure as seguintes variáveis no dashboard da Vercel:

```env
# Database (criada automaticamente pelo Vercel Postgres)
POSTGRES_URL=postgres://username:password@hostname:port/database

# File Storage (criada automaticamente pelo Vercel Blob)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Opcional
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

## 🏗️ Estrutura do Projeto

```
momentos-charutos-vercel/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── api/               # API Routes
│   │   │   ├── charutos/      # CRUD de charutos
│   │   │   ├── degustacoes/   # CRUD de degustações
│   │   │   ├── dashboard/     # Estatísticas
│   │   │   └── init/          # Inicialização do DB
│   │   ├── estoque/           # Página de estoque
│   │   ├── degustacao/        # Página de degustação
│   │   ├── historico/         # Página de histórico
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Dashboard
│   │   └── globals.css        # Estilos globais
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes de UI
│   │   └── Navigation.tsx     # Navegação principal
│   └── lib/                   # Utilitários
│       ├── db.ts             # Funções do banco
│       └── storage.ts        # Funções de storage
├── public/                    # Arquivos estáticos
├── vercel.json               # Configuração da Vercel
├── next.config.js            # Configuração do Next.js
├── tailwind.config.ts        # Configuração do Tailwind
└── package.json              # Dependências
```

## 📱 Funcionalidades Detalhadas

### Estoque
- ✅ Adicionar charutos com foto
- ✅ Editar informações
- ✅ Controle de quantidade
- ✅ Busca e filtros
- ✅ Exclusão de charutos

### Degustação
- ✅ Fluxo em 2 momentos
- ✅ Campos abertos para observações
- ✅ Roda de sabores (9 sabores)
- ✅ Upload de foto da anilha
- ✅ Controle de degustações em andamento
- ✅ Redução automática do estoque

### Dashboard
- ✅ Estatísticas em tempo real
- ✅ Gráficos e métricas
- ✅ Sabores mais comuns
- ✅ Charuto favorito

### Histórico
- ✅ Lista completa de degustações
- ✅ Busca por texto
- ✅ Visualização detalhada
- ✅ Exibição de fotos

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar build local
npm start
```

## 📊 API Endpoints

### Charutos
- `GET /api/charutos` - Listar charutos
- `POST /api/charutos` - Criar charuto
- `GET /api/charutos/[id]` - Obter charuto
- `PUT /api/charutos/[id]` - Atualizar charuto
- `DELETE /api/charutos/[id]` - Excluir charuto

### Degustações
- `GET /api/degustacoes` - Listar degustações
- `POST /api/degustacoes` - Iniciar degustação
- `PUT /api/degustacoes/[id]/finalizar` - Finalizar degustação

### Dashboard
- `GET /api/dashboard` - Obter estatísticas

### Inicialização
- `POST /api/init` - Criar tabelas do banco

## 🎨 Design System

O aplicativo utiliza um design system consistente com:
- **Cores:** Paleta baseada em tons de âmbar para tema de charutos
- **Tipografia:** Inter font para legibilidade
- **Componentes:** Sistema de componentes reutilizáveis
- **Responsividade:** Mobile-first design
- **Acessibilidade:** Contraste adequado e navegação por teclado

## 🔒 Segurança

- Validação de dados no frontend e backend
- Sanitização de uploads de arquivos
- Proteção contra SQL injection (usando Vercel Postgres)
- HTTPS obrigatório em produção
- Validação de tipos TypeScript

## 📈 Performance

- **SSG/SSR:** Páginas otimizadas com Next.js
- **Imagens:** Otimização automática com Vercel Blob
- **Bundle:** Code splitting automático
- **Cache:** Cache inteligente da Vercel
- **CDN:** Distribuição global automática

## 🐛 Troubleshooting

### Erro de conexão com banco
- Verifique se `POSTGRES_URL` está configurada
- Execute `/api/init` para criar as tabelas

### Erro de upload de imagens
- Verifique se `BLOB_READ_WRITE_TOKEN` está configurada
- Confirme que o arquivo é uma imagem válida

### Build falha
- Verifique se todas as dependências estão instaladas
- Execute `npm run build` localmente primeiro

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação da Vercel
2. Consulte os logs no dashboard da Vercel
3. Verifique as variáveis de ambiente

## 📄 Licença

Este projeto foi desenvolvido como aplicativo personalizado para degustação de charutos.

---

**Desenvolvido com ❤️ para entusiastas de charutos**

