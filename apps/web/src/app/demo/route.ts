import { NextRequest, NextResponse } from 'next/server';

/** Preview / smoke: el producto vive en /app. */
export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/app', req.url), 307);
}
