import { type NextRequest, NextResponse } from "next/server"

// Simulando dados em memória (em produção, use um banco de dados)
const degustacoes = [
  {
    id: 1,
    charuto_id: 1,
    data: "2024-01-15T19:30:00.000Z",
    notas: "Excelente charuto com notas de couro e especiarias. Queima uniforme e boa construção.",
    avaliacao: 5,
    ambiente: "Terraço",
    acompanhamento: "Whisky Single Malt",
  },
  {
    id: 2,
    charuto_id: 2,
    data: "2024-01-10T20:00:00.000Z",
    notas: "Sabor equilibrado com toques de madeira e café. Muito agradável.",
    avaliacao: 4,
    ambiente: "Escritório",
    acompanhamento: "Café Espresso",
  },
]

export async function GET() {
  return NextResponse.json(degustacoes)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newId = Math.max(...degustacoes.map((d) => d.id), 0) + 1

    const newDegustacao = {
      id: newId,
      charuto_id: data.charuto_id,
      data: new Date().toISOString(),
      notas: data.notas,
      avaliacao: data.avaliacao,
      ambiente: data.ambiente,
      acompanhamento: data.acompanhamento,
    }

    degustacoes.push(newDegustacao)
    return NextResponse.json(newDegustacao, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao adicionar degustação" }, { status: 500 })
  }
}
