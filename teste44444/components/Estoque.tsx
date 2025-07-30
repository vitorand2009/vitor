"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Charuto {
  id: number
  nome: string
  marca: string
  origem: string
  tamanho: string
  preco: number
  estoque: number
}

export function Estoque() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCharuto, setEditingCharuto] = useState<Charuto | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    marca: "",
    origem: "",
    tamanho: "",
    preco: "",
    estoque: "",
  })
  const { toast } = useToast()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const charutosData = {
      nome: formData.nome,
      marca: formData.marca,
      origem: formData.origem,
      tamanho: formData.tamanho,
      preco: Number.parseFloat(formData.preco),
      estoque: Number.parseInt(formData.estoque),
    }

    try {
      const response = await fetch("/api/charutos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(charutosData),
      })

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Charuto adicionado com sucesso.",
        })
        fetchCharutos()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar charuto.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      marca: "",
      origem: "",
      tamanho: "",
      preco: "",
      estoque: "",
    })
    setEditingCharuto(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-amber-800">Estoque de Charutos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Charuto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Charuto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="origem">Origem</Label>
                <Input
                  id="origem"
                  value={formData.origem}
                  onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tamanho">Tamanho</Label>
                <Input
                  id="tamanho"
                  value={formData.tamanho}
                  onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="estoque">Quantidade em Estoque</Label>
                <Input
                  id="estoque"
                  type="number"
                  value={formData.estoque}
                  onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Adicionar Charuto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {charutos.map((charuto) => (
          <Card key={charuto.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{charuto.nome}</span>
                <Badge variant={charuto.estoque > 5 ? "default" : "destructive"}>{charuto.estoque} un.</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Marca:</strong> {charuto.marca}
                </p>
                <p>
                  <strong>Origem:</strong> {charuto.origem}
                </p>
                <p>
                  <strong>Tamanho:</strong> {charuto.tamanho}
                </p>
                <p>
                  <strong>Preço:</strong> R$ {charuto.preco.toFixed(2)}
                </p>
                <p>
                  <strong>Valor Total:</strong> R$ {(charuto.preco * charuto.estoque).toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="destructive" size="sm" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
