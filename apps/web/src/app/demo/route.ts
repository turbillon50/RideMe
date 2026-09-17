import { NextRequest, NextResponse } from 'next/server';

/** Demo CTA retirado: sin sesión → muro de sign-in. */
export function GET(req: NextRequest) {
  const url = new URL('/sign-in', req.url);
  url.searchParams.set('redirect_url', '/demo');
  return NextResponse.redirect(url);
}
