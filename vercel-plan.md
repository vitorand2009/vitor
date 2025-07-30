# Plano de Deploy para Vercel - Momentos Charutos

## Arquitetura Escolhida

### Opção 1: Frontend + API Routes (Recomendada)
- **Frontend:** React app hospedado na Vercel
- **Backend:** Vercel API Routes (serverless functions)
- **Banco de dados:** Vercel Postgres ou PlanetScale (MySQL)
- **Storage:** Vercel Blob para upload de imagens

### Estrutura do Projeto
\`\`\`
momentos-charutos/
├── pages/                 # Páginas Next.js
├── components/           # Componentes React
├── api/                  # API Routes da Vercel
├── lib/                  # Utilitários e configurações
├── public/              # Arquivos estáticos
├── styles/              # Estilos CSS
├── vercel.json          # Configuração da Vercel
└── package.json         # Dependências
\`\`\`

## Tecnologias
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Database:** Vercel Postgres
- **File Storage:** Vercel Blob
- **Deployment:** Vercel

## Funcionalidades a Implementar
1. **Gestão de Estoque**
   - CRUD de charutos
   - Upload de fotos
   - Controle de quantidade

2. **Sistema de Degustação**
   - Fluxo em 2 momentos
   - Campos abertos para observações
   - Upload de foto da anilha
   - Roda de sabores

3. **Dashboard**
   - Estatísticas em tempo real
   - Gráficos e métricas

4. **Histórico**
   - Lista de degustações finalizadas
   - Busca e filtros

## Configurações Necessárias
- Variáveis de ambiente para banco de dados
- Configuração do Vercel Blob
- Configuração de CORS
- Otimizações de performance
