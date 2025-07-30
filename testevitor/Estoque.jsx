import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package, Upload, X } from 'lucide-react';

const Estoque = () => {
  const [charutos, setCharutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCharuto, setEditingCharuto] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    bitola: '',
    pais: '',
    valor_pago: '',
    data_aquisicao: '',
    quantidade_estoque: 1,
    foto_charuto: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchCharutos();
  }, []);

  const fetchCharutos = async () => {
    try {
      const response = await fetch('/api/charutos');
      const data = await response.json();
      setCharutos(data);
    } catch (error) {
      console.error('Erro ao buscar charutos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        foto_charuto: file
      }));
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const url = editingCharuto ? `/api/charutos/${editingCharuto.id}` : '/api/charutos';
      const method = editingCharuto ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        fetchCharutos();
        resetForm();
        setShowModal(false);
      } else {
        console.error('Erro ao salvar charuto');
      }
    } catch (error) {
      console.error('Erro ao salvar charuto:', error);
    }
  };

  const handleEdit = (charuto) => {
    setEditingCharuto(charuto);
    setFormData({
      nome: charuto.nome || '',
      bitola: charuto.bitola || '',
      pais: charuto.pais || '',
      valor_pago: charuto.valor_pago || '',
      data_aquisicao: charuto.data_aquisicao || '',
      quantidade_estoque: charuto.quantidade_estoque || 1,
      foto_charuto: null
    });
    if (charuto.foto_charuto) {
      setPreviewImage(`/uploads/${charuto.foto_charuto}`);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este charuto?')) {
      try {
        const response = await fetch(`/api/charutos/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchCharutos();
        }
      } catch (error) {
        console.error('Erro ao deletar charuto:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      bitola: '',
      pais: '',
      valor_pago: '',
      data_aquisicao: '',
      quantidade_estoque: 1,
      foto_charuto: null
    });
    setEditingCharuto(null);
    setPreviewImage(null);
  };

  const filteredCharutos = charutos.filter(charuto =>
    charuto.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charuto.pais?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charuto.bitola?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Estoque de Charutos</h1>
            <p className="text-gray-600">Gerencie sua coleção de charutos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Adicionar Charuto
          </button>
        </div>

        {/* Barra de busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, país ou bitola..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Grid de charutos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharutos.map((charuto) => (
            <div key={charuto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Foto do charuto */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {charuto.foto_charuto ? (
                  <img
                    src={`/uploads/${charuto.foto_charuto}`}
                    alt={charuto.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={48} className="text-gray-400" />
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{charuto.nome}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  {charuto.bitola && <p><span className="font-medium">Bitola:</span> {charuto.bitola}</p>}
                  {charuto.pais && <p><span className="font-medium">País:</span> {charuto.pais}</p>}
                  {charuto.valor_pago && <p><span className="font-medium">Valor:</span> R$ {charuto.valor_pago}</p>}
                  <p><span className="font-medium">Estoque:</span> {charuto.quantidade_estoque}</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(charuto)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(charuto.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCharutos.length === 0 && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum charuto encontrado</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Tente ajustar sua busca' : 'Adicione seu primeiro charuto ao estoque'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingCharuto ? 'Editar Charuto' : 'Adicionar Charuto'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bitola
                  </label>
                  <input
                    type="text"
                    name="bitola"
                    value={formData.bitola}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    name="pais"
                    value={formData.pais}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Pago (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_pago"
                    value={formData.valor_pago}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Aquisição
                  </label>
                  <input
                    type="date"
                    name="data_aquisicao"
                    value={formData.data_aquisicao}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade em Estoque
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="quantidade_estoque"
                    value={formData.quantidade_estoque}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto do Charuto
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {previewImage ? (
                        <div className="mb-4">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                          <span>Escolher arquivo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    {editingCharuto ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estoque;
