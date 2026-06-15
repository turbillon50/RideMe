import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const sql = getDb();
  const rides = await sql.query(
    `SELECT r.*, u.name AS driver_name, u.phone AS driver_phone
     FROM rides r
     LEFT JOIN drivers d ON d.id = r.driver_id
     LEFT JOIN users u ON u.id = d.user_id
     WHERE r.passenger_id = (SELECT id FROM users WHERE clerk_id=$1 LIMIT 1)
     ORDER BY r.created_at DESC LIMIT 50`,
    [userId]
  );
  return NextResponse.json({ ok: true, data: rides });
}
