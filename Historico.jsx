import React, { useState, useEffect } from 'react';
import { History, Star, Clock, User, Users, Search, Trash2, Image, FileText } from 'lucide-react';

const Historico = () => {
  const [degustacoes, setDegustacoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDegustacoes();
  }, []);

  const fetchDegustacoes = async () => {
    try {
      const response = await fetch('/api/degustacoes');
      const data = await response.json();
      // Filtrar apenas degustações finalizadas
      const finalizadas = data.filter(deg => deg.status === 'finalizada');
      setDegustacoes(finalizadas);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar degustações:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta degustação?')) {
      try {
        const response = await fetch(`/api/degustacoes/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchDegustacoes();
        }
      } catch (error) {
        console.error('Erro ao excluir degustação:', error);
      }
    }
  };

  const getSaboresAtivos = (degustacao) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredDegustacoes = degustacoes.filter(degustacao =>
    degustacao.charuto?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    degustacao.observacoes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    degustacao.observacao_anilha?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando histórico...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <History size={32} className="text-orange-600" />
              Histórico de Degustações
            </h1>
            <p className="text-gray-600">Revise suas avaliações anteriores</p>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por charuto ou observações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de degustações */}
        <div className="space-y-6">
          {filteredDegustacoes.map((degustacao) => (
            <div key={degustacao.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {degustacao.charuto?.nome || 'Charuto não encontrado'}
                    </h3>
                    <p className="text-gray-600">
                      {degustacao.charuto?.bitola} • {degustacao.charuto?.pais}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{formatDate(degustacao.data_degustacao)}</span>
                    {degustacao.nota && (
                      <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
                        <Star size={16} className="text-orange-600" />
                        <span className="font-medium text-orange-800">{degustacao.nota}/10</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(degustacao.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Excluir degustação"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {/* Informações básicas */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Informações Básicas</h4>
                    {degustacao.duracao_minutos && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{degustacao.duracao_minutos} min</span>
                      </div>
                    )}
                    {degustacao.momento && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {degustacao.momento === 'sozinho' ? <User size={16} /> : <Users size={16} />}
                        <span>{degustacao.momento}</span>
                      </div>
                    )}
                    {degustacao.compraria_novamente && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Compraria novamente:</span> {degustacao.compraria_novamente}
                      </p>
                    )}
                  </div>

                  {/* Características físicas */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Características</h4>
                    {degustacao.corte && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Corte:</span> {degustacao.corte}
                      </p>
                    )}
                    {degustacao.fluxo && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Fluxo:</span> {degustacao.fluxo}
                      </p>
                    )}
                    {degustacao.construcao_queima && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Construção e Queima:</span> {degustacao.construcao_queima}
                      </p>
                    )}
                  </div>

                  {/* Foto da anilha */}
                  {degustacao.foto_anilha && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Foto da Anilha</h4>
                      <img
                        src={`/uploads/${degustacao.foto_anilha}`}
                        alt="Anilha"
                        className="w-full h-24 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                {/* Folha anilhada */}
                {degustacao.folha_anilhada && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Folha Anilhada</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {degustacao.folha_anilhada}
                    </p>
                  </div>
                )}

                {/* Sabores identificados */}
                {getSaboresAtivos(degustacao).length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Sabores Identificados</h4>
                    <div className="flex flex-wrap gap-2">
                      {getSaboresAtivos(degustacao).map((sabor) => (
                        <span
                          key={sabor}
                          className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm"
                        >
                          {sabor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observações */}
                {(degustacao.observacoes || degustacao.observacao_anilha) && (
                  <div className="space-y-3">
                    {degustacao.observacoes && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FileText size={16} />
                          Observações Gerais
                        </h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {degustacao.observacoes}
                        </p>
                      </div>
                    )}
                    {degustacao.observacao_anilha && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Image size={16} />
                          Observação da Anilha
                        </h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {degustacao.observacao_anilha}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredDegustacoes.length === 0 && (
          <div className="text-center py-12">
            <History size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'Nenhuma degustação encontrada' : 'Nenhuma degustação finalizada'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Tente ajustar sua busca' 
                : 'Complete algumas degustações para ver o histórico aqui'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historico;
