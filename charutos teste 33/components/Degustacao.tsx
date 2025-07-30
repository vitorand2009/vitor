"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, Square, Star } from "lucide-react"

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

export function Degustacao() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [degustacaoAtual, setDegustacaoAtual] = useState<Degustacao | null>(null)
  const [tempo, setTempo] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [charutoselecionado, setCharutoSelecionado] = useState("")
  const [avaliacao, setAvaliacao] = useState(0)
  const [observacoes, setObservacoes] = useState("")

  useEffect(() => {
    const data = localStorage.getItem("charutos")
    if (data) {
      setCharutos(JSON.parse(data))
    }

    const degustacaoData = localStorage.getItem("degustacao-atual")
    if (degustacaoData) {
      const degustacao = JSON.parse(degustacaoData)
      setDegustacaoAtual(degustacao)
      setCharutoSelecionado(degustacao.charutoid)
      setTempo(degustacao.duracao)
      setAvaliacao(degustacao.avaliacao)
      setObservacoes(degustacao.observacoes)
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTempo((tempo) => tempo + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (degustacaoAtual) {
      const updatedDegustacao = {
        ...degustacaoAtual,
        duracao: tempo,
        avaliacao,
        observacoes,
      }
      localStorage.setItem("degustacao-atual", JSON.stringify(updatedDegustacao))
    }
  }, [tempo, avaliacao, observacoes, degustacaoAtual])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const iniciarDegustacao = () => {
    if (!charutoselecionado) return

    const novaDegustacao: Degustacao = {
      id: Date.now().toString(),
      charutoid: charutoselecionado,
      data: new Date().toISOString(),
      duracao: 0,
      avaliacao: 0,
      observacoes: "",
      finalizada: false,
    }

    setDegustacaoAtual(novaDegustacao)
    setTempo(0)
    setAvaliacao(0)
    setObservacoes("")
    setIsRunning(true)
    localStorage.setItem("degustacao-atual", JSON.stringify(novaDegustacao))
  }

  const pausarDegustacao = () => {
    setIsRunning(false)
  }

  const continuarDegustacao = () => {
    setIsRunning(true)
  }

  const finalizarDegustacao = () => {
    if (!degustacaoAtual) return

    const degustacaoFinalizada = {
      ...degustacaoAtual,
      duracao: tempo,
      avaliacao,
      observacoes,
      finalizada: true,
    }

    const degustacoesData = localStorage.getItem("degustacoes")
    const degustacoes = degustacoesData ? JSON.parse(degustacoesData) : []
    degustacoes.push(degustacaoFinalizada)
    localStorage.setItem("degustacoes", JSON.stringify(degustacoes))

    localStorage.removeItem("degustacao-atual")
    setDegustacaoAtual(null)
    setTempo(0)
    setIsRunning(false)
    setCharutoSelecionado("")
    setAvaliacao(0)
    setObservacoes("")
  }

  const charutoselecionadoObj = charutos.find((c) => c.id === charutoselecionado)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Degustação</h2>
        <p className="text-gray-600 mt-2">Acompanhe e avalie suas degustações</p>
      </div>

      {!degustacaoAtual ? (
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Nova Degustação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selecione um Charuto</label>
                <select
                  value={charutoselecionado}
                  onChange={(e) => setCharutoSelecionado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Selecione um charuto...</option>
                  {charutos.map((charuto) => (
                    <option key={charuto.id} value={charuto.id}>
                      {charuto.nome} - {charuto.marca}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={iniciarDegustacao}
                disabled={!charutoselecionado}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Degustação
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Degustação em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{charutoselecionadoObj?.nome}</h3>
                  <p className="text-gray-600">
                    {charutoselecionadoObj?.marca} - {charutoselecionadoObj?.origem}
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-mono font-bold text-amber-600 mb-4">{formatTime(tempo)}</div>
                  <div className="flex justify-center space-x-2">
                    {!isRunning ? (
                      <Button onClick={continuarDegustacao} className="bg-green-600 hover:bg-green-700">
                        <Play className="h-4 w-4 mr-2" />
                        Continuar
                      </Button>
                    ) : (
                      <Button onClick={pausarDegustacao} variant="outline">
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </Button>
                    )}
                    <Button onClick={finalizarDegustacao} className="bg-red-600 hover:bg-red-700">
                      <Square className="h-4 w-4 mr-2" />
                      Finalizar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avaliação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação (1-5 estrelas)</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setAvaliacao(star)}
                        className={`p-1 ${star <= avaliacao ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Descreva sua experiência com este charuto..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
