import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/db-user';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const sql = getDb();
  const [user] = await sql.query(
    `SELECT id, name, phone, avatar_url, home_address, work_address, preferred_vehicle, preferred_payment,
     notifications_enabled, referral_code, total_rides, total_spent
     FROM users WHERE clerk_id=$1 LIMIT 1`, [userId]
  ) as any[];
  if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  return NextResponse.json({ ok: true, user });
}

export async function PATCH(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const body = await req.json();
  const allowed = ['name','phone','avatar_url','home_address','work_address',
    'home_lat','home_lng','work_lat','work_lng','preferred_vehicle','preferred_payment','notifications_enabled'];
  const updates: string[] = [];
  const vals: any[] = [];
  let i = 1;
  for (const [k, v] of Object.entries(body)) {
    if (allowed.includes(k)) { updates.push(`${k}=$${i++}`); vals.push(v); }
  }
  if (!updates.length) return NextResponse.json({ ok: true });
  vals.push(userId);
  const sql = getDb();
  await sql.query(`UPDATE users SET ${updates.join(',')}, updated_at=NOW() WHERE clerk_id=$${i}`, vals);
  return NextResponse.json({ ok: true });
}
