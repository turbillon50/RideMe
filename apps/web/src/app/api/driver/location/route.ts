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
  const { latitude, longitude } = await req.json();
  const sql = getDb();
  await sql.query(
    `UPDATE drivers SET current_latitude=$1, current_longitude=$2,
     current_location_updated_at=NOW(), updated_at=NOW()
     WHERE user_id=$3`,
    [latitude, longitude, dbUser.id]
  );
  return NextResponse.json({ ok: true });
}
