import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/db-user';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const dbUser = await getOrCreateDbUser();
  if (!dbUser) return NextResponse.json({ data: [] });
  const sql = getDb();

  // Buscar rides en searching cerca del driver
  const [driver] = await sql.query(
    `SELECT d.id, d.is_online, d.current_latitude, d.current_longitude, d.is_approved
     FROM drivers d WHERE d.user_id=$1 LIMIT 1`, [dbUser.id]
  ) as any[];

  if (!driver?.is_online || !driver?.is_approved) return NextResponse.json({ data: [] });

  const lat = Number(driver.current_latitude ?? 19.4326);
  const lng = Number(driver.current_longitude ?? -99.1332);

  const rides = await sql.query(
    `SELECT r.*, u.name AS passenger_name, u.phone AS passenger_phone,
      (6371000 * acos(cos(radians($1))*cos(radians(r.origin_latitude))*cos(radians(r.origin_longitude)-radians($2))+sin(radians($1))*sin(radians(r.origin_latitude)))) AS distance_m
     FROM rides r
     JOIN users u ON u.id = r.passenger_id
     WHERE r.status = 'searching' AND r.driver_id IS NULL
     HAVING (6371000 * acos(cos(radians($1))*cos(radians(r.origin_latitude))*cos(radians(r.origin_longitude)-radians($2))+sin(radians($1))*sin(radians(r.origin_latitude)))) <= 15000
     ORDER BY distance_m LIMIT 3`,
    [lat, lng]
  ) as any[];

  return NextResponse.json({ ok: true, data: rides });
}
