import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ error: 'Modo demo desactivado' }, { status: 410 });
}
