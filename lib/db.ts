import { createClient } from "@supabase/supabase-js"

// Verificar se as variáveis de ambiente estão disponíveis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.warn("NEXT_PUBLIC_SUPABASE_URL not found")
}

if (!supabaseServiceKey) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY not found")
}

// Cliente para operações do servidor (com service role key)
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export interface Charuto {
  id: number
  nome: string
  bitola?: string
  pais?: string
  valor_pago?: number
  data_aquisicao?: string
  quantidade_estoque: number
  foto_charuto?: string
  created_at: string
}

export interface Degustacao {
  id: number
  charuto_id: number
  data_degustacao: string
  momento?: string
  corte?: string
  fluxo?: string
  folha_anilhada?: string
  duracao_minutos?: number
  nota?: number
  construcao_queima?: string
  compraria_novamente?: string
  sabor_tabaco: boolean
  sabor_pimenta: boolean
  sabor_terroso: boolean
  sabor_flores: boolean
  sabor_cafe: boolean
  sabor_frutas: boolean
  sabor_chocolate: boolean
  sabor_castanhas: boolean
  sabor_madeira: boolean
  observacoes?: string
  observacao_anilha?: string
  foto_anilha?: string
  status: "em_andamento" | "finalizada"
  created_at: string
}

// Função para verificar se o Supabase está configurado
function checkSupabaseConfig() {
  if (!supabase) {
    throw new Error("Supabase not configured. Please check environment variables.")
  }
  return supabase
}

// Função para inicializar as tabelas
export async function initDatabase() {
  try {
    const client = checkSupabaseConfig()

    // Tentar fazer uma query simples para verificar a conexão
    const { error } = await client.from("charutos").select("id").limit(1)

    if (error && error.message.includes("relation") && error.message.includes("does not exist")) {
      console.log("Tables don't exist yet. Please create them using the SQL schema.")
      return { message: "Database connection successful, but tables need to be created" }
    }

    console.log("Database initialized successfully")
    return { message: "Database initialized successfully" }
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

// Funções para charutos
export async function getCharutos(): Promise<Charuto[]> {
  try {
    const client = checkSupabaseConfig()
    const { data, error } = await client.from("charutos").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching charutos:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getCharutos:", error)
    return []
  }
}

export async function getCharutoById(id: number): Promise<Charuto | null> {
  try {
    const client = checkSupabaseConfig()
    const { data, error } = await client.from("charutos").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching charuto:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getCharutoById:", error)
    return null
  }
}

export async function createCharuto(charuto: Omit<Charuto, "id" | "created_at">): Promise<Charuto> {
  const client = checkSupabaseConfig()
  const { data, error } = await client
    .from("charutos")
    .insert([
      {
        nome: charuto.nome,
        bitola: charuto.bitola,
        pais: charuto.pais,
        valor_pago: charuto.valor_pago,
        data_aquisicao: charuto.data_aquisicao,
        quantidade_estoque: charuto.quantidade_estoque,
        foto_charuto: charuto.foto_charuto,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating charuto:", error)
    throw new Error("Failed to create charuto")
  }

  return data
}

export async function updateCharuto(id: number, charuto: Partial<Charuto>): Promise<Charuto> {
  const client = checkSupabaseConfig()
  const { data, error } = await client
    .from("charutos")
    .update({
      nome: charuto.nome,
      bitola: charuto.bitola,
      pais: charuto.pais,
      valor_pago: charuto.valor_pago,
      data_aquisicao: charuto.data_aquisicao,
      quantidade_estoque: charuto.quantidade_estoque,
      foto_charuto: charuto.foto_charuto,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating charuto:", error)
    throw new Error("Failed to update charuto")
  }

  return data
}

export async function deleteCharuto(id: number): Promise<void> {
  const client = checkSupabaseConfig()
  const { error } = await client.from("charutos").delete().eq("id", id)

  if (error) {
    console.error("Error deleting charuto:", error)
    throw new Error("Failed to delete charuto")
  }
}

// Funções para degustações
export async function getDegustacoes(): Promise<Degustacao[]> {
  try {
    const client = checkSupabaseConfig()
    const { data, error } = await client
      .from("degustacoes")
      .select(`
        *,
        charutos (
          id,
          nome,
          bitola,
          pais
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching degustacoes:", error)
      return []
    }

    // Transformar os dados para o formato esperado
    return (data || []).map((item) => ({
      ...item,
      charuto: item.charutos,
    }))
  } catch (error) {
    console.error("Error in getDegustacoes:", error)
    return []
  }
}

export async function getDegustacaoById(id: number): Promise<Degustacao | null> {
  try {
    const client = checkSupabaseConfig()
    const { data, error } = await client
      .from("degustacoes")
      .select(`
        *,
        charutos (
          id,
          nome,
          bitola,
          pais
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching degustacao:", error)
      return null
    }

    return {
      ...data,
      charuto: data.charutos,
    }
  } catch (error) {
    console.error("Error in getDegustacaoById:", error)
    return null
  }
}

export async function getDegustacaoEmAndamento(): Promise<Degustacao[]> {
  try {
    const client = checkSupabaseConfig()
    const { data, error } = await client
      .from("degustacoes")
      .select(`
        *,
        charutos (
          id,
          nome,
          bitola,
          pais
        )
      `)
      .eq("status", "em_andamento")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching degustacoes em andamento:", error)
      return []
    }

    return (data || []).map((item) => ({
      ...item,
      charuto: item.charutos,
    }))
  } catch (error) {
    console.error("Error in getDegustacaoEmAndamento:", error)
    return []
  }
}

export async function createDegustacao(degustacao: Omit<Degustacao, "id" | "created_at">): Promise<Degustacao> {
  const client = checkSupabaseConfig()
  const { data, error } = await client
    .from("degustacoes")
    .insert([
      {
        charuto_id: degustacao.charuto_id,
        momento: degustacao.momento,
        corte: degustacao.corte,
        fluxo: degustacao.fluxo,
        folha_anilhada: degustacao.folha_anilhada,
        status: degustacao.status,
        data_degustacao: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating degustacao:", error)
    throw new Error("Failed to create degustacao")
  }

  return data
}

export async function finalizarDegustacao(id: number, dados: Partial<Degustacao>): Promise<Degustacao> {
  const client = checkSupabaseConfig()

  // Primeiro, reduzir o estoque do charuto se a degustação está sendo finalizada
  if (dados.status === "finalizada") {
    // Buscar o charuto_id da degustação
    const { data: degustacao } = await client.from("degustacoes").select("charuto_id").eq("id", id).single()

    if (degustacao) {
      // Reduzir o estoque
      const { data: charuto } = await client
        .from("charutos")
        .select("quantidade_estoque")
        .eq("id", degustacao.charuto_id)
        .single()

      if (charuto && charuto.quantidade_estoque > 0) {
        await client
          .from("charutos")
          .update({ quantidade_estoque: charuto.quantidade_estoque - 1 })
          .eq("id", degustacao.charuto_id)
      }
    }
  }

  // Atualizar a degustação
  const { data, error } = await client
    .from("degustacoes")
    .update({
      duracao_minutos: dados.duracao_minutos,
      nota: dados.nota,
      construcao_queima: dados.construcao_queima,
      compraria_novamente: dados.compraria_novamente,
      sabor_tabaco: dados.sabor_tabaco,
      sabor_pimenta: dados.sabor_pimenta,
      sabor_terroso: dados.sabor_terroso,
      sabor_flores: dados.sabor_flores,
      sabor_cafe: dados.sabor_cafe,
      sabor_frutas: dados.sabor_frutas,
      sabor_chocolate: dados.sabor_chocolate,
      sabor_castanhas: dados.sabor_castanhas,
      sabor_madeira: dados.sabor_madeira,
      observacoes: dados.observacoes,
      observacao_anilha: dados.observacao_anilha,
      foto_anilha: dados.foto_anilha,
      status: dados.status,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error finalizing degustacao:", error)
    throw new Error("Failed to finalize degustacao")
  }

  return data
}

export async function deleteDegustacao(id: number): Promise<void> {
  const client = checkSupabaseConfig()
  const { error } = await client.from("degustacoes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting degustacao:", error)
    throw new Error("Failed to delete degustacao")
  }
}

// Função para estatísticas do dashboard
export async function getDashboardStats() {
  try {
    const client = checkSupabaseConfig()

    // Total de charutos no estoque
    const { data: charutosData } = await client.from("charutos").select("quantidade_estoque")

    const total_charutos = charutosData?.reduce((sum, item) => sum + (item.quantidade_estoque || 0), 0) || 0

    // Total de degustações finalizadas
    const { count: total_degustacoes } = await client
      .from("degustacoes")
      .select("*", { count: "exact", head: true })
      .eq("status", "finalizada")

    // Média de notas
    const { data: notasData } = await client
      .from("degustacoes")
      .select("nota")
      .eq("status", "finalizada")
      .not("nota", "is", null)

    const media_notas =
      notasData && notasData.length > 0
        ? (notasData.reduce((sum, item) => sum + (item.nota || 0), 0) / notasData.length).toFixed(1)
        : "0.0"

    // Charuto favorito
    const { data: favoritoData } = await client
      .from("degustacoes")
      .select(`
        charuto_id,
        charutos (nome)
      `)
      .eq("status", "finalizada")

    const charutoCounts: { [key: string]: { nome: string; count: number } } = {}
    favoritoData?.forEach((item) => {
      const nome = item.charutos?.nome || "Desconhecido"
      if (charutoCounts[nome]) {
        charutoCounts[nome].count++
      } else {
        charutoCounts[nome] = { nome, count: 1 }
      }
    })

    const charutoFavorito = Object.values(charutoCounts).reduce(
      (max, current) => (current.count > max.count ? current : max),
      { nome: "Nenhum", count: 0 },
    )

    // Sabores mais comuns
    const { data: saboresData } = await client
      .from("degustacoes")
      .select(`
        sabor_tabaco, sabor_pimenta, sabor_terroso, sabor_flores,
        sabor_cafe, sabor_frutas, sabor_chocolate, sabor_castanhas, sabor_madeira
      `)
      .eq("status", "finalizada")

    const sabores = {
      tabaco: 0,
      pimenta: 0,
      terroso: 0,
      flores: 0,
      cafe: 0,
      frutas: 0,
      chocolate: 0,
      castanhas: 0,
      madeira: 0,
    }

    saboresData?.forEach((item) => {
      if (item.sabor_tabaco) sabores.tabaco++
      if (item.sabor_pimenta) sabores.pimenta++
      if (item.sabor_terroso) sabores.terroso++
      if (item.sabor_flores) sabores.flores++
      if (item.sabor_cafe) sabores.cafe++
      if (item.sabor_frutas) sabores.frutas++
      if (item.sabor_chocolate) sabores.chocolate++
      if (item.sabor_castanhas) sabores.castanhas++
      if (item.sabor_madeira) sabores.madeira++
    })

    return {
      total_charutos,
      total_degustacoes: total_degustacoes || 0,
      media_notas,
      charuto_favorito: {
        nome: charutoFavorito.nome,
        count: charutoFavorito.count,
      },
      sabores,
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      total_charutos: 0,
      total_degustacoes: 0,
      media_notas: "0.0",
      charuto_favorito: { nome: "Nenhum", count: 0 },
      sabores: {},
    }
  }
}
