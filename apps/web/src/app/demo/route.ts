import { NextRequest, NextResponse } from 'next/server';

/** Unauth never arrives here (middleware 307 → /sign-in). Con sesión: producto /app. */
export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/app', req.url), 307);
}
