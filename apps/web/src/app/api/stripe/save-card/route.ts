import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/db-user';

export const dynamic = 'force-dynamic';

// POST /api/stripe/save-card
// Body: { paymentMethodId: string }  (from Stripe.js)
export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ error: 'Stripe no configurado' }, { status: 503 });

  const dbUser = await getOrCreateDbUser();
  if (!dbUser) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

  const { paymentMethodId } = await req.json();
  if (!paymentMethodId) return NextResponse.json({ error: 'paymentMethodId requerido' }, { status: 400 });

  // 1. Crear/obtener customer en Stripe
  let customerId = (dbUser as any).stripe_customer_id ?? '';
  if (!customerId) {
    const cRes = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email: dbUser.email, 'metadata[rideme_user_id]': dbUser.id }).toString(),
    });
    const customer = await cRes.json();
    if (!cRes.ok) return NextResponse.json({ error: customer.error?.message }, { status: 400 });
    customerId = customer.id;
    const sql = getDb();
    await sql.query(`UPDATE users SET stripe_customer_id=$1 WHERE id=$2`, [customerId, dbUser.id]);
  }

  // 2. Adjuntar PaymentMethod al customer
  const pmRes = await fetch(`https://api.stripe.com/v1/payment_methods/${paymentMethodId}/attach`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ customer: customerId }).toString(),
  });
  const pm = await pmRes.json();
  if (!pmRes.ok) return NextResponse.json({ error: pm.error?.message }, { status: 400 });

  return NextResponse.json({ ok: true, paymentMethodId: pm.id, last4: pm.card?.last4, brand: pm.card?.brand });
}
