import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/db-user';

export const dynamic = 'force-dynamic';

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const dbUser = await getOrCreateDbUser();
  if (!dbUser) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  const sql = getDb();

  // Obtener driver_id
  const [driver] = await sql.query(`SELECT id FROM drivers WHERE user_id=$1 LIMIT 1`, [dbUser.id]) as any[];
  if (!driver) return NextResponse.json({ error: 'No eres chofer' }, { status: 403 });

  // Intentar asignar el viaje (atomic - solo un chofer lo puede tomar)
  const [ride] = await sql.query(
    `UPDATE rides SET driver_id=$1, status='accepted', updated_at=NOW()
     WHERE id=$2 AND status='searching' AND driver_id IS NULL RETURNING *`,
    [driver.id, params.id]
  ) as any[];

  if (!ride) return NextResponse.json({ error: 'Viaje ya tomado' }, { status: 409 });
  return NextResponse.json({ ok: true, data: ride });
}
