"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Cigarette, Clock, Upload, X, CheckCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

interface Charuto {
  id: number
  nome: string
  bitola?: string
  pais?: string
}

interface Degustacao {
  id: number
  charuto_id: number
  charuto?: Charuto
  data_degustacao: string
  momento?: string
  corte?: string
  fluxo?: string
  folha_anilhada?: string
  status: string
}

export default function DegustacaoPage() {
  const [charutos, setCharutos] = useState<Charuto[]>([])
  const [degustacaoEmAndamento, setDegustacaoEmAndamento] = useState<Degustacao[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"iniciar" | "finalizar">("iniciar")
  const [degustacaoAtiva, setDegustacaoAtiva] = useState<Degustacao | null>(null)
  const [formData, setFormData] = useState({
    charuto_id: "",
    momento: "",
    corte: "",
    fluxo: "",
    folha_anilhada: "",
    duracao_minutos: "",
    nota: "",
    construcao_queima: "",
    compraria_novamente: "",
    sabor_tabaco: false,
    sabor_pimenta: false,
    sabor_terroso: false,
    sabor_flores: false,
    sabor_cafe: false,
    sabor_frutas: false,
    sabor_chocolate: false,
    sabor_castanhas: false,
    sabor_madeira: false,
    observacoes: "",
    observacao_anilha: "",
    foto_anilha: null as File | null,
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    fetchCharutos()
    fetchDegustacaoEmAndamento()
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

  const fetchDegustacaoEmAndamento = async () => {
    try {
      const response = await fetch("/api/degustacoes/em-andamento")
      const data = await response.json()
      setDegustacaoEmAndamento(data)
    } catch (error) {
      console.error("Erro ao buscar degustações em andamento:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        foto_anilha: file,
      }))

      const reader = new FileReader()
      reader.onload = (e) => setPreviewImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const iniciarDegustacao = () => {
    setModalType("iniciar")
    resetForm()
    setShowModal(true)
  }

  const finalizarDegustacao = (degustacao: Degustacao) => {
    setModalType("finalizar")
    setDegustacaoAtiva(degustacao)
    resetForm()
    setShowModal(true)
  }

  const handleSubmitIniciar = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/degustacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          charuto_id: formData.charuto_id,
          momento: formData.momento,
          corte: formData.corte,
          fluxo: formData.fluxo,
          folha_anilhada: formData.folha_anilhada,
        }),
      })

      if (response.ok) {
        fetchDegustacaoEmAndamento()
        setShowModal(false)
      } else {
        console.error("Erro ao iniciar degustação")
      }
    } catch (error) {
      console.error("Erro ao iniciar degustação:", error)
    }
  }

  const handleSubmitFinalizar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!degustacaoAtiva) return

    const formDataToSend = new FormData()

    formDataToSend.append("duracao_minutos", formData.duracao_minutos)
    formDataToSend.append("nota", formData.nota)
    formDataToSend.append("construcao_queima", formData.construcao_queima)
    formDataToSend.append("compraria_novamente", formData.compraria_novamente)
    formDataToSend.append("observacoes", formData.observacoes)
    formDataToSend.append("observacao_anilha", formData.observacao_anilha)

    // Sabores
    Object.keys(formData).forEach((key) => {
      if (key.startsWith("sabor_")) {
        formDataToSend.append(key, formData[key as keyof typeof formData].toString())
      }
    })

    if (formData.foto_anilha) {
      formDataToSend.append("foto_anilha", formData.foto_anilha)
    }

    try {
      const response = await fetch(`/api/degustacoes/${degustacaoAtiva.id}/finalizar`, {
        method: "PUT",
        body: formDataToSend,
      })

      if (response.ok) {
        fetchDegustacaoEmAndamento()
        setShowModal(false)
        setDegustacaoAtiva(null)
      } else {
        console.error("Erro ao finalizar degustação")
      }
    } catch (error) {
      console.error("Erro ao finalizar degustação:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      charuto_id: "",
      momento: "",
      corte: "",
      fluxo: "",
      folha_anilhada: "",
      duracao_minutos: "",
      nota: "",
      construcao_queima: "",
      compraria_novamente: "",
      sabor_tabaco: false,
      sabor_pimenta: false,
      sabor_terroso: false,
      sabor_flores: false,
      sabor_cafe: false,
      sabor_frutas: false,
      sabor_chocolate: false,
      sabor_castanhas: false,
      sabor_madeira: false,
      observacoes: "",
      observacao_anilha: "",
      foto_anilha: null,
    })
    setPreviewImage(null)
    setDegustacaoAtiva(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Degustação de Charutos</h1>
          <p className="text-gray-600">Registre suas experiências com charutos</p>
        </div>
        <Button onClick={iniciarDegustacao} className="bg-amber-600 hover:bg-amber-700 text-white shadow-md">
          <Play size={20} className="mr-2" />
          Iniciar Degustação
        </Button>
      </div>

      {/* Degustações em andamento */}
      {degustacaoEmAndamento.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={24} className="text-amber-600" />
            Degustações em Andamento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {degustacaoEmAndamento.map((degustacao) => (
              <Card key={degustacao.id} className="bg-white shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-lg">{degustacao.charuto?.nome || "Charuto não encontrado"}</CardTitle>
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm">Em andamento</span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <span className="font-medium">Data:</span>{" "}
                      {new Date(degustacao.data_degustacao).toLocaleDateString("pt-BR")}
                    </p>
                    {degustacao.momento && (
                      <p>
                        <span className="font-medium">Momento:</span> {degustacao.momento}
                      </p>
                    )}
                    {degustacao.corte && (
                      <p>
                        <span className="font-medium">Corte:</span> {degustacao.corte}
                      </p>
                    )}
                    {degustacao.fluxo && (
                      <p>
                        <span className="font-medium">Fluxo:</span> {degustacao.fluxo}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => finalizarDegustacao(degustacao)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Finalizar Degustação
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {degustacaoEmAndamento.length === 0 && (
        <div className="text-center py-12">
          <Cigarette size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma degustação em andamento</h3>
          <p className="text-gray-500 mb-6">Inicie uma nova degustação para começar a registrar sua experiência</p>
          <Button onClick={iniciarDegustacao} className="bg-amber-600 hover:bg-amber-700 text-white">
            <Play size={20} className="mr-2" />
            Iniciar Primeira Degustação
          </Button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {modalType === "iniciar" ? "Iniciar Degustação" : "Finalizar Degustação"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                >
                  <X size={24} />
                </Button>
              </div>

              {modalType === "iniciar" ? (
                <form onSubmit={handleSubmitIniciar} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Charuto *</label>
                    <select
                      name="charuto_id"
                      value={formData.charuto_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    >
                      <option value="">Selecione um charuto</option>
                      {charutos.map((charuto) => (
                        <option key={charuto.id} value={charuto.id}>
                          {charuto.nome} - {charuto.bitola} ({charuto.pais})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Momento</label>
                    <select
                      name="momento"
                      value={formData.momento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    >
                      <option value="">Selecione</option>
                      <option value="sozinho">Sozinho</option>
                      <option value="confraternizando">Confraternizando</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Corte</label>
                    <select
                      name="corte"
                      value={formData.corte}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    >
                      <option value="">Selecione</option>
                      <option value="reto">Reto</option>
                      <option value="V">V</option>
                      <option value="furado">Furado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fluxo</label>
                    <select
                      name="fluxo"
                      value={formData.fluxo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    >
                      <option value="">Selecione</option>
                      <option value="solto">Solto</option>
                      <option value="médio">Médio</option>
                      <option value="preso">Preso</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Folha Anilhada (observações)</label>
                    <textarea
                      name="folha_anilhada"
                      value={formData.folha_anilhada}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Descreva as características da folha anilhada..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowModal(false)
                        resetForm()
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                      Iniciar Degustação
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmitFinalizar} className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-gray-800 mb-2">Degustação em andamento:</h3>
                    <p className="text-gray-600">{degustacaoAtiva?.charuto?.nome}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duração (minutos)</label>
                      <Input
                        type="number"
                        name="duracao_minutos"
                        value={formData.duracao_minutos}
                        onChange={handleInputChange}
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nota (1-10)</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        name="nota"
                        value={formData.nota}
                        onChange={handleInputChange}
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Construção e Queima (observações)
                    </label>
                    <textarea
                      name="construcao_queima"
                      value={formData.construcao_queima}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Descreva a construção e queima do charuto..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compraria Novamente?</label>
                    <select
                      name="compraria_novamente"
                      value={formData.compraria_novamente}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    >
                      <option value="">Selecione</option>
                      <option value="sim">Sim</option>
                      <option value="não">Não</option>
                      <option value="depende do preço">Depende do preço</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Roda de Sabores</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { key: "sabor_tabaco", label: "Tabaco" },
                        { key: "sabor_pimenta", label: "Pimenta" },
                        { key: "sabor_terroso", label: "Terroso" },
                        { key: "sabor_flores", label: "Flores" },
                        { key: "sabor_cafe", label: "Café" },
                        { key: "sabor_frutas", label: "Frutas" },
                        { key: "sabor_chocolate", label: "Chocolate" },
                        { key: "sabor_castanhas", label: "Castanhas" },
                        { key: "sabor_madeira", label: "Madeira" },
                      ].map((sabor) => (
                        <label key={sabor.key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name={sabor.key}
                            checked={formData[sabor.key as keyof typeof formData] as boolean}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm text-gray-700">{sabor.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <textarea
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Suas impressões gerais sobre o charuto..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observação ou Colar Anilha</label>
                    <textarea
                      name="observacao_anilha"
                      value={formData.observacao_anilha}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Observações sobre a anilha ou cole aqui..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Foto da Anilha</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                      <div className="space-y-1 text-center">
                        {previewImage ? (
                          <div className="mb-4">
                            <img
                              src={previewImage || "/placeholder.svg"}
                              alt="Preview"
                              className="mx-auto h-32 w-32 object-cover rounded-md"
                            />
                          </div>
                        ) : (
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500">
                            <span>Escolher arquivo</span>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                          </label>
                          <p className="pl-1">ou arraste e solte</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowModal(false)
                        resetForm()
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      Finalizar Degustação
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
