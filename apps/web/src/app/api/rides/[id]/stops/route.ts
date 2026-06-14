import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/db-user';

export const dynamic = 'force-dynamic';

// GET: listar paradas de un viaje
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const sql = getDb();
  const stops = await sql.query(
    `SELECT * FROM ride_stops WHERE ride_id=$1 ORDER BY stop_order, created_at`, [params.id]
  );
  return NextResponse.json({ ok: true, data: stops });
}

// POST: pasajero solicita parada adicional
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const { address, latitude, longitude } = await req.json();
  const sql = getDb();

  // Calcular cargo adicional estimado: $20 MXN por parada
  const additional_charge = 20;

  const [stop] = await sql.query(
    `INSERT INTO ride_stops (ride_id, address, latitude, longitude, additional_charge, status)
     VALUES ($1,$2,$3,$4,$5,'requested') RETURNING *`,
    [params.id, address, latitude, longitude, additional_charge]
  ) as any[];

  return NextResponse.json({ ok: true, data: stop });
}

// PATCH: chofer acepta/rechaza parada
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const { stopId, action } = await req.json();
  const sql = getDb();

  const status = action === 'accept' ? 'accepted' : 'declined';
  const [stop] = await sql.query(
    `UPDATE ride_stops SET status=$1, responded_at=NOW() WHERE id=$2 RETURNING *`,
    [status, stopId]
  ) as any[];

  if (stop && status === 'accepted') {
    // Actualizar precio del viaje sumando la parada
    await sql.query(
      `UPDATE rides SET proposed_price = proposed_price + $1, updated_at=NOW() WHERE id=$2`,
      [stop.additional_charge, params.id]
    );
  }

  return NextResponse.json({ ok: true, data: stop });
}
