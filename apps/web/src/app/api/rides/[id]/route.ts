import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/db-user';

export const dynamic = 'force-dynamic';

// GET /api/rides/:id — estado actual del viaje (polling)
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const sql = getDb();
  const [ride] = await sql.query(
    `SELECT r.*, u.name AS driver_name, u.phone AS driver_phone,
            v.make, v.model, v.color, v.plate_number,
            d.current_latitude AS driver_lat, d.current_longitude AS driver_lng, d.rating_average
     FROM rides r
     LEFT JOIN drivers d ON d.id = r.driver_id
     LEFT JOIN users u ON u.id = d.user_id
     LEFT JOIN vehicles v ON v.driver_id = d.id AND v.is_active=true
     WHERE r.id = $1`, [params.id]
  ) as any[];
  if (!ride) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json({ ok: true, data: ride });
}

// PATCH /api/rides/:id — actualizar estado (cancelar, completar, aceptar)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const dbUser = await getOrCreateDbUser();
  const { action, cancelReason } = await req.json();
  const sql = getDb();
  let q = '';
  const vals: any[] = [params.id];
  if (action === 'cancel') {
    q = `UPDATE rides SET status='cancelled', cancelled_at=NOW(), cancel_reason=$2, updated_at=NOW() WHERE id=$1 RETURNING *`;
    vals.push(cancelReason ?? 'Cancelado por usuario');
  } else if (action === 'rate') {
    const { rating } = await req.json().catch(() => ({ rating: 5 }));
    q = `UPDATE rides SET rating_by_passenger=$2, updated_at=NOW() WHERE id=$1 RETURNING *`;
    vals.push(Math.min(5, Math.max(1, Number(rating) || 5)));
  } else if (action === 'complete') {
    q = `UPDATE rides SET status='completed', completed_at=NOW(), updated_at=NOW() WHERE id=$1 RETURNING *`;
  } else {
    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
  }
  const [ride] = await sql.query(q, vals) as any[];
  return NextResponse.json({ ok: true, data: ride });
}
