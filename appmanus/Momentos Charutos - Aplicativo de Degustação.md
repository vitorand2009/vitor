# Momentos Charutos - Aplicativo de Degustação

## Descrição

O **Momentos Charutos** é um aplicativo web completo para gerenciar seu estoque de charutos e registrar suas degustações de forma detalhada. Baseado no livreto de avaliação fornecido, o aplicativo permite documentar cada experiência com charutos de maneira profissional e organizada.

## Funcionalidades

### 📦 Gestão de Estoque
- Cadastro completo de charutos (nome, bitola, país, valor, data de aquisição)
- Controle de quantidade em estoque
- Busca e filtros por nome, país ou bitola
- Interface intuitiva para adicionar e gerenciar charutos

### 🍃 Registro de Degustações
- Formulário completo baseado no livreto de avaliação
- Campos para todas as informações importantes:
  - Informações básicas (charuto, data, momento, duração)
  - Avaliação (nota geral, construção e queima)
  - Características físicas (corte, fluxo, folha anilhada)
  - Roda de sabores (tabaco, pimenta, terroso, flores, café, frutas, chocolate, castanhas, madeira)
  - Observações detalhadas

### 📊 Dashboard e Estatísticas
- Visão geral do estoque
- Estatísticas de degustações
- Gráficos e métricas importantes

### 📋 Histórico de Degustações
- Lista completa de todas as degustações realizadas
- Busca por charuto ou observações
- Visualização detalhada de cada avaliação
- Organização cronológica

## Tecnologias Utilizadas

### Backend
- **Flask** - Framework web Python
- **SQLite** - Banco de dados
- **SQLAlchemy** - ORM para Python
- **Flask-CORS** - Suporte a CORS

### Frontend
- **React** - Biblioteca JavaScript
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Ícones

## Estrutura do Projeto

```
/
├── charutos_app/           # Backend Flask
│   ├── src/
│   │   ├── main.py        # Aplicação principal
│   │   ├── models/        # Modelos de dados
│   │   └── routes/        # Rotas da API
│   └── venv/              # Ambiente virtual Python
│
└── charutos-frontend/      # Frontend React
    ├── src/
    │   ├── components/    # Componentes React
    │   ├── pages/         # Páginas da aplicação
    │   └── App.jsx        # Componente principal
    └── dist/              # Build de produção
```

## Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- pnpm

### Backend (Flask)
```bash
cd charutos_app
source venv/bin/activate
python src/main.py
```
O backend estará disponível em `http://localhost:5000`

### Frontend (React)
```bash
cd charutos-frontend
pnpm run dev
```
O frontend estará disponível em `http://localhost:5173`

## API Endpoints

### Charutos
- `GET /api/charutos` - Lista todos os charutos
- `POST /api/charutos` - Cria um novo charuto
- `PUT /api/charutos/<id>` - Atualiza um charuto
- `DELETE /api/charutos/<id>` - Remove um charuto

### Degustações
- `GET /api/degustacoes` - Lista todas as degustações
- `POST /api/degustacoes` - Registra uma nova degustação
- `GET /api/degustacoes/<id>` - Obtém uma degustação específica

## Campos do Formulário de Degustação

O formulário foi desenvolvido baseado no livreto fornecido e inclui:

### Informações Básicas
- Charuto (seleção do estoque)
- Data da degustação
- Momento (sozinho/confraternizando)
- Duração em minutos

### Avaliação
- Nota geral (1-10)
- Construção e queima (1-10)
- Compraria novamente (sim/não/depende do preço)

### Características Físicas
- Folha anilhada (sim/não)
- Tipo de corte (reto/V/furado)
- Fluxo (solto/médio/preso)

### Roda de Sabores
Checkboxes para identificar sabores:
- Tabaco
- Pimenta
- Terroso
- Flores
- Café
- Frutas
- Chocolate
- Castanhas
- Madeira

### Observações
- Campo de texto livre para impressões e detalhes

## Próximos Passos

Para expandir o aplicativo, considere:
- Sistema de usuários e autenticação
- Backup e sincronização na nuvem
- Relatórios avançados e estatísticas
- Aplicativo mobile
- Integração com redes sociais
- Sistema de recomendações

## Suporte

Para dúvidas ou sugestões sobre o aplicativo, consulte a documentação técnica ou entre em contato com o desenvolvedor.

