import { type NextRequest, NextResponse } from "next/server"
import { getCharutos, createCharuto } from "@/lib/db"
import { uploadImage } from "@/lib/storage"

export async function GET() {
  try {
    const charutos = await getCharutos()
    return NextResponse.json(charutos)
  } catch (error) {
    console.error("Error fetching charutos:", error)
    return NextResponse.json({ error: "Failed to fetch charutos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const nome = formData.get("nome") as string
    const bitola = formData.get("bitola") as string
    const pais = formData.get("pais") as string
    const valor_pago = formData.get("valor_pago") as string
    const data_aquisicao = formData.get("data_aquisicao") as string
    const quantidade_estoque = formData.get("quantidade_estoque") as string
    const foto_charuto = formData.get("foto_charuto") as File

    if (!nome) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    let foto_url = ""
    if (foto_charuto && foto_charuto.size > 0) {
      foto_url = await uploadImage(foto_charuto, "charutos")
    }

    const charuto = await createCharuto({
      nome,
      bitola: bitola || undefined,
      pais: pais || undefined,
      valor_pago: valor_pago ? Number.parseFloat(valor_pago) : undefined,
      data_aquisicao: data_aquisicao || undefined,
      quantidade_estoque: quantidade_estoque ? Number.parseInt(quantidade_estoque) : 1,
      foto_charuto: foto_url || undefined,
    })

    return NextResponse.json(charuto, { status: 201 })
  } catch (error) {
    console.error("Error creating charuto:", error)
    return NextResponse.json({ error: "Failed to create charuto" }, { status: 500 })
  }
}
