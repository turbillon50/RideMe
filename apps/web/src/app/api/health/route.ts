import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Health reflects dependency availability without leaking database errors.
export async function GET() {
  try {
    const sql = getDb();
    await sql.query('SELECT 1', []);
    const rows = (await sql.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'invitations'
      ) AS ok`, []
    )) as Array<{ ok: boolean }>;
    return NextResponse.json(
      { status: 'ok', service: 'rideme-web', database: 'ok', invitations: rows[0]?.ok === true },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json(
      { status: 'degraded', service: 'rideme-web', database: 'unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
