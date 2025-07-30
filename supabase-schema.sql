-- Criar tabela de charutos
CREATE TABLE IF NOT EXISTS charutos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  bitola VARCHAR(100),
  pais VARCHAR(100),
  valor_pago DECIMAL(10,2),
  data_aquisicao DATE,
  quantidade_estoque INTEGER DEFAULT 1,
  foto_charuto TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de degustações
CREATE TABLE IF NOT EXISTS degustacoes (
  id SERIAL PRIMARY KEY,
  charuto_id INTEGER REFERENCES charutos(id) ON DELETE CASCADE,
  data_degustacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  momento VARCHAR(50),
  corte VARCHAR(50),
  fluxo VARCHAR(50),
  folha_anilhada TEXT,
  duracao_minutos INTEGER,
  nota INTEGER CHECK (nota >= 1 AND nota <= 10),
  construcao_queima TEXT,
  compraria_novamente VARCHAR(50),
  sabor_tabaco BOOLEAN DEFAULT FALSE,
  sabor_pimenta BOOLEAN DEFAULT FALSE,
  sabor_terroso BOOLEAN DEFAULT FALSE,
  sabor_flores BOOLEAN DEFAULT FALSE,
  sabor_cafe BOOLEAN DEFAULT FALSE,
  sabor_frutas BOOLEAN DEFAULT FALSE,
  sabor_chocolate BOOLEAN DEFAULT FALSE,
  sabor_castanhas BOOLEAN DEFAULT FALSE,
  sabor_madeira BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  observacao_anilha TEXT,
  foto_anilha TEXT,
  status VARCHAR(20) DEFAULT 'em_andamento',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security) se necessário
ALTER TABLE charutos ENABLE ROW LEVEL SECURITY;
ALTER TABLE degustacoes ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir todas as operações (ajuste conforme necessário)
CREATE POLICY "Allow all operations on charutos" ON charutos FOR ALL USING (true);
CREATE POLICY "Allow all operations on degustacoes" ON degustacoes FOR ALL USING (true);
