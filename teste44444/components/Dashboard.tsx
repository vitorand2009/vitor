"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, Star, DollarSign } from "lucide-react"

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

export function Dashboard() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [degustacoes, setDegustacoes] = useState<Degustacao[]>([])

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

  const totalEstoque = charutos.reduce((sum, charuto) => sum + charuto.estoque, 0)
  const valorTotal = charutos.reduce((sum, charuto) => sum + charuto.preco * charuto.estoque, 0)
  const mediaAvaliacoes =
    degustacoes.length > 0 ? degustacoes.reduce((sum, deg) => sum + deg.avaliacao, 0) / degustacoes.length : 0

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-amber-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Charutos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEstoque}</div>
            <p className="text-xs text-muted-foreground">{charutos.length} tipos diferentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {valorTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Valor do estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Degustações</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{degustacoes.length}</div>
            <p className="text-xs text-muted-foreground">Total realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaAvaliacoes.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">De 5 estrelas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Charutos em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {charutos.slice(0, 5).map((charuto) => (
                <div key={charuto.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{charuto.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {charuto.marca} - {charuto.origem}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={charuto.estoque > 5 ? "default" : "destructive"}>{charuto.estoque} unidades</Badge>
                    <p className="text-sm text-muted-foreground">R$ {charuto.preco.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Degustações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {degustacoes
                .slice(-5)
                .reverse()
                .map((degustacao) => {
                  const charuto = charutos.find((c) => c.id === degustacao.charuto_id)
                  return (
                    <div key={degustacao.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{charuto?.nome || "Charuto não encontrado"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(degustacao.data).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
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
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
