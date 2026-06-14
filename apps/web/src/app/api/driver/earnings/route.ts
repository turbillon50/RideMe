import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/db-user';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const dbUser = await getOrCreateDbUser();
  if (!dbUser) return NextResponse.json({ data: { today_gross: 0, week_gross: 0, total_trips: 0 } });
  const sql = getDb();
  const [row] = await sql.query(
    `SELECT
       COALESCE(SUM(r.final_price) FILTER (WHERE r.completed_at > NOW()-INTERVAL '1 day'),0) AS today_gross,
       COALESCE(SUM(r.final_price) FILTER (WHERE r.completed_at > NOW()-INTERVAL '7 days'),0) AS week_gross,
       COUNT(*) FILTER (WHERE r.status='completed') AS total_trips
     FROM rides r
     JOIN drivers d ON d.id=r.driver_id
     WHERE d.user_id=$1`, [dbUser.id]
  ) as any[];
  return NextResponse.json({ ok: true, data: row ?? { today_gross: 0, week_gross: 0, total_trips: 0 } });
}
