"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

interface Charuto {
  id: string
  nome: string
  marca: string
  origem: string
  vitola: string
  preco: number
  quantidade: number
}

export function Estoque() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingCharuto, setEditingCharuto] = useState<Charuto | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    marca: "",
    origem: "",
    vitola: "",
    preco: "",
    quantidade: "",
  })

  useEffect(() => {
    const data = localStorage.getItem("charutos")
    if (data) {
      setCharutos(JSON.parse(data))
    }
  }, [])

  const saveToStorage = (newCharutos: Charuto[]) => {
    localStorage.setItem("charutos", JSON.stringify(newCharutos))
    setCharutos(newCharutos)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const charutosData = {
      id: editingCharuto?.id || Date.now().toString(),
      nome: formData.nome,
      marca: formData.marca,
      origem: formData.origem,
      vitola: formData.vitola,
      preco: Number.parseFloat(formData.preco),
      quantidade: Number.parseInt(formData.quantidade),
    }

    let newCharutos
    if (editingCharuto) {
      newCharutos = charutos.map((c) => (c.id === editingCharuto.id ? charutosData : c))
    } else {
      newCharutos = [...charutos, charutosData]
    }

    saveToStorage(newCharutos)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      marca: "",
      origem: "",
      vitola: "",
      preco: "",
      quantidade: "",
    })
    setShowForm(false)
    setEditingCharuto(null)
  }

  const handleEdit = (charuto: Charuto) => {
    setEditingCharuto(charuto)
    setFormData({
      nome: charuto.nome,
      marca: charuto.marca,
      origem: charuto.origem,
      vitola: charuto.vitola,
      preco: charuto.preco.toString(),
      quantidade: charuto.quantidade.toString(),
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    const newCharutos = charutos.filter((c) => c.id !== id)
    saveToStorage(newCharutos)
  }

  const filteredCharutos = charutos.filter(
    (charuto) =>
      charuto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charuto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charuto.origem.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Estoque</h2>
          <p className="text-gray-600 mt-2">Gerencie seu acervo de charutos</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Charuto
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar charutos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCharuto ? "Editar Charuto" : "Adicionar Novo Charuto"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input
                  type="text"
                  required
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origem</label>
                <input
                  type="text"
                  required
                  value={formData.origem}
                  onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vitola</label>
                <input
                  type="text"
                  required
                  value={formData.vitola}
                  onChange={(e) => setFormData({ ...formData, vitola: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  required
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2 flex space-x-2">
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  {editingCharuto ? "Atualizar" : "Adicionar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharutos.map((charuto) => (
          <Card key={charuto.id}>
            <CardHeader>
              <CardTitle className="text-lg">{charuto.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Marca:</span> {charuto.marca}
                </p>
                <p>
                  <span className="font-medium">Origem:</span> {charuto.origem}
                </p>
                <p>
                  <span className="font-medium">Vitola:</span> {charuto.vitola}
                </p>
                <p>
                  <span className="font-medium">Preço:</span> R$ {charuto.preco.toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Quantidade:</span> {charuto.quantidade}
                </p>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(charuto)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(charuto.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCharutos.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhum charuto encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
