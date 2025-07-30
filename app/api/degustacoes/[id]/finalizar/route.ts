import { type NextRequest, NextResponse } from "next/server"
import { finalizarDegustacao } from "@/lib/db"
import { uploadImage } from "@/lib/storage"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const formData = await request.formData()

    const duracao_minutos = formData.get("duracao_minutos") as string
    const nota = formData.get("nota") as string
    const construcao_queima = formData.get("construcao_queima") as string
    const compraria_novamente = formData.get("compraria_novamente") as string
    const observacoes = formData.get("observacoes") as string
    const observacao_anilha = formData.get("observacao_anilha") as string
    const foto_anilha = formData.get("foto_anilha") as File

    const updateData: any = {
      status: "finalizada",
    }

    if (duracao_minutos) updateData.duracao_minutos = Number.parseInt(duracao_minutos)
    if (nota) updateData.nota = Number.parseInt(nota)
    if (construcao_queima) updateData.construcao_queima = construcao_queima
    if (compraria_novamente) updateData.compraria_novamente = compraria_novamente
    if (observacoes) updateData.observacoes = observacoes
    if (observacao_anilha) updateData.observacao_anilha = observacao_anilha

    // Sabores
    updateData.sabor_tabaco = formData.get("sabor_tabaco") === "true"
    updateData.sabor_pimenta = formData.get("sabor_pimenta") === "true"
    updateData.sabor_terroso = formData.get("sabor_terroso") === "true"
    updateData.sabor_flores = formData.get("sabor_flores") === "true"
    updateData.sabor_cafe = formData.get("sabor_cafe") === "true"
    updateData.sabor_frutas = formData.get("sabor_frutas") === "true"
    updateData.sabor_chocolate = formData.get("sabor_chocolate") === "true"
    updateData.sabor_castanhas = formData.get("sabor_castanhas") === "true"
    updateData.sabor_madeira = formData.get("sabor_madeira") === "true"

    if (foto_anilha && foto_anilha.size > 0) {
      const foto_url = await uploadImage(foto_anilha, "anilhas")
      updateData.foto_anilha = foto_url
    }

    const degustacao = await finalizarDegustacao(id, updateData)
    return NextResponse.json(degustacao)
  } catch (error) {
    console.error("Error finalizing degustacao:", error)
    return NextResponse.json({ error: "Failed to finalize degustacao" }, { status: 500 })
  }
}
