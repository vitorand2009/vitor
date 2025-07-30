# Aplicativo de Degustação de Charutos - Requisitos

## Análise do Livreto

Baseado no livreto "Momentos Charutos Londrina - Avaliação de Charutos 2023", o aplicativo deve conter:

### Estrutura do Formulário de Avaliação

**Informações do Charuto:**
- Nome do charuto
- Bitola
- País
- Valor pago
- Data de aquisição

**Roda de Sabores (presente no livreto):**
- Tabaco
- Pimenta
- Terroso
- Flores
- Café
- Frutas
- Chocolate
- Castanhas
- Madeira

**Avaliação do Charuto:**
- Nota (escala de avaliação)
- Duração
- Data degustação
- Momento (confraternizando, sozinho)
- Compraria de novo? (Sim/Não/Depende do preço)
- Corte: Reto / "V" / Furado
- Fluxo: Solto / Médio / Preso
- Construção e queima (avaliação)
- Observação ou folha anilhada

## Funcionalidades Necessárias

### 1. Página de Estoque
- Listagem de charutos no estoque
- Adicionar novos charutos ao estoque
- Editar informações dos charutos
- Remover charutos do estoque
- Filtros e busca por nome, país, bitola
- Visualização em cards ou tabela

### 2. Página de Degustação
- Formulário de avaliação baseado no livreto
- Seleção de charuto do estoque para degustação
- Roda de sabores interativa
- Sistema de notas/avaliação
- Histórico de degustações

### 3. Funcionalidades Adicionais
- Dashboard com estatísticas
- Relatórios de degustações
- Exportação de dados
- Sistema de backup/restauração

## Arquitetura Técnica

### Backend (Flask)
- API REST para gerenciar charutos e degustações
- Banco de dados SQLite para persistência
- Endpoints para CRUD de charutos e avaliações
- Sistema de autenticação simples

### Frontend (React)
- Interface moderna e responsiva
- Componentes reutilizáveis
- Roteamento entre páginas
- Formulários interativos
- Visualização de dados

### Páginas Principais
1. **Dashboard** - Visão geral e estatísticas
2. **Estoque** - Gerenciamento de charutos
3. **Degustação** - Formulário de avaliação
4. **Histórico** - Lista de degustações realizadas
5. **Relatórios** - Análises e gráficos
