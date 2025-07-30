export async function uploadImage(file: File, folder: "charutos" | "anilhas"): Promise<string> {
  try {
    // Para desenvolvimento, vamos simular o upload retornando uma URL de placeholder
    const filename = `${folder}/${Date.now()}-${file.name}`

    // Em produção, isso seria substituído pelo Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob")
      const blob = await put(filename, file, {
        access: "public",
      })
      return blob.url
    }

    // Fallback para desenvolvimento
    return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(file.name)}`
  } catch (error) {
    console.error("Error uploading image:", error)
    // Retorna placeholder em caso de erro
    return `/placeholder.svg?height=200&width=200&text=Error`
  }
}

export function getImageUrl(filename: string): string {
  if (filename.startsWith("http")) {
    return filename
  }

  return filename
}
