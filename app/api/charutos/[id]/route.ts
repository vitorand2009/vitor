import { type NextRequest, NextResponse } from "next/server"
import { getCharutoById, updateCharuto, deleteCharuto } from "@/lib/db"
import { uploadImage } from "@/lib/storage"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const charuto = await getCharutoById(id)

    if (!charuto) {
      return NextResponse.json({ error: "Charuto not found" }, { status: 404 })
    }

    return NextResponse.json(charuto)
  } catch (error) {
    console.error("Error fetching charuto:", error)
    return NextResponse.json({ error: "Failed to fetch charuto" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const formData = await request.formData()

    const nome = formData.get("nome") as string
    const bitola = formData.get("bitola") as string
    const pais = formData.get("pais") as string
    const valor_pago = formData.get("valor_pago") as string
    const data_aquisicao = formData.get("data_aquisicao") as string
    const quantidade_estoque = formData.get("quantidade_estoque") as string
    const foto_charuto = formData.get("foto_charuto") as File

    const updateData: any = {}

    if (nome) updateData.nome = nome
    if (bitola) updateData.bitola = bitola
    if (pais) updateData.pais = pais
    if (valor_pago) updateData.valor_pago = Number.parseFloat(valor_pago)
    if (data_aquisicao) updateData.data_aquisicao = data_aquisicao
    if (quantidade_estoque) updateData.quantidade_estoque = Number.parseInt(quantidade_estoque)

    if (foto_charuto && foto_charuto.size > 0) {
      const foto_url = await uploadImage(foto_charuto, "charutos")
      updateData.foto_charuto = foto_url
    }

    const charuto = await updateCharuto(id, updateData)
    return NextResponse.json(charuto)
  } catch (error) {
    console.error("Error updating charuto:", error)
    return NextResponse.json({ error: "Failed to update charuto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    await deleteCharuto(id)
    return NextResponse.json({ message: "Charuto deleted successfully" })
  } catch (error) {
    console.error("Error deleting charuto:", error)
    return NextResponse.json({ error: "Failed to delete charuto" }, { status: 500 })
  }
}
