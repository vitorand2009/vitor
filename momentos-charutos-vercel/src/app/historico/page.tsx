'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Star, Clock, Calendar, Eye } from 'lucide-react';
import Image from 'next/image';

interface Charuto {
  id: number;
  nome: string;
  bitola: string;
  pais: string;
}

interface Degustacao {
  id: number;
  charuto_id: number;
  data: string;
  momento: string;
  duracao?: number;
  corte: string;
  fluxo: string;
  folha_anilhada: string;
  construcao_queima: string;
  nota?: number;
  sabor_tabaco: boolean;
  sabor_pimenta: boolean;
  sabor_terroso: boolean;
  sabor_flores: boolean;
  sabor_cafe: boolean;
  sabor_frutas: boolean;
  sabor_chocolate: boolean;
  sabor_castanhas: boolean;
  sabor_madeira: boolean;
  compraria_novamente?: string;
  observacao_anilha?: string;
  foto_anilha?: string;
  status: string;
}

export default function Historico() {
  const [degustacoes, setDegustacoes] = useState<Degustacao[]>([]);
  const [charutos, setCharutos] = useState<Charuto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDegustacao, setSelectedDegustacao] = useState<Degustacao | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [degustacaoResponse, charutosResponse] = await Promise.all([
        fetch('/api/degustacoes?status=finalizada'),
        fetch('/api/charutos')
      ]);

      if (degustacaoResponse.ok && charutosResponse.ok) {
        const degustacaoData = await degustacaoResponse.json();
        const charutosData = await charutosResponse.json();
        
        setDegustacoes(degustacaoData);
        setCharutos(charutosData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCharutoNome = (id: number) => {
    const charuto = charutos.find(c => c.id === id);
    return charuto ? `${charuto.nome} (${charuto.bitola})` : 'Charuto não encontrado';
  };

  const getCharutoInfo = (id: number) => {
    return charutos.find(c => c.id === id);
  };

  const getSaboresAtivos = (degustacao: Degustacao) => {
    const sabores = [];
    if (degustacao.sabor_tabaco) sabores.push('Tabaco');
    if (degustacao.sabor_pimenta) sabores.push('Pimenta');
    if (degustacao.sabor_terroso) sabores.push('Terroso');
    if (degustacao.sabor_flores) sabores.push('Flores');
    if (degustacao.sabor_cafe) sabores.push('Café');
    if (degustacao.sabor_frutas) sabores.push('Frutas');
    if (degustacao.sabor_chocolate) sabores.push('Chocolate');
    if (degustacao.sabor_castanhas) sabores.push('Castanhas');
    if (degustacao.sabor_madeira) sabores.push('Madeira');
    return sabores;
  };

  const filteredDegustacoes = degustacoes.filter(degustacao => {
    const charutoNome = getCharutoNome(degustacao.charuto_id).toLowerCase();
    const observacoes = (degustacao.observacao_anilha || '').toLowerCase();
    const termo = searchTerm.toLowerCase();
    
    return charutoNome.includes(termo) || observacoes.includes(termo);
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Histórico de Degustações</h1>

      {/* Barra de pesquisa */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Pesquisar degustações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de degustações */}
      <div className="space-y-4">
        {filteredDegustacoes.map((degustacao) => {
          const charutoInfo = getCharutoInfo(degustacao.charuto_id);
          const saboresAtivos = getSaboresAtivos(degustacao);
          
          return (
            <Card key={degustacao.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {getCharutoNome(degustacao.charuto_id)}
                    </h3>
                    {charutoInfo && (
                      <p className="text-sm text-gray-600">{charutoInfo.pais}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {new Date(degustacao.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {degustacao.nota && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{degustacao.nota}/10</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Momento:</span>
                    <p className="text-sm">{degustacao.momento}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Corte:</span>
                    <p className="text-sm">{degustacao.corte}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Fluxo:</span>
                    <p className="text-sm">{degustacao.fluxo}</p>
                  </div>
                  {degustacao.duracao && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Duração:</span>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-sm">{degustacao.duracao} min</span>
                      </div>
                    </div>
                  )}
                </div>

                {saboresAtivos.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500 block mb-2">Sabores identificados:</span>
                    <div className="flex flex-wrap gap-2">
                      {saboresAtivos.map((sabor) => (
                        <span
                          key={sabor}
                          className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                        >
                          {sabor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {degustacao.observacao_anilha && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500 block mb-1">Observações:</span>
                    <p className="text-sm text-gray-700">{degustacao.observacao_anilha}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {degustacao.compraria_novamente && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Compraria novamente:</span>
                        <span className={`ml-2 text-sm font-medium ${
                          degustacao.compraria_novamente === 'sim' ? 'text-green-600' :
                          degustacao.compraria_novamente === 'nao' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {degustacao.compraria_novamente === 'sim' ? 'Sim' :
                           degustacao.compraria_novamente === 'nao' ? 'Não' :
                           'Depende do preço'}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedDegustacao(degustacao)}
                    className="flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver detalhes
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDegustacoes.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'Nenhuma degustação encontrada' : 'Nenhuma degustação finalizada'}
          </p>
        </div>
      )}

      {/* Modal de detalhes */}
      {selectedDegustacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">
                  {getCharutoNome(selectedDegustacao.charuto_id)}
                </h2>
                <button
                  onClick={() => setSelectedDegustacao(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Data:</span>
                    <p>{new Date(selectedDegustacao.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="font-medium">Momento:</span>
                    <p>{selectedDegustacao.momento}</p>
                  </div>
                  <div>
                    <span className="font-medium">Corte:</span>
                    <p>{selectedDegustacao.corte}</p>
                  </div>
                  <div>
                    <span className="font-medium">Fluxo:</span>
                    <p>{selectedDegustacao.fluxo}</p>
                  </div>
                </div>

                <div>
                  <span className="font-medium">Folha Anilhada:</span>
                  <p>{selectedDegustacao.folha_anilhada}</p>
                </div>

                <div>
                  <span className="font-medium">Construção e Queima:</span>
                  <p>{selectedDegustacao.construcao_queima}</p>
                </div>

                {selectedDegustacao.foto_anilha && (
                  <div>
                    <span className="font-medium block mb-2">Foto da Anilha:</span>
                    <div className="relative w-full h-64">
                      <Image
                        src={selectedDegustacao.foto_anilha}
                        alt="Foto da anilha"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {selectedDegustacao.observacao_anilha && (
                  <div>
                    <span className="font-medium">Observações:</span>
                    <p>{selectedDegustacao.observacao_anilha}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

