import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ ok: true, skipped: params.id });
}
