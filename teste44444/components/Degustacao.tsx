"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Plus } from "lucide-react"
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

interface Degustacao {
  id: number
  charuto_id: number
  data: string
  notas: string
  avaliacao: number
  ambiente: string
  acompanhamento: string
}

export function Degustacao() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [degustacoes, setDegustacoes] = useState<Degustacao[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    charuto_id: "",
    notas: "",
    avaliacao: 0,
    ambiente: "",
    acompanhamento: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCharutos()
    fetchDegustacoes()
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

  const fetchDegustacoes = async () => {
    try {
      const response = await fetch("/api/degustacoes")
      const data = await response.json()
      setDegustacoes(data)
    } catch (error) {
      console.error("Erro ao buscar degustações:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const degustacaoData = {
      charuto_id: Number.parseInt(formData.charuto_id),
      notas: formData.notas,
      avaliacao: formData.avaliacao,
      ambiente: formData.ambiente,
      acompanhamento: formData.acompanhamento,
    }

    try {
      const response = await fetch("/api/degustacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(degustacaoData),
      })

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Degustação registrada com sucesso.",
        })
        fetchDegustacoes()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar degustação.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      charuto_id: "",
      notas: "",
      avaliacao: 0,
      ambiente: "",
      acompanhamento: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-amber-800">Degustações</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Degustação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nova Degustação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="charuto">Charuto</Label>
                <Select
                  value={formData.charuto_id}
                  onValueChange={(value) => setFormData({ ...formData, charuto_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um charuto" />
                  </SelectTrigger>
                  <SelectContent>
                    {charutos.map((charuto) => (
                      <SelectItem key={charuto.id} value={charuto.id.toString()}>
                        {charuto.nome} - {charuto.marca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Avaliação</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        star <= formData.avaliacao ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setFormData({ ...formData, avaliacao: star })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="ambiente">Ambiente</Label>
                <Input
                  id="ambiente"
                  value={formData.ambiente}
                  onChange={(e) => setFormData({ ...formData, ambiente: e.target.value })}
                  placeholder="Ex: Terraço, Escritório, Clube..."
                />
              </div>

              <div>
                <Label htmlFor="acompanhamento">Acompanhamento</Label>
                <Input
                  id="acompanhamento"
                  value={formData.acompanhamento}
                  onChange={(e) => setFormData({ ...formData, acompanhamento: e.target.value })}
                  placeholder="Ex: Whisky, Café, Vinho..."
                />
              </div>

              <div>
                <Label htmlFor="notas">Notas de Degustação</Label>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Descreva sua experiência com este charuto..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Registrar Degustação
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {degustacoes.map((degustacao) => {
          const charuto = charutos.find((c) => c.id === degustacao.charuto_id)
          return (
            <Card key={degustacao.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{charuto?.nome || "Charuto não encontrado"}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < degustacao.avaliacao ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Data:</strong> {new Date(degustacao.data).toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    <strong>Ambiente:</strong> {degustacao.ambiente}
                  </p>
                  <p>
                    <strong>Acompanhamento:</strong> {degustacao.acompanhamento}
                  </p>
                  <p>
                    <strong>Notas:</strong>
                  </p>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">{degustacao.notas}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
