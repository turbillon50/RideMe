import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const { amount } = await req.json();

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ error: 'Stripe no configurado' }, { status: 500 });

  const res = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      amount: String(Math.round(amount * 100)),
      currency: 'mxn',
      automatic_payment_methods: 'enabled',
      'metadata[source]': 'rideme',
    }).toString(),
  });

  const pi = await res.json();
  if (!res.ok) return NextResponse.json({ error: pi.error?.message }, { status: 400 });
  return NextResponse.json({ ok: true, clientSecret: pi.client_secret });
}
