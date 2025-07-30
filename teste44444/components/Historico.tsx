"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search } from "lucide-react"

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

export function Historico() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [degustacoes, setDegustacoes] = useState<Degustacao[]>([])
  const [filteredDegustacoes, setFilteredDegustacoes] = useState<Degustacao[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAvaliacao, setFilterAvaliacao] = useState("all")

  useEffect(() => {
    fetchCharutos()
    fetchDegustacoes()
  }, [])

  useEffect(() => {
    filterDegustacoes()
  }, [degustacoes, searchTerm, filterAvaliacao])

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

  const filterDegustacoes = () => {
    let filtered = degustacoes

    if (searchTerm) {
      filtered = filtered.filter((degustacao) => {
        const charuto = charutos.find((c) => c.id === degustacao.charuto_id)
        return (
          charuto?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          charuto?.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          degustacao.notas.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    if (filterAvaliacao !== "all") {
      filtered = filtered.filter((degustacao) => degustacao.avaliacao === Number.parseInt(filterAvaliacao))
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

    setFilteredDegustacoes(filtered)
  }

  const getCharutoStats = () => {
    const stats = charutos.map((charuto) => {
      const charutoDegustacoes = degustacoes.filter((d) => d.charuto_id === charuto.id)
      const totalDegustacoes = charutoDegustacoes.length
      const mediaAvaliacao =
        totalDegustacoes > 0 ? charutoDegustacoes.reduce((sum, d) => sum + d.avaliacao, 0) / totalDegustacoes : 0

      return {
        charuto,
        totalDegustacoes,
        mediaAvaliacao,
      }
    })

    return stats.sort((a, b) => b.totalDegustacoes - a.totalDegustacoes)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-amber-800">Histórico de Degustações</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por charuto, marca ou notas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAvaliacao} onValueChange={setFilterAvaliacao}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por avaliação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as avaliações</SelectItem>
                <SelectItem value="5">5 estrelas</SelectItem>
                <SelectItem value="4">4 estrelas</SelectItem>
                <SelectItem value="3">3 estrelas</SelectItem>
                <SelectItem value="2">2 estrelas</SelectItem>
                <SelectItem value="1">1 estrela</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredDegustacoes.map((degustacao) => {
              const charuto = charutos.find((c) => c.id === degustacao.charuto_id)
              return (
                <Card key={degustacao.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <div>
                        <span>{charuto?.nome || "Charuto não encontrado"}</span>
                        <p className="text-sm text-muted-foreground font-normal">
                          {charuto?.marca} - {charuto?.origem}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < degustacao.avaliacao ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(degustacao.data).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex gap-4">
                        <Badge variant="outline">{degustacao.ambiente}</Badge>
                        <Badge variant="outline">{degustacao.acompanhamento}</Badge>
                      </div>
                      <p className="text-sm bg-gray-50 p-3 rounded">{degustacao.notas}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas dos Charutos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getCharutoStats()
                  .slice(0, 10)
                  .map(({ charuto, totalDegustacoes, mediaAvaliacao }) => (
                    <div key={charuto.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{charuto.nome}</p>
                        <p className="text-xs text-muted-foreground">{charuto.marca}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{totalDegustacoes} degustações</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{mediaAvaliacao.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
