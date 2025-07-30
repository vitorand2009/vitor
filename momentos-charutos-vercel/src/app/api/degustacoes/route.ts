import { NextRequest, NextResponse } from 'next/server';
import { getDegustacoes, createDegustacao, getDegustacoesByStatus } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'em_andamento' | 'finalizada' | null;
    
    let degustacoes;
    if (status) {
      degustacoes = getDegustacoesByStatus(status);
    } else {
      degustacoes = getDegustacoes();
    }
    
    return NextResponse.json(degustacoes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar degustações' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      charuto_id,
      data,
      momento,
      corte,
      fluxo,
      folha_anilhada,
      construcao_queima
    } = body;

    if (!charuto_id || !data || !momento || !corte || !fluxo || !folha_anilhada || !construcao_queima) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    const degustacao = createDegustacao({
      charuto_id: parseInt(charuto_id),
      data,
      momento,
      corte,
      fluxo,
      folha_anilhada,
      construcao_queima,
      sabor_tabaco: false,
      sabor_pimenta: false,
      sabor_terroso: false,
      sabor_flores: false,
      sabor_cafe: false,
      sabor_frutas: false,
      sabor_chocolate: false,
      sabor_castanhas: false,
      sabor_madeira: false,
      status: 'em_andamento'
    });

    return NextResponse.json(degustacao, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar degustação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

