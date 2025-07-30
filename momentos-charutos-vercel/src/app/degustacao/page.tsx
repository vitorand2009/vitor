'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coffee, Clock, CheckCircle, Play } from 'lucide-react';

interface Charuto {
  id: number;
  nome: string;
  bitola: string;
  pais: string;
  quantidade_estoque: number;
}

interface Degustacao {
  id: number;
  charuto_id: number;
  data: string;
  momento: string;
  corte: string;
  fluxo: string;
  folha_anilhada: string;
  construcao_queima: string;
  status: 'em_andamento' | 'finalizada';
}

export default function Degustacao() {
  const [charutos, setCharutos] = useState<Charuto[]>([]);
  const [degustacaoAtual, setDegustacaoAtual] = useState<Degustacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'selecionar' | 'iniciar' | 'finalizar'>('selecionar');
  
  // Dados do formulário de início
  const [formInicio, setFormInicio] = useState({
    charuto_id: '',
    data: new Date().toISOString().split('T')[0],
    momento: '',
    corte: '',
    fluxo: '',
    folha_anilhada: '',
    construcao_queima: ''
  });

  // Dados do formulário de finalização
  const [formFinal, setFormFinal] = useState({
    duracao: '',
    nota: '',
    sabor_tabaco: false,
    sabor_pimenta: false,
    sabor_terroso: false,
    sabor_flores: false,
    sabor_cafe: false,
    sabor_frutas: false,
    sabor_chocolate: false,
    sabor_castanhas: false,
    sabor_madeira: false,
    compraria_novamente: '',
    observacao_anilha: '',
    foto_anilha: null as File | null
  });

  useEffect(() => {
    fetchCharutos();
    checkDegustacaoEmAndamento();
  }, []);

  const fetchCharutos = async () => {
    try {
      const response = await fetch('/api/charutos');
      if (response.ok) {
        const data = await response.json();
        setCharutos(data.filter((c: Charuto) => c.quantidade_estoque > 0));
      }
    } catch (error) {
      console.error('Erro ao buscar charutos:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkDegustacaoEmAndamento = async () => {
    try {
      const response = await fetch('/api/degustacoes?status=em_andamento');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setDegustacaoAtual(data[0]);
          setStep('finalizar');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar degustação em andamento:', error);
    }
  };

  const handleIniciarDegustacao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/degustacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formInicio),
      });

      if (response.ok) {
        const degustacao = await response.json();
        setDegustacaoAtual(degustacao);
        setStep('finalizar');
      }
    } catch (error) {
      console.error('Erro ao iniciar degustação:', error);
    }
  };

  const handleFinalizarDegustacao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!degustacaoAtual) return;

    const formData = new FormData();
    Object.entries(formFinal).forEach(([key, value]) => {
      if (key === 'foto_anilha' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== null) {
        formData.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`/api/degustacoes/${degustacaoAtual.id}/finalizar`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setDegustacaoAtual(null);
        setStep('selecionar');
        setFormInicio({
          charuto_id: '',
          data: new Date().toISOString().split('T')[0],
          momento: '',
          corte: '',
          fluxo: '',
          folha_anilhada: '',
          construcao_queima: ''
        });
        setFormFinal({
          duracao: '',
          nota: '',
          sabor_tabaco: false,
          sabor_pimenta: false,
          sabor_terroso: false,
          sabor_flores: false,
          sabor_cafe: false,
          sabor_frutas: false,
          sabor_chocolate: false,
          sabor_castanhas: false,
          sabor_madeira: false,
          compraria_novamente: '',
          observacao_anilha: '',
          foto_anilha: null
        });
        fetchCharutos(); // Atualizar estoque
      }
    } catch (error) {
      console.error('Erro ao finalizar degustação:', error);
    }
  };

  const getCharutoNome = (id: number) => {
    const charuto = charutos.find(c => c.id === id);
    return charuto ? charuto.nome : 'Charuto não encontrado';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Degustação de Charutos</h1>

      {/* Seleção de charuto */}
      {step === 'selecionar' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Iniciar Nova Degustação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIniciarDegustacao} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Charuto</label>
                <select
                  value={formInicio.charuto_id}
                  onChange={(e) => setFormInicio({...formInicio, charuto_id: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecione um charuto</option>
                  {charutos.map((charuto) => (
                    <option key={charuto.id} value={charuto.id}>
                      {charuto.nome} ({charuto.bitola}) - {charuto.quantidade_estoque} em estoque
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data</label>
                  <Input
                    type="date"
                    value={formInicio.data}
                    onChange={(e) => setFormInicio({...formInicio, data: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Momento</label>
                  <Input
                    type="text"
                    value={formInicio.momento}
                    onChange={(e) => setFormInicio({...formInicio, momento: e.target.value})}
                    placeholder="Ex: Após o almoço, fim de tarde..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Corte</label>
                  <Input
                    type="text"
                    value={formInicio.corte}
                    onChange={(e) => setFormInicio({...formInicio, corte: e.target.value})}
                    placeholder="Ex: Guilhotina, V-cut..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fluxo</label>
                  <Input
                    type="text"
                    value={formInicio.fluxo}
                    onChange={(e) => setFormInicio({...formInicio, fluxo: e.target.value})}
                    placeholder="Ex: Bom, apertado, solto..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Folha Anilhada</label>
                  <Input
                    type="text"
                    value={formInicio.folha_anilhada}
                    onChange={(e) => setFormInicio({...formInicio, folha_anilhada: e.target.value})}
                    placeholder="Descreva a aparência da folha..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Construção e Queima</label>
                  <Input
                    type="text"
                    value={formInicio.construcao_queima}
                    onChange={(e) => setFormInicio({...formInicio, construcao_queima: e.target.value})}
                    placeholder="Avalie a construção e queima..."
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                <Play className="h-4 w-4 mr-2" />
                Iniciar Degustação
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Finalização da degustação */}
      {step === 'finalizar' && degustacaoAtual && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Degustação em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="font-medium">Charuto: {getCharutoNome(degustacaoAtual.charuto_id)}</p>
                <p className="text-sm text-gray-600">Iniciado em: {new Date(degustacaoAtual.data).toLocaleDateString('pt-BR')}</p>
                <p className="text-sm text-gray-600">Momento: {degustacaoAtual.momento}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Finalizar Degustação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFinalizarDegustacao} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Duração (minutos)</label>
                    <Input
                      type="number"
                      value={formFinal.duracao}
                      onChange={(e) => setFormFinal({...formFinal, duracao: e.target.value})}
                      placeholder="Ex: 45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nota (0-10)</label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formFinal.nota}
                      onChange={(e) => setFormFinal({...formFinal, nota: e.target.value})}
                      placeholder="Ex: 8.5"
                    />
                  </div>
                </div>

                {/* Roda de sabores */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Roda de Sabores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'sabor_tabaco', label: 'Tabaco' },
                      { key: 'sabor_pimenta', label: 'Pimenta' },
                      { key: 'sabor_terroso', label: 'Terroso' },
                      { key: 'sabor_flores', label: 'Flores' },
                      { key: 'sabor_cafe', label: 'Café' },
                      { key: 'sabor_frutas', label: 'Frutas' },
                      { key: 'sabor_chocolate', label: 'Chocolate' },
                      { key: 'sabor_castanhas', label: 'Castanhas' },
                      { key: 'sabor_madeira', label: 'Madeira' },
                    ].map((sabor) => (
                      <label key={sabor.key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formFinal[sabor.key as keyof typeof formFinal] as boolean}
                          onChange={(e) => setFormFinal({
                            ...formFinal,
                            [sabor.key]: e.target.checked
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">{sabor.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Compraria Novamente?</label>
                  <select
                    value={formFinal.compraria_novamente}
                    onChange={(e) => setFormFinal({...formFinal, compraria_novamente: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                    <option value="depende_preco">Depende do preço</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Observação ou Colar Anilha</label>
                  <textarea
                    value={formFinal.observacao_anilha}
                    onChange={(e) => setFormFinal({...formFinal, observacao_anilha: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Observações sobre a degustação ou informações da anilha..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Foto da Anilha</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormFinal({...formFinal, foto_anilha: e.target.files?.[0] || null})}
                  />
                </div>

                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar Degustação
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {charutos.length === 0 && step === 'selecionar' && (
        <div className="text-center py-12">
          <Coffee className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum charuto disponível no estoque</p>
          <p className="text-gray-400">Adicione charutos no estoque para iniciar uma degustação</p>
        </div>
      )}
    </div>
  );
}

