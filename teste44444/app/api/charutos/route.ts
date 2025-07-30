import { type NextRequest, NextResponse } from "next/server"

// Simulando dados em memória (em produção, use um banco de dados)
const charutos = [
  {
    id: 1,
    nome: "Cohiba Robusto",
    marca: "Cohiba",
    origem: "Cuba",
    tamanho: "Robusto",
    preco: 45.0,
    estoque: 10,
  },
  {
    id: 2,
    nome: "Montecristo No. 2",
    marca: "Montecristo",
    origem: "Cuba",
    tamanho: "Torpedo",
    preco: 35.0,
    estoque: 15,
  },
  {
    id: 3,
    nome: "Romeo y Julieta Churchill",
    marca: "Romeo y Julieta",
    origem: "Cuba",
    tamanho: "Churchill",
    preco: 28.0,
    estoque: 8,
  },
]

export async function GET() {
  return NextResponse.json(charutos)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newId = Math.max(...charutos.map((c) => c.id), 0) + 1

    const newCharuto = {
      id: newId,
      nome: data.nome,
      marca: data.marca,
      origem: data.origem,
      tamanho: data.tamanho,
      preco: data.preco,
      estoque: data.estoque,
    }

    charutos.push(newCharuto)
    return NextResponse.json(newCharuto, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao adicionar charuto" }, { status: 500 })
  }
}
