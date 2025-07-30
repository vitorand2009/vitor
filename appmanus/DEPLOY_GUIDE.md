# 🚀 Guia de Deploy na Vercel - Momentos Charutos

Este guia te levará passo a passo para fazer o deploy do aplicativo Momentos Charutos na Vercel.

## 📋 Checklist Pré-Deploy

- [ ] Conta na Vercel criada
- [ ] Repositório Git com o código
- [ ] Node.js 18+ instalado localmente (para testes)

## 🎯 Passo a Passo

### 1. Preparar o Repositório

```bash
# Se ainda não tem um repositório Git
git init
git add .
git commit -m "Initial commit: Momentos Charutos app"

# Criar repositório no GitHub/GitLab/Bitbucket e fazer push
git remote add origin https://github.com/seu-usuario/momentos-charutos.git
git push -u origin main
```

### 2. Fazer Deploy na Vercel

1. **Acesse [vercel.com](https://vercel.com)**
2. **Faça login** com sua conta GitHub/GitLab/Bitbucket
3. **Clique em "New Project"**
4. **Importe seu repositório:**
   - Selecione o repositório `momentos-charutos`
   - Clique em "Import"
5. **Configure o projeto:**
   - **Project Name:** `momentos-charutos` (ou nome de sua escolha)
   - **Framework Preset:** Next.js (detectado automaticamente)
   - **Root Directory:** `./` (padrão)
   - **Build Command:** `npm run build` (padrão)
   - **Output Directory:** `.next` (padrão)
6. **Clique em "Deploy"**

⏳ **Aguarde o primeiro deploy** (pode levar 2-3 minutos)

### 3. Configurar Banco de Dados

1. **No dashboard da Vercel, acesse seu projeto**
2. **Vá para a aba "Storage"**
3. **Clique em "Create Database"**
4. **Selecione "Postgres"**
5. **Configure:**
   - **Database Name:** `momentos-charutos-db`
   - **Region:** Escolha a região mais próxima
6. **Clique em "Create"**

✅ A variável `POSTGRES_URL` será criada automaticamente

### 4. Configurar Storage de Arquivos

1. **Na mesma aba "Storage"**
2. **Clique em "Create Database" novamente**
3. **Selecione "Blob"**
4. **Configure:**
   - **Store Name:** `momentos-charutos-files`
5. **Clique em "Create"**

✅ A variável `BLOB_READ_WRITE_TOKEN` será criada automaticamente

### 5. Verificar Variáveis de Ambiente

1. **Vá para a aba "Settings"**
2. **Clique em "Environment Variables"**
3. **Verifique se existem:**
   - `POSTGRES_URL` (criada automaticamente)
   - `BLOB_READ_WRITE_TOKEN` (criada automaticamente)

### 6. Inicializar o Banco de Dados

1. **Acesse seu app:** `https://seu-app.vercel.app`
2. **Vá para:** `https://seu-app.vercel.app/api/init`
3. **Você deve ver:** `{"message":"Database initialized successfully"}`

✅ **Pronto! Seu app está funcionando!**

## 🎉 Testando o Aplicativo

1. **Acesse:** `https://seu-app.vercel.app`
2. **Teste as funcionalidades:**
   - [ ] Dashboard carrega
   - [ ] Adicionar charuto no estoque
   - [ ] Iniciar uma degustação
   - [ ] Finalizar a degustação
   - [ ] Ver histórico
   - [ ] Upload de fotos funciona

## 🔧 Configurações Opcionais

### Domínio Personalizado

1. **Na aba "Settings" → "Domains"**
2. **Adicione seu domínio personalizado**
3. **Configure DNS conforme instruções**

### Analytics

1. **Na aba "Analytics"**
2. **Ative o Vercel Analytics**
3. **Configure conforme necessário**

## 🐛 Resolução de Problemas

### ❌ Deploy Falha

**Erro comum:** Build fails
```bash
# Teste localmente primeiro
npm install
npm run build
```

**Solução:** Verifique se o build passa localmente antes do deploy

### ❌ Banco de Dados Não Conecta

**Erro:** Database connection failed
**Solução:** 
1. Verifique se `POSTGRES_URL` existe nas variáveis de ambiente
2. Acesse `/api/init` para criar as tabelas

### ❌ Upload de Imagens Falha

**Erro:** Image upload fails
**Solução:**
1. Verifique se `BLOB_READ_WRITE_TOKEN` existe
2. Confirme que o Vercel Blob foi criado

### ❌ Página 404

**Erro:** Páginas não carregam
**Solução:**
1. Verifique se o deploy foi bem-sucedido
2. Confirme que todas as rotas estão corretas

## 📊 Monitoramento

### Logs
- **Dashboard Vercel → Functions → View Logs**
- Monitore erros em tempo real

### Performance
- **Dashboard Vercel → Analytics**
- Acompanhe métricas de performance

### Uptime
- **Dashboard Vercel → Monitoring**
- Configure alertas se necessário

## 🔄 Atualizações

Para atualizar o app:

1. **Faça mudanças no código**
2. **Commit e push:**
   ```bash
   git add .
   git commit -m "Update: nova funcionalidade"
   git push
   ```
3. **Deploy automático** acontece automaticamente

## 💡 Dicas de Produção

### Performance
- ✅ Imagens são otimizadas automaticamente
- ✅ CDN global ativo
- ✅ Cache inteligente configurado

### Segurança
- ✅ HTTPS obrigatório
- ✅ Variáveis de ambiente seguras
- ✅ Validação de dados ativa

### Backup
- ✅ Banco Postgres com backup automático
- ✅ Arquivos no Vercel Blob são replicados

## 📞 Suporte

### Documentação Oficial
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

### Comunidade
- [Vercel Discord](https://vercel.com/discord)
- [Next.js GitHub](https://github.com/vercel/next.js)

---

## ✅ Checklist Final

- [ ] App deployado com sucesso
- [ ] Banco de dados criado e inicializado
- [ ] Storage de arquivos configurado
- [ ] Todas as funcionalidades testadas
- [ ] Domínio personalizado (opcional)
- [ ] Monitoramento ativo

**🎉 Parabéns! Seu aplicativo Momentos Charutos está no ar!**

---

**URL do seu app:** `https://seu-app.vercel.app`

**Próximos passos:** Comece a cadastrar seus charutos e registrar suas degustações!

