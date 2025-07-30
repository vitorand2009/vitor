import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Coffee, Star, TrendingUp, History } from 'lucide-react'

export function Dashboard() {
  const [stats, setStats] = useState({
    totalCharutos: 0,
    totalDegustacoes: 0,
    mediaNotas: 0,
    charutoPreferifo: null
  })

  useEffect(() => {
    // Buscar estatísticas da API
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Buscar total de charutos
      const charutosResponse = await fetch('/api/charutos')
      const charutos = await charutosResponse.json()
      
      // Buscar estatísticas de degustações
      const statsResponse = await fetch('/api/degustacoes/estatisticas')
      const degustacaoStats = await statsResponse.json()
      
      setStats({
        totalCharutos: charutos.length,
        totalDegustacoes: degustacaoStats.total_degustacoes || 0,
        mediaNotas: degustacaoStats.media_notas || 0,
        charutoPreferifo: degustacaoStats.charuto_mais_degustado
      })
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Visão geral das suas degustações</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Charutos
            </CardTitle>
            <Package className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.totalCharutos}</div>
            <p className="text-xs text-gray-500">
              Charutos no estoque
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Degustações
            </CardTitle>
            <Coffee className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.totalDegustacoes}</div>
            <p className="text-xs text-gray-500">
              Total realizadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Média de Notas
            </CardTitle>
            <Star className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.mediaNotas}</div>
            <p className="text-xs text-gray-500">
              Avaliação média
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Charuto Favorito
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-gray-800">
              {stats.charutoPreferifo?.charuto?.nome || 'Nenhum'}
            </div>
            <p className="text-xs text-gray-500">
              {stats.charutoPreferifo?.total_degustacoes || 0} degustações
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Bem-vindo ao Momentos Charutos
            </CardTitle>
            <CardDescription>
              Seu aplicativo para gerenciar e avaliar degustações de charutos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-gray-800">Gerencie seu Estoque</p>
                <p className="text-sm text-gray-600">Adicione e organize seus charutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Coffee className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-gray-800">Avalie Degustações</p>
                <p className="text-sm text-gray-600">Registre suas experiências detalhadamente</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <History className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-gray-800">Acompanhe o Histórico</p>
                <p className="text-sm text-gray-600">Revise suas avaliações anteriores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Roda de Sabores
            </CardTitle>
            <CardDescription>
              Principais sabores encontrados em charutos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                'Tabaco', 'Pimenta', 'Terroso',
                'Flores', 'Café', 'Frutas',
                'Chocolate', 'Castanhas', 'Madeira'
              ].map((sabor) => (
                <div
                  key={sabor}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center text-sm font-medium text-amber-800"
                >
                  {sabor}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
