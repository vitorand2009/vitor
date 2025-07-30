import { NextRequest, NextResponse } from 'next/server';
import { updateDegustacao, reduzirEstoque } from '@/lib/db';
import { saveImage, generateUniqueFilename } from '@/lib/storage';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    const duracao = formData.get('duracao') as string;
    const nota = formData.get('nota') as string;
    const sabor_tabaco = formData.get('sabor_tabaco') === 'true';
    const sabor_pimenta = formData.get('sabor_pimenta') === 'true';
    const sabor_terroso = formData.get('sabor_terroso') === 'true';
    const sabor_flores = formData.get('sabor_flores') === 'true';
    const sabor_cafe = formData.get('sabor_cafe') === 'true';
    const sabor_frutas = formData.get('sabor_frutas') === 'true';
    const sabor_chocolate = formData.get('sabor_chocolate') === 'true';
    const sabor_castanhas = formData.get('sabor_castanhas') === 'true';
    const sabor_madeira = formData.get('sabor_madeira') === 'true';
    const compraria_novamente = formData.get('compraria_novamente') as string;
    const observacao_anilha = formData.get('observacao_anilha') as string;
    const foto_anilha = formData.get('foto_anilha') as File | null;

    const updates: any = {
      status: 'finalizada',
      sabor_tabaco,
      sabor_pimenta,
      sabor_terroso,
      sabor_flores,
      sabor_cafe,
      sabor_frutas,
      sabor_chocolate,
      sabor_castanhas,
      sabor_madeira
    };

    if (duracao) updates.duracao = parseInt(duracao);
    if (nota) updates.nota = parseFloat(nota);
    if (compraria_novamente) updates.compraria_novamente = compraria_novamente;
    if (observacao_anilha) updates.observacao_anilha = observacao_anilha;

    if (foto_anilha && foto_anilha.size > 0) {
      const filename = generateUniqueFilename(foto_anilha.name);
      updates.foto_anilha = await saveImage(foto_anilha, filename);
    }

    const degustacao = updateDegustacao(parseInt(id), updates);
    
    if (!degustacao) {
      return NextResponse.json(
        { error: 'Degustação não encontrada' },
        { status: 404 }
      );
    }

    // Reduzir estoque do charuto
    reduzirEstoque(degustacao.charuto_id);
    
    return NextResponse.json(degustacao);
  } catch (error) {
    console.error('Erro ao finalizar degustação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

