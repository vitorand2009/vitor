# Changelog - Momentos Charutos

## Versão 2.0 - Ajustes Solicitados pelo Usuário

### ✨ Novas Funcionalidades

#### 🔄 **Sistema de Degustação em 2 Momentos**
- **Momento 1 (Iniciar Degustação):**
  - Seleção do charuto
  - Definição do momento (sozinho/confraternizando)
  - Tipo de corte (reto/V/furado)
  - Fluxo (solto/médio/preso)
  - Campo aberto para observações da folha anilhada

- **Momento 2 (Finalizar Degustação):**
  - Duração em minutos
  - Nota (1-10)
  - Campo aberto para construção e queima
  - Compraria novamente (sim/não/depende do preço)
  - Roda de sabores completa (9 sabores)
  - Observações gerais
  - Campo "Observação ou Colar Anilha"
  - Upload de foto da anilha

#### 📸 **Upload de Fotos**
- **Estoque:** Upload de foto do charuto
- **Degustação:** Upload de foto da anilha
- Suporte a PNG, JPG, GIF até 10MB
- Preview das imagens antes do upload

#### 📝 **Campos Abertos**
- **Folha Anilhada:** Agora é um campo de texto livre para observações detalhadas
- **Construção e Queima:** Campo de texto livre para avaliação personalizada

### 🔧 **Melhorias Técnicas**

#### Backend (Flask)
- Novos modelos de dados com campos adicionais
- Sistema de upload de arquivos
- Endpoints específicos para cada momento da degustação
- API para degustações em andamento
- Endpoint para finalizar degustações

#### Frontend (React)
- Interface redesenhada para fluxo em 2 momentos
- Componentes de upload de fotos
- Formulários dinâmicos
- Melhor experiência do usuário
- Responsividade mantida

#### Banco de Dados
- Novos campos na tabela `charutos`:
  - `foto_charuto` (string)
- Novos campos na tabela `degustacoes`:
  - `folha_anilhada` (text)
  - `construcao_queima` (text)
  - `compraria_novamente` (string)
  - `observacao_anilha` (text)
  - `foto_anilha` (string)
  - `status` (string) - para controlar degustações em andamento

### 🎯 **Funcionalidades Mantidas**
- Dashboard com estatísticas
- Gestão completa de estoque
- Histórico de degustações
- Busca e filtros
- Roda de sabores
- Interface intuitiva

### 🌐 **Deploy**
- Aplicativo atualizado e disponível em: https://0vhlizckl9zm.manus.space
- Todas as funcionalidades testadas e funcionais

---

## Versão 1.0 - Versão Inicial

### Funcionalidades Originais
- Sistema básico de estoque
- Degustação em momento único
- Dashboard com estatísticas
- Histórico de avaliações
- Baseado no livreto de degustação fornecido

