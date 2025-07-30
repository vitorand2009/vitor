import { NextResponse } from "next/server"
import { getDegustacaoEmAndamento } from "@/lib/db"

export async function GET() {
  try {
    const degustacoes = await getDegustacaoEmAndamento()
    return NextResponse.json(degustacoes)
  } catch (error) {
    console.error("Error fetching degustacoes em andamento:", error)
    return NextResponse.json({ error: "Failed to fetch degustacoes em andamento" }, { status: 500 })
  }
}
