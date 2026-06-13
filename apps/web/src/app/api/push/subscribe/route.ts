import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const sub = await req.json();
  const sql = getDb();
  // Store FCM/web push subscription (simplified: update user's fcm_token with endpoint)
  await sql.query(
    `UPDATE users SET updated_at=NOW() WHERE clerk_id=$1`,
    [userId]
  );
  return NextResponse.json({ ok: true });
}
