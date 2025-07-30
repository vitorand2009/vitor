# Guia de Deploy na Vercel

Este guia explica como fazer o deploy do aplicativo **Momentos Charutos** na Vercel.

## 🚀 Deploy Automático (Recomendado)

### 1. Via GitHub (Mais Fácil)

1. **Suba o código para o GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <seu-repositorio-github>
   git push -u origin main
   ```

2. **Conecte com a Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub
   - Clique em "New Project"
   - Selecione seu repositório
   - Clique em "Deploy"

3. **Configuração Automática:**
   - A Vercel detecta automaticamente que é um projeto Next.js
   - Todas as configurações são aplicadas automaticamente
   - O deploy é feito em poucos minutos

### 2. Via Vercel CLI

1. **Instale a CLI da Vercel:**
   ```bash
   npm i -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   # Deploy de desenvolvimento
   vercel

   # Deploy de produção
   vercel --prod
   ```

## ⚙️ Configurações

### Variáveis de Ambiente
O aplicativo funciona sem variáveis de ambiente adicionais, mas você pode configurar:

```env
NEXT_PUBLIC_APP_NAME="Momentos Charutos"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### Configurações da Vercel
O arquivo `vercel.json` já está configurado com:
- Timeout de 30s para as API Routes
- Redirecionamentos para uploads
- Otimizações automáticas

## 🔧 Funcionalidades na Vercel

### ✅ O que funciona:
- ✅ Todas as páginas (Dashboard, Estoque, Degustação, Histórico)
- ✅ Todas as APIs (CRUD completo)
- ✅ Upload de imagens
- ✅ Sistema de 2 momentos para degustação
- ✅ Estatísticas em tempo real
- ✅ Interface responsiva

### ⚠️ Limitações:
- **Dados em memória:** Os dados são perdidos a cada deploy/restart
- **Uploads temporários:** Imagens podem ser perdidas em restarts
- **Sem persistência:** Para produção, recomenda-se banco de dados real

## 🚀 Melhorias para Produção

### 1. Banco de Dados Persistente
```bash
# Adicione um banco PostgreSQL
npm install @vercel/postgres

# Configure no .env
DATABASE_URL="postgresql://..."
```

### 2. Armazenamento de Imagens
```bash
# Use Vercel Blob ou Cloudinary
npm install @vercel/blob

# Configure upload para serviço externo
```

### 3. Autenticação
```bash
# Adicione NextAuth.js
npm install next-auth

# Configure provedores de login
```

## 📊 Monitoramento

Após o deploy, você pode monitorar:
- **Analytics:** Vercel Analytics automático
- **Performance:** Core Web Vitals
- **Logs:** Logs das API Routes
- **Errors:** Error tracking automático

## 🔄 Atualizações

Para atualizar o aplicativo:

1. **Via GitHub:**
   - Faça push das mudanças
   - Deploy automático é acionado

2. **Via CLI:**
   ```bash
   vercel --prod
   ```

## 🆘 Troubleshooting

### Problema: API Routes não funcionam
- ✅ Verifique se os arquivos estão em `src/app/api/`
- ✅ Confirme que exportam funções HTTP (GET, POST, etc.)

### Problema: Imagens não carregam
- ✅ Verifique `next.config.js`
- ✅ Confirme que as imagens estão em `public/`

### Problema: Build falha
- ✅ Execute `npm run build` localmente
- ✅ Corrija erros de TypeScript
- ✅ Verifique dependências

## 📞 Suporte

Para problemas específicos:
1. Verifique os logs na Vercel Dashboard
2. Teste localmente com `npm run dev`
3. Consulte a documentação da Vercel

---

**🎉 Seu aplicativo estará disponível em uma URL como:**
`https://momentos-charutos-vercel.vercel.app`

