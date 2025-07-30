import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'API Momentos Charutos inicializada com sucesso!',
    timestamp: new Date().toISOString()
  });
}

