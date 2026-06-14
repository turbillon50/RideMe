import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
// Mercado Pago webhook — activar cuando lleguen las credenciales
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  console.log('[MP Webhook]', JSON.stringify(body).slice(0, 200));
  return NextResponse.json({ ok: true });
}
