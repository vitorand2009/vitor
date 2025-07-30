"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Package, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

interface Charuto {
  id: number
  nome: string
  bitola?: string
  pais?: string
  valor_pago?: number
  data_aquisicao?: string
  quantidade_estoque: number
  foto_charuto?: string
}

export default function EstoquePage() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingCharuto, setEditingCharuto] = useState<Charuto | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    bitola: "",
    pais: "",
    valor_pago: "",
    data_aquisicao: "",
    quantidade_estoque: "1",
    foto_charuto: null as File | null,
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    fetchCharutos()
  }, [])

  const fetchCharutos = async () => {
    try {
      const response = await fetch("/api/charutos")
      const data = await response.json()
      setCharutos(data)
    } catch (error) {
      console.error("Erro ao buscar charutos:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        foto_charuto: file,
      }))

      const reader = new FileReader()
      reader.onload = (e) => setPreviewImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formDataToSend.append(key, value as string | File)
      }
    })

    try {
      const url = editingCharuto ? `/api/charutos/${editingCharuto.id}` : "/api/charutos"
      const method = editingCharuto ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      if (response.ok) {
        fetchCharutos()
        resetForm()
        setShowModal(false)
      } else {
        console.error("Erro ao salvar charuto")
      }
    } catch (error) {
      console.error("Erro ao salvar charuto:", error)
    }
  }

  const handleEdit = (charuto: Charuto) => {
    setEditingCharuto(charuto)
    setFormData({
      nome: charuto.nome || "",
      bitola: charuto.bitola || "",
      pais: charuto.pais || "",
      valor_pago: charuto.valor_pago?.toString() || "",
      data_aquisicao: charuto.data_aquisicao || "",
      quantidade_estoque: charuto.quantidade_estoque?.toString() || "1",
      foto_charuto: null,
    })
    if (charuto.foto_charuto) {
      setPreviewImage(charuto.foto_charuto)
    }
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar este charuto?")) {
      try {
        const response = await fetch(`/api/charutos/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          fetchCharutos()
        }
      } catch (error) {
        console.error("Erro ao deletar charuto:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      bitola: "",
      pais: "",
      valor_pago: "",
      data_aquisicao: "",
      quantidade_estoque: "1",
      foto_charuto: null,
    })
    setEditingCharuto(null)
    setPreviewImage(null)
  }

  const filteredCharutos = charutos.filter(
    (charuto) =>
      charuto.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charuto.pais?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charuto.bitola?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Estoque de Charutos</h1>
          <p className="text-gray-600">Gerencie sua coleção de charutos</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white shadow-md">
          <Plus size={20} className="mr-2" />
          Adicionar Charuto
        </Button>
      </div>

      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Buscar por nome, país ou bitola..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white shadow-sm"
        />
      </div>

      {/* Grid de charutos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCharutos.map((charuto) => (
          <Card key={charuto.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center rounded-t-lg overflow-hidden">
              {charuto.foto_charuto ? (
                <img
                  src={charuto.foto_charuto || "/placeholder.svg"}
                  alt={charuto.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package size={48} className="text-gray-400" />
              )}
            </div>

            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2 text-gray-800">{charuto.nome}</CardTitle>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                {charuto.bitola && (
                  <p>
                    <span className="font-medium">Bitola:</span> {charuto.bitola}
                  </p>
                )}
                {charuto.pais && (
                  <p>
                    <span className="font-medium">País:</span> {charuto.pais}
                  </p>
                )}
                {charuto.valor_pago && (
                  <p>
                    <span className="font-medium">Valor:</span> R$ {charuto.valor_pago}
                  </p>
                )}
                <p>
                  <span className="font-medium">Estoque:</span> {charuto.quantidade_estoque}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(charuto)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  <Edit size={16} className="mr-1" />
                  Editar
                </Button>
                <Button
                  onClick={() => handleDelete(charuto.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCharutos.length === 0 && (
        <div className="text-center py-12">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum charuto encontrado</h3>
          <p className="text-gray-500">
            {searchTerm ? "Tente ajustar sua busca" : "Adicione seu primeiro charuto ao estoque"}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingCharuto ? "Editar Charuto" : "Adicionar Charuto"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <Input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bitola</label>
                  <Input
                    type="text"
                    name="bitola"
                    value={formData.bitola}
                    onChange={handleInputChange}
                    className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                  <Input
                    type="text"
                    name="pais"
                    value={formData.pais}
                    onChange={handleInputChange}
                    className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Pago (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    name="valor_pago"
                    value={formData.valor_pago}
                    onChange={handleInputChange}
                    className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Aquisição</label>
                  <Input
                    type="date"
                    name="data_aquisicao"
                    value={formData.data_aquisicao}
                    onChange={handleInputChange}
                    className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade em Estoque</label>
                  <Input
                    type="number"
                    min="0"
                    name="quantidade_estoque"
                    value={formData.quantidade_estoque}
                    onChange={handleInputChange}
                    className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Charuto</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                    <div className="space-y-1 text-center">
                      {previewImage ? (
                        <div className="mb-4">
                          <img
                            src={previewImage || "/placeholder.svg"}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500">
                          <span>Escolher arquivo</span>
                          <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                    {editingCharuto ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
