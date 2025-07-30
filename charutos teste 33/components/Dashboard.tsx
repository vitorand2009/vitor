"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Package, Coffee, TrendingUp } from "lucide-react"

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

export function Dashboard() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [degustacoes, setDegustacoes] = useState<Degustacao[]>([])

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

  const totalCharutos = charutos.reduce((acc, charuto) => acc + charuto.quantidade, 0)
  const valorTotal = charutos.reduce((acc, charuto) => acc + charuto.preco * charuto.quantidade, 0)
  const degustacoesFinalizadas = degustacoes.filter((d) => d.finalizada).length
  const avaliacaoMedia =
    degustacoes.length > 0 ? degustacoes.reduce((acc, d) => acc + d.avaliacao, 0) / degustacoes.length : 0

  const stats = [
    {
      title: "Total de Charutos",
      value: totalCharutos.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Valor do Estoque",
      value: `R$ ${valorTotal.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Degustações",
      value: degustacoesFinalizadas.toString(),
      icon: Coffee,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Avaliação Média",
      value: avaliacaoMedia.toFixed(1),
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Visão geral do seu acervo de charutos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
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
                    <p className="text-sm text-gray-600">{charuto.marca}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{charuto.quantidade} unidades</p>
                    <p className="text-sm text-gray-600">R$ {charuto.preco.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              {charutos.length === 0 && <p className="text-gray-500 text-center py-4">Nenhum charuto cadastrado</p>}
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
                .filter((d) => d.finalizada)
                .slice(0, 5)
                .map((degustacao) => {
                  const charuto = charutos.find((c) => c.id === degustacao.charutoid)
                  return (
                    <div key={degustacao.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{charuto?.nome || "Charuto não encontrado"}</p>
                        <p className="text-sm text-gray-600">{new Date(degustacao.data).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < degustacao.avaliacao ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{degustacao.duracao} min</p>
                      </div>
                    </div>
                  )
                })}
              {degustacoes.filter((d) => d.finalizada).length === 0 && (
                <p className="text-gray-500 text-center py-4">Nenhuma degustação finalizada</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
