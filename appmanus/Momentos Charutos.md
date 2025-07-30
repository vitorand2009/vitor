# Momentos Charutos

Aplicativo web para degustação e controle de charutos, desenvolvido com Next.js e otimizado para deploy na Vercel.

## 🚀 Funcionalidades

### 📦 Gestão de Estoque
- Cadastro completo de charutos (nome, bitola, país, valor, data de aquisição)
- Controle de quantidade em estoque
- Upload de fotos dos charutos
- Busca e filtros por nome, país ou bitola

### 🍃 Registro de Degustações (2 Momentos)
- **Momento 1 - Iniciar Degustação:**
  - Seleção do charuto
  - Informações do momento (data, ocasião)
  - Avaliação inicial (corte, fluxo, folha anilhada, construção e queima)

- **Momento 2 - Finalizar Degustação:**
  - Roda de sabores completa (9 sabores diferentes)
  - Nota de avaliação (0-10)
  - Duração da degustação
  - Compraria novamente? (sim/não/depende do preço)
  - Observações ou informações da anilha
  - Upload de foto da anilha

### 📊 Dashboard e Estatísticas
- Total de charutos em estoque (atualizado em tempo real)
- Total de degustações finalizadas
- Média de notas das degustações
- Charuto favorito (mais degustado)
- Sabores mais identificados com gráfico de barras

### 📋 Histórico de Degustações
- Lista completa de todas as degustações finalizadas
- Busca por charuto ou observações
- Visualização detalhada de cada degustação
- Modal com informações completas e fotos

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js 15 com TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React
- **Backend:** Next.js API Routes
- **Database:** Sistema em memória (desenvolvimento)
- **Deploy:** Vercel

## 🔧 Instalação e Desenvolvimento

```bash
# Clone o repositório
git clone <repository-url>
cd momentos-charutos-vercel

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

## 📱 Funcionalidades Implementadas

### ✅ Correções Solicitadas
1. **Dashboard conectado:** Agora exibe dados em tempo real do estoque e degustações
2. **Visualização de degustações:** Histórico completo com todas as degustações finalizadas
3. **Controle de estoque:** Charutos são automaticamente removidos do estoque após degustação

### ✅ Melhorias Implementadas
1. **Campos abertos:** "Folha Anilhada" e "Construção e Queima" são campos de texto livre
2. **Sistema de 2 momentos:** Degustação dividida em início e finalização
3. **Upload de fotos:** Suporte para fotos no estoque e na anilha
4. **Interface responsiva:** Funciona perfeitamente em desktop e mobile

## 🚀 Deploy na Vercel

O aplicativo está otimizado para deploy na Vercel:

1. **Configuração automática:** `vercel.json` configurado
2. **API Routes:** Todas as APIs funcionam como Serverless Functions
3. **Otimizações:** Build otimizado para produção
4. **Variáveis de ambiente:** Configuradas via `.env.example`

### Deploy Manual
```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça o deploy
vercel

# Para deploy de produção
vercel --prod
```

## 📝 Estrutura do Projeto

```
src/
├── app/
│   ├── api/           # API Routes (Backend)
│   ├── estoque/       # Página de estoque
│   ├── degustacao/    # Página de degustação
│   ├── historico/     # Página de histórico
│   └── page.tsx       # Dashboard
├── components/
│   ├── ui/            # Componentes de UI
│   └── Navigation.tsx # Navegação principal
└── lib/
    ├── db.ts          # Sistema de banco de dados
    ├── storage.ts     # Sistema de arquivos
    └── utils.ts       # Utilitários
```

## 🎯 Próximos Passos

Para produção, considere:
- Migrar para banco de dados real (PostgreSQL, MongoDB)
- Implementar sistema de autenticação
- Adicionar backup automático dos dados
- Implementar notificações push
- Adicionar relatórios avançados

## 📄 Licença

Este projeto foi desenvolvido para uso pessoal na degustação de charutos.

