import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/db-user';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const dbUser = await getOrCreateDbUser();
  if (!dbUser) return NextResponse.json({ ok: false });
  const { isOnline } = await req.json();
  const sql = getDb();
  const [row] = await sql.query(
    `UPDATE drivers SET is_online=$1, updated_at=NOW() WHERE user_id=$2 RETURNING id, is_online`,
    [isOnline, dbUser.id]
  ) as any[];
  if (!row) return NextResponse.json({ error: 'Driver no encontrado' }, { status: 404 });
  return NextResponse.json({ ok: true, isOnline: row.is_online });
}
