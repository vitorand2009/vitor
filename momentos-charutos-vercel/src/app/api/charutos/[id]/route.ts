import { NextRequest, NextResponse } from 'next/server';
import { getCharutoById, updateCharuto, deleteCharuto } from '@/lib/db';
import { saveImage, generateUniqueFilename } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const charuto = getCharutoById(parseInt(id));
    
    if (!charuto) {
      return NextResponse.json(
        { error: 'Charuto não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(charuto);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar charuto' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    const updates: any = {};
    
    const nome = formData.get('nome') as string;
    const bitola = formData.get('bitola') as string;
    const pais = formData.get('pais') as string;
    const valor = formData.get('valor') as string;
    const data_aquisicao = formData.get('data_aquisicao') as string;
    const quantidade_estoque = formData.get('quantidade_estoque') as string;
    const foto = formData.get('foto') as File | null;

    if (nome) updates.nome = nome;
    if (bitola) updates.bitola = bitola;
    if (pais) updates.pais = pais;
    if (valor) updates.valor = parseFloat(valor);
    if (data_aquisicao) updates.data_aquisicao = data_aquisicao;
    if (quantidade_estoque) updates.quantidade_estoque = parseInt(quantidade_estoque);

    if (foto && foto.size > 0) {
      const filename = generateUniqueFilename(foto.name);
      updates.foto = await saveImage(foto, filename);
    }

    const charuto = updateCharuto(parseInt(id), updates);
    
    if (!charuto) {
      return NextResponse.json(
        { error: 'Charuto não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(charuto);
  } catch (error) {
    console.error('Erro ao atualizar charuto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteCharuto(parseInt(id));
    
    if (!success) {
      return NextResponse.json(
        { error: 'Charuto não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Charuto deletado com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar charuto' },
      { status: 500 }
    );
  }
}

