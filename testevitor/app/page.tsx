"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Coffee, Star, TrendingUp } from "lucide-react"

interface DashboardStats {
  total_charutos: number
  total_degustacoes: number
  media_notas: string
  charuto_favorito: {
    nome: string
    count: number
  }
  sabores: Record<string, number>
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  const topSabores = stats?.sabores
    ? Object.entries(stats.sabores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([sabor, count]) => ({ sabor: sabor.charAt(0).toUpperCase() + sabor.slice(1), count }))
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Visão geral das suas degustações</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Charutos</CardTitle>
            <Package className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_charutos || 0}</div>
            <p className="text-xs text-gray-500">em estoque</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Degustações</CardTitle>
            <Coffee className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_degustacoes || 0}</div>
            <p className="text-xs text-gray-500">finalizadas</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Média de Notas</CardTitle>
            <Star className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.media_notas || "0.0"}</div>
            <p className="text-xs text-gray-500">de 10</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Charuto Favorito</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-900 truncate">{stats?.charuto_favorito?.nome || "Nenhum"}</div>
            <p className="text-xs text-gray-500">{stats?.charuto_favorito?.count || 0} degustações</p>
          </CardContent>
        </Card>
      </div>

      {topSabores.length > 0 && (
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Principais Sabores Identificados</CardTitle>
            <CardDescription>Os sabores mais comuns nas suas degustações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSabores.map(({ sabor, count }, index) => (
                <div key={sabor} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0 ? "bg-amber-500" : index === 1 ? "bg-amber-400" : "bg-amber-300"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-700">{sabor}</span>
                  </div>
                  <span className="text-sm text-gray-500">{count} vezes</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!stats || stats.total_degustacoes === 0) && (
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Bem-vindo ao Momentos Charutos!</CardTitle>
            <CardDescription>Comece adicionando charutos ao seu estoque e registrando suas degustações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Coffee className="h-16 w-16 text-amber-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Ainda não há dados para exibir. Que tal começar adicionando alguns charutos ao seu estoque?
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
