import { NextRequest, NextResponse } from 'next/server';
import { getCharutos, createCharuto } from '@/lib/db';
import { saveImage, generateUniqueFilename } from '@/lib/storage';

export async function GET() {
  try {
    const charutos = getCharutos();
    return NextResponse.json(charutos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar charutos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const nome = formData.get('nome') as string;
    const bitola = formData.get('bitola') as string;
    const pais = formData.get('pais') as string;
    const valor = parseFloat(formData.get('valor') as string);
    const data_aquisicao = formData.get('data_aquisicao') as string;
    const quantidade_estoque = parseInt(formData.get('quantidade_estoque') as string);
    const foto = formData.get('foto') as File | null;

    if (!nome || !bitola || !pais || isNaN(valor) || !data_aquisicao || isNaN(quantidade_estoque)) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    let fotoPath: string | undefined;
    if (foto && foto.size > 0) {
      const filename = generateUniqueFilename(foto.name);
      fotoPath = await saveImage(foto, filename);
    }

    const charuto = createCharuto({
      nome,
      bitola,
      pais,
      valor,
      data_aquisicao,
      quantidade_estoque,
      foto: fotoPath
    });

    return NextResponse.json(charuto, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar charuto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

