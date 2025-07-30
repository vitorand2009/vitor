import { type NextRequest, NextResponse } from "next/server"
import { getDegustacoes, createDegustacao } from "@/lib/db"

export async function GET() {
  try {
    const degustacoes = await getDegustacoes()
    return NextResponse.json(degustacoes)
  } catch (error) {
    console.error("Error fetching degustacoes:", error)
    return NextResponse.json({ error: "Failed to fetch degustacoes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.charuto_id) {
      return NextResponse.json({ error: "Charuto é obrigatório" }, { status: 400 })
    }

    const degustacao = await createDegustacao({
      charuto_id: Number.parseInt(data.charuto_id),
      momento: data.momento,
      corte: data.corte,
      fluxo: data.fluxo,
      folha_anilhada: data.folha_anilhada,
      status: "em_andamento",
      data_degustacao: new Date().toISOString(),
      duracao_minutos: undefined,
      nota: undefined,
      construcao_queima: undefined,
      compraria_novamente: undefined,
      sabor_tabaco: false,
      sabor_pimenta: false,
      sabor_terroso: false,
      sabor_flores: false,
      sabor_cafe: false,
      sabor_frutas: false,
      sabor_chocolate: false,
      sabor_castanhas: false,
      sabor_madeira: false,
      observacoes: undefined,
      observacao_anilha: undefined,
      foto_anilha: undefined,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json(degustacao, { status: 201 })
  } catch (error) {
    console.error("Error creating degustacao:", error)
    return NextResponse.json({ error: "Failed to create degustacao" }, { status: 500 })
  }
}
