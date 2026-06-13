import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/db-user';

export const dynamic = 'force-dynamic';

// POST /api/rides — pasajero solicita un viaje
export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const dbUser = await getOrCreateDbUser();
  if (!dbUser) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  const body = await req.json();
  const sql = getDb();
  const [ride] = await sql.query(
    `INSERT INTO rides
      (passenger_id, origin_address, origin_latitude, origin_longitude,
       destination_address, destination_latitude, destination_longitude,
       proposed_price, payment_method, vehicle_type, is_scheduled, scheduled_for)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::payment_method_type,$10::vehicle_type,$11,$12)
     RETURNING *`,
    [
      dbUser.id,
      body.originAddress, body.originLatitude, body.originLongitude,
      body.destinationAddress, body.destinationLatitude, body.destinationLongitude,
      body.proposedPrice, body.paymentMethod ?? 'cash',
      body.vehicleType ?? 'sedan',
      body.isScheduled ?? false, body.scheduledFor ?? null,
    ]
  ) as any[];
  return NextResponse.json({ ok: true, data: { ride } });
}

// GET /api/rides — viajes del pasajero actual
export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const dbUser = await getOrCreateDbUser();
  if (!dbUser) return NextResponse.json({ ok: true, data: [] });
  const sql = getDb();
  const rows = await sql.query(
    `SELECT r.*, u.name AS driver_name, v.make, v.model, v.color, v.plate_number
     FROM rides r
     LEFT JOIN drivers d ON d.id = r.driver_id
     LEFT JOIN users u ON u.id = d.user_id
     LEFT JOIN vehicles v ON v.driver_id = d.id AND v.is_active=true
     WHERE r.passenger_id = $1 ORDER BY r.created_at DESC LIMIT 20`, [dbUser.id]
  ) as any[];
  return NextResponse.json({ ok: true, data: rows });
}
