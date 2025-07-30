"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Star } from "lucide-react"

interface Charuto {
  id: string
  nome: string
  marca: string
  origem: string
  vitola: string
  preco: number
  quantidade: number
}

interface Degustacao {
  id: string
  charutoid: string
  data: string
  duracao: number
  avaliacao: number
  observacoes: string
  finalizada: boolean
}

export function Historico() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [degustacoes, setDegustacoes] = useState<Degustacao[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const charutosData = localStorage.getItem("charutos")
    const degustacoesData = localStorage.getItem("degustacoes")

    if (charutosData) {
      setCharutos(JSON.parse(charutosData))
    }

    if (degustacoesData) {
      setDegustacoes(JSON.parse(degustacoesData))
    }
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes}min`
  }

  const degustacoesFinalizadas = degustacoes.filter((d) => d.finalizada)

  const filteredDegustacoes = degustacoesFinalizadas.filter((degustacao) => {
    const charuto = charutos.find((c) => c.id === degustacao.charutoid)
    if (!charuto) return false

    return (
      charuto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charuto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      degustacao.observacoes.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Histórico</h2>
        <p className="text-gray-600 mt-2">Suas degustações anteriores</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar degustações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4">
        {filteredDegustacoes.map((degustacao) => {
          const charuto = charutos.find((c) => c.id === degustacao.charutoid)
          if (!charuto) return null

          return (
            <Card key={degustacao.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{charuto.nome}</CardTitle>
                    <p className="text-gray-600">
                      {charuto.marca} - {charuto.origem}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{new Date(degustacao.data).toLocaleDateString("pt-BR")}</p>
                    <p className="text-sm text-gray-500">{formatTime(degustacao.duracao)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Avaliação:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= degustacao.avaliacao ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({degustacao.avaliacao}/5)</span>
                  </div>

                  {degustacao.observacoes && (
                    <div>
                      <span className="text-sm font-medium">Observações:</span>
                      <p className="text-sm text-gray-700 mt-1">{degustacao.observacoes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredDegustacoes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? "Nenhuma degustação encontrada" : "Nenhuma degustação finalizada ainda"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
