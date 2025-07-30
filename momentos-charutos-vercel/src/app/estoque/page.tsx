'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import Image from 'next/image';

interface Charuto {
  id: number;
  nome: string;
  bitola: string;
  pais: string;
  valor: number;
  data_aquisicao: string;
  quantidade_estoque: number;
  foto?: string;
}

export default function Estoque() {
  const [charutos, setCharutos] = useState<Charuto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCharuto, setEditingCharuto] = useState<Charuto | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    bitola: '',
    pais: '',
    valor: '',
    data_aquisicao: '',
    quantidade_estoque: '',
    foto: null as File | null
  });

  useEffect(() => {
    fetchCharutos();
  }, []);

  const fetchCharutos = async () => {
    try {
      const response = await fetch('/api/charutos');
      if (response.ok) {
        const data = await response.json();
        setCharutos(data);
      }
    } catch (error) {
      console.error('Erro ao buscar charutos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('nome', formData.nome);
    formDataToSend.append('bitola', formData.bitola);
    formDataToSend.append('pais', formData.pais);
    formDataToSend.append('valor', formData.valor);
    formDataToSend.append('data_aquisicao', formData.data_aquisicao);
    formDataToSend.append('quantidade_estoque', formData.quantidade_estoque);
    
    if (formData.foto) {
      formDataToSend.append('foto', formData.foto);
    }

    try {
      const url = editingCharuto ? `/api/charutos/${editingCharuto.id}` : '/api/charutos';
      const method = editingCharuto ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        fetchCharutos();
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao salvar charuto:', error);
    }
  };

  const handleEdit = (charuto: Charuto) => {
    setEditingCharuto(charuto);
    setFormData({
      nome: charuto.nome,
      bitola: charuto.bitola,
      pais: charuto.pais,
      valor: charuto.valor.toString(),
      data_aquisicao: charuto.data_aquisicao,
      quantidade_estoque: charuto.quantidade_estoque.toString(),
      foto: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este charuto?')) {
      try {
        const response = await fetch(`/api/charutos/${id}`, {
          method: 'DELETE',
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
      valor: '',
      data_aquisicao: '',
      quantidade_estoque: '',
      foto: null
    });
    setEditingCharuto(null);
    setShowForm(false);
  };

  const filteredCharutos = charutos.filter(charuto =>
    charuto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charuto.pais.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charuto.bitola.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Estoque de Charutos</h1>
        <Button onClick={() => setShowForm(true)} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Charuto
        </Button>
      </div>

      {/* Barra de pesquisa */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Pesquisar charutos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Formulário */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingCharuto ? 'Editar Charuto' : 'Adicionar Novo Charuto'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <Input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bitola</label>
                  <Input
                    type="text"
                    value={formData.bitola}
                    onChange={(e) => setFormData({...formData, bitola: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">País</label>
                  <Input
                    type="text"
                    value={formData.pais}
                    onChange={(e) => setFormData({...formData, pais: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Aquisição</label>
                  <Input
                    type="date"
                    value={formData.data_aquisicao}
                    onChange={(e) => setFormData({...formData, data_aquisicao: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantidade em Estoque</label>
                  <Input
                    type="number"
                    value={formData.quantidade_estoque}
                    onChange={(e) => setFormData({...formData, quantidade_estoque: e.target.value})}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Foto</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, foto: e.target.files?.[0] || null})}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  {editingCharuto ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de charutos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharutos.map((charuto) => (
          <Card key={charuto.id} className="overflow-hidden">
            <div className="aspect-video relative bg-gray-100">
              {charuto.foto ? (
                <Image
                  src={charuto.foto}
                  alt={charuto.nome}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{charuto.nome}</h3>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p><span className="font-medium">Bitola:</span> {charuto.bitola}</p>
                <p><span className="font-medium">País:</span> {charuto.pais}</p>
                <p><span className="font-medium">Valor:</span> R$ {charuto.valor.toFixed(2)}</p>
                <p><span className="font-medium">Estoque:</span> {charuto.quantidade_estoque} unidades</p>
                <p><span className="font-medium">Adquirido em:</span> {new Date(charuto.data_aquisicao).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(charuto)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(charuto.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCharutos.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'Nenhum charuto encontrado' : 'Nenhum charuto cadastrado'}
          </p>
        </div>
      )}
    </div>
  );
}

