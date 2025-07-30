// Simulação de banco de dados em memória para desenvolvimento
// Em produção, isso seria substituído por um banco real (PostgreSQL, etc.)

export interface Charuto {
  id: number;
  nome: string;
  bitola: string;
  pais: string;
  valor: number;
  data_aquisicao: string;
  quantidade_estoque: number;
  foto?: string;
}

export interface Degustacao {
  id: number;
  charuto_id: number;
  data: string;
  momento: string;
  duracao?: number;
  corte: string;
  fluxo: string;
  folha_anilhada: string;
  construcao_queima: string;
  nota?: number;
  sabor_tabaco: boolean;
  sabor_pimenta: boolean;
  sabor_terroso: boolean;
  sabor_flores: boolean;
  sabor_cafe: boolean;
  sabor_frutas: boolean;
  sabor_chocolate: boolean;
  sabor_castanhas: boolean;
  sabor_madeira: boolean;
  compraria_novamente?: string;
  observacao_anilha?: string;
  foto_anilha?: string;
  status: 'em_andamento' | 'finalizada';
}

// Dados em memória (em produção seria um banco real)
let charutos: Charuto[] = [];
let degustacoes: Degustacao[] = [];
let nextCharutoId = 1;
let nextDegustacaoId = 1;

// Funções para Charutos
export const getCharutos = (): Charuto[] => charutos;

export const getCharutoById = (id: number): Charuto | undefined => 
  charutos.find(c => c.id === id);

export const createCharuto = (charutoData: Omit<Charuto, 'id'>): Charuto => {
  const charuto: Charuto = {
    ...charutoData,
    id: nextCharutoId++
  };
  charutos.push(charuto);
  return charuto;
};

export const updateCharuto = (id: number, updates: Partial<Charuto>): Charuto | null => {
  const index = charutos.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  charutos[index] = { ...charutos[index], ...updates };
  return charutos[index];
};

export const deleteCharuto = (id: number): boolean => {
  const index = charutos.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  charutos.splice(index, 1);
  return true;
};

// Funções para Degustações
export const getDegustacoes = (): Degustacao[] => degustacoes;

export const getDegustacaoById = (id: number): Degustacao | undefined =>
  degustacoes.find(d => d.id === id);

export const getDegustacoesByStatus = (status: 'em_andamento' | 'finalizada'): Degustacao[] =>
  degustacoes.filter(d => d.status === status);

export const createDegustacao = (degustacaoData: Omit<Degustacao, 'id'>): Degustacao => {
  const degustacao: Degustacao = {
    ...degustacaoData,
    id: nextDegustacaoId++
  };
  degustacoes.push(degustacao);
  return degustacao;
};

export const updateDegustacao = (id: number, updates: Partial<Degustacao>): Degustacao | null => {
  const index = degustacoes.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  degustacoes[index] = { ...degustacoes[index], ...updates };
  return degustacoes[index];
};

export const deleteDegustacao = (id: number): boolean => {
  const index = degustacoes.findIndex(d => d.id === id);
  if (index === -1) return false;
  
  degustacoes.splice(index, 1);
  return true;
};

// Função para reduzir estoque após degustação
export const reduzirEstoque = (charutoId: number): boolean => {
  const charuto = getCharutoById(charutoId);
  if (!charuto || charuto.quantidade_estoque <= 0) return false;
  
  updateCharuto(charutoId, { 
    quantidade_estoque: charuto.quantidade_estoque - 1 
  });
  return true;
};

// Função para obter estatísticas do dashboard
export const getDashboardStats = () => {
  const totalCharutos = charutos.reduce((sum, c) => sum + c.quantidade_estoque, 0);
  const degustacoesFinalizada = getDegustacoesByStatus('finalizada');
  const totalDegustacoes = degustacoesFinalizada.length;
  
  // Média de notas
  const notasValidas = degustacoesFinalizada
    .map(d => d.nota)
    .filter((nota): nota is number => nota !== undefined && nota !== null);
  const mediaNota = notasValidas.length > 0 
    ? notasValidas.reduce((sum, nota) => sum + nota, 0) / notasValidas.length 
    : 0;

  // Charuto favorito
  const charutoCounts: { [key: number]: number } = {};
  degustacoesFinalizada.forEach(d => {
    charutoCounts[d.charuto_id] = (charutoCounts[d.charuto_id] || 0) + 1;
  });
  
  const charutoFavoritoId = Object.keys(charutoCounts).reduce((a, b) => 
    charutoCounts[Number(a)] > charutoCounts[Number(b)] ? a : b, '0');
  const charutoFavorito = charutoFavoritoId !== '0' ? getCharutoById(Number(charutoFavoritoId)) : null;

  // Sabores mais comuns
  const sabores = {
    Tabaco: degustacoesFinalizada.filter(d => d.sabor_tabaco).length,
    Pimenta: degustacoesFinalizada.filter(d => d.sabor_pimenta).length,
    Terroso: degustacoesFinalizada.filter(d => d.sabor_terroso).length,
    Flores: degustacoesFinalizada.filter(d => d.sabor_flores).length,
    Café: degustacoesFinalizada.filter(d => d.sabor_cafe).length,
    Frutas: degustacoesFinalizada.filter(d => d.sabor_frutas).length,
    Chocolate: degustacoesFinalizada.filter(d => d.sabor_chocolate).length,
    Castanhas: degustacoesFinalizada.filter(d => d.sabor_castanhas).length,
    Madeira: degustacoesFinalizada.filter(d => d.sabor_madeira).length,
  };

  return {
    total_charutos: totalCharutos,
    total_degustacoes: totalDegustacoes,
    media_notas: Math.round(mediaNota * 10) / 10,
    charuto_favorito: {
      nome: charutoFavorito?.nome || 'Nenhum',
      count: charutoFavoritoId !== '0' ? charutoCounts[Number(charutoFavoritoId)] : 0
    },
    sabores
  };
};

