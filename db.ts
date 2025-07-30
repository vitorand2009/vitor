import { sql } from '@vercel/postgres';

export interface Charuto {
  id: number;
  nome: string;
  bitola?: string;
  pais?: string;
  valor_pago?: number;
  data_aquisicao?: string;
  quantidade_estoque: number;
  foto_charuto?: string;
  created_at: string;
}

export interface Degustacao {
  id: number;
  charuto_id: number;
  data_degustacao: string;
  momento?: string;
  corte?: string;
  fluxo?: string;
  folha_anilhada?: string;
  duracao_minutos?: number;
  nota?: number;
  construcao_queima?: string;
  compraria_novamente?: string;
  sabor_tabaco: boolean;
  sabor_pimenta: boolean;
  sabor_terroso: boolean;
  sabor_flores: boolean;
  sabor_cafe: boolean;
  sabor_frutas: boolean;
  sabor_chocolate: boolean;
  sabor_castanhas: boolean;
  sabor_madeira: boolean;
  observacoes?: string;
  observacao_anilha?: string;
  foto_anilha?: string;
  status: 'em_andamento' | 'finalizada';
  created_at: string;
}

// Função para inicializar as tabelas
export async function initDatabase() {
  try {
    // Criar tabela de charutos
    await sql`
      CREATE TABLE IF NOT EXISTS charutos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        bitola VARCHAR(100),
        pais VARCHAR(100),
        valor_pago DECIMAL(10,2),
        data_aquisicao DATE,
        quantidade_estoque INTEGER DEFAULT 1,
        foto_charuto VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Criar tabela de degustações
    await sql`
      CREATE TABLE IF NOT EXISTS degustacoes (
        id SERIAL PRIMARY KEY,
        charuto_id INTEGER REFERENCES charutos(id) ON DELETE CASCADE,
        data_degustacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
        foto_anilha VARCHAR(255),
        status VARCHAR(20) DEFAULT 'em_andamento',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Funções para charutos
export async function getCharutos(): Promise<Charuto[]> {
  const { rows } = await sql`SELECT * FROM charutos ORDER BY created_at DESC`;
  return rows as Charuto[];
}

export async function getCharutoById(id: number): Promise<Charuto | null> {
  const { rows } = await sql`SELECT * FROM charutos WHERE id = ${id}`;
  return rows[0] as Charuto || null;
}

export async function createCharuto(charuto: Omit<Charuto, 'id' | 'created_at'>): Promise<Charuto> {
  const { rows } = await sql`
    INSERT INTO charutos (nome, bitola, pais, valor_pago, data_aquisicao, quantidade_estoque, foto_charuto)
    VALUES (${charuto.nome}, ${charuto.bitola}, ${charuto.pais}, ${charuto.valor_pago}, ${charuto.data_aquisicao}, ${charuto.quantidade_estoque}, ${charuto.foto_charuto})
    RETURNING *
  `;
  return rows[0] as Charuto;
}

export async function updateCharuto(id: number, charuto: Partial<Charuto>): Promise<Charuto> {
  const { rows } = await sql`
    UPDATE charutos 
    SET nome = COALESCE(${charuto.nome}, nome),
        bitola = COALESCE(${charuto.bitola}, bitola),
        pais = COALESCE(${charuto.pais}, pais),
        valor_pago = COALESCE(${charuto.valor_pago}, valor_pago),
        data_aquisicao = COALESCE(${charuto.data_aquisicao}, data_aquisicao),
        quantidade_estoque = COALESCE(${charuto.quantidade_estoque}, quantidade_estoque),
        foto_charuto = COALESCE(${charuto.foto_charuto}, foto_charuto)
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Charuto;
}

export async function deleteCharuto(id: number): Promise<void> {
  await sql`DELETE FROM charutos WHERE id = ${id}`;
}

// Funções para degustações
export async function getDegustacoes(): Promise<Degustacao[]> {
  const { rows } = await sql`
    SELECT d.*, c.nome as charuto_nome 
    FROM degustacoes d 
    LEFT JOIN charutos c ON d.charuto_id = c.id 
    ORDER BY d.created_at DESC
  `;
  return rows as Degustacao[];
}

export async function getDegustacaoById(id: number): Promise<Degustacao | null> {
  const { rows } = await sql`
    SELECT d.*, c.nome as charuto_nome 
    FROM degustacoes d 
    LEFT JOIN charutos c ON d.charuto_id = c.id 
    WHERE d.id = ${id}
  `;
  return rows[0] as Degustacao || null;
}

export async function getDegustacaoEmAndamento(): Promise<Degustacao[]> {
  const { rows } = await sql`
    SELECT d.*, c.nome as charuto_nome 
    FROM degustacoes d 
    LEFT JOIN charutos c ON d.charuto_id = c.id 
    WHERE d.status = 'em_andamento'
    ORDER BY d.created_at DESC
  `;
  return rows as Degustacao[];
}

export async function createDegustacao(degustacao: Omit<Degustacao, 'id' | 'created_at'>): Promise<Degustacao> {
  const { rows } = await sql`
    INSERT INTO degustacoes (
      charuto_id, momento, corte, fluxo, folha_anilhada, status
    ) VALUES (
      ${degustacao.charuto_id}, ${degustacao.momento}, ${degustacao.corte}, 
      ${degustacao.fluxo}, ${degustacao.folha_anilhada}, ${degustacao.status}
    )
    RETURNING *
  `;
  return rows[0] as Degustacao;
}

export async function finalizarDegustacao(id: number, dados: Partial<Degustacao>): Promise<Degustacao> {
  // Primeiro, reduzir o estoque do charuto
  if (dados.status === 'finalizada') {
    await sql`
      UPDATE charutos 
      SET quantidade_estoque = quantidade_estoque - 1 
      WHERE id = (SELECT charuto_id FROM degustacoes WHERE id = ${id})
      AND quantidade_estoque > 0
    `;
  }

  // Depois, atualizar a degustação
  const { rows } = await sql`
    UPDATE degustacoes 
    SET duracao_minutos = COALESCE(${dados.duracao_minutos}, duracao_minutos),
        nota = COALESCE(${dados.nota}, nota),
        construcao_queima = COALESCE(${dados.construcao_queima}, construcao_queima),
        compraria_novamente = COALESCE(${dados.compraria_novamente}, compraria_novamente),
        sabor_tabaco = COALESCE(${dados.sabor_tabaco}, sabor_tabaco),
        sabor_pimenta = COALESCE(${dados.sabor_pimenta}, sabor_pimenta),
        sabor_terroso = COALESCE(${dados.sabor_terroso}, sabor_terroso),
        sabor_flores = COALESCE(${dados.sabor_flores}, sabor_flores),
        sabor_cafe = COALESCE(${dados.sabor_cafe}, sabor_cafe),
        sabor_frutas = COALESCE(${dados.sabor_frutas}, sabor_frutas),
        sabor_chocolate = COALESCE(${dados.sabor_chocolate}, sabor_chocolate),
        sabor_castanhas = COALESCE(${dados.sabor_castanhas}, sabor_castanhas),
        sabor_madeira = COALESCE(${dados.sabor_madeira}, sabor_madeira),
        observacoes = COALESCE(${dados.observacoes}, observacoes),
        observacao_anilha = COALESCE(${dados.observacao_anilha}, observacao_anilha),
        foto_anilha = COALESCE(${dados.foto_anilha}, foto_anilha),
        status = COALESCE(${dados.status}, status)
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Degustacao;
}

export async function deleteDegustacao(id: number): Promise<void> {
  await sql`DELETE FROM degustacoes WHERE id = ${id}`;
}

// Função para estatísticas do dashboard
export async function getDashboardStats() {
  // Total de charutos no estoque
  const { rows: charutosRows } = await sql`
    SELECT COALESCE(SUM(quantidade_estoque), 0) as total_charutos FROM charutos
  `;
  
  // Total de degustações finalizadas
  const { rows: degustacaoRows } = await sql`
    SELECT COUNT(*) as total_degustacoes FROM degustacoes WHERE status = 'finalizada'
  `;
  
  // Média de notas
  const { rows: mediaRows } = await sql`
    SELECT COALESCE(AVG(nota), 0) as media_notas 
    FROM degustacoes 
    WHERE status = 'finalizada' AND nota IS NOT NULL
  `;
  
  // Charuto favorito
  const { rows: favoritoRows } = await sql`
    SELECT c.nome, COUNT(d.id) as count
    FROM charutos c
    LEFT JOIN degustacoes d ON c.id = d.charuto_id AND d.status = 'finalizada'
    GROUP BY c.id, c.nome
    ORDER BY count DESC
    LIMIT 1
  `;
  
  // Sabores mais comuns
  const { rows: saboresRows } = await sql`
    SELECT 
      SUM(CASE WHEN sabor_tabaco THEN 1 ELSE 0 END) as tabaco,
      SUM(CASE WHEN sabor_pimenta THEN 1 ELSE 0 END) as pimenta,
      SUM(CASE WHEN sabor_terroso THEN 1 ELSE 0 END) as terroso,
      SUM(CASE WHEN sabor_flores THEN 1 ELSE 0 END) as flores,
      SUM(CASE WHEN sabor_cafe THEN 1 ELSE 0 END) as cafe,
      SUM(CASE WHEN sabor_frutas THEN 1 ELSE 0 END) as frutas,
      SUM(CASE WHEN sabor_chocolate THEN 1 ELSE 0 END) as chocolate,
      SUM(CASE WHEN sabor_castanhas THEN 1 ELSE 0 END) as castanhas,
      SUM(CASE WHEN sabor_madeira THEN 1 ELSE 0 END) as madeira
    FROM degustacoes 
    WHERE status = 'finalizada'
  `;

  return {
    total_charutos: parseInt(charutosRows[0].total_charutos),
    total_degustacoes: parseInt(degustacaoRows[0].total_degustacoes),
    media_notas: parseFloat(mediaRows[0].media_notas).toFixed(1),
    charuto_favorito: {
      nome: favoritoRows[0]?.nome || 'Nenhum',
      count: parseInt(favoritoRows[0]?.count || 0)
    },
    sabores: saboresRows[0] || {}
  };
}
