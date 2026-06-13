import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat  = parseFloat(searchParams.get('lat')    ?? '19.4326');
  const lng  = parseFloat(searchParams.get('lng')    ?? '-99.1332');
  const rad  = parseFloat(searchParams.get('radius') ?? '5000'); // metros

  try {
    const sql = getDb();
    // Distancia Haversine en metros (sin PostGIS)
    const rows = await sql.query(
      `SELECT
         d.id,
         u.name,
         u.first_name,
         d.current_latitude  AS latitude,
         d.current_longitude AS longitude,
         d.rating_average,
         d.total_trips,
         v.make, v.model, v.year, v.color, v.vehicle_type,
         (
           6371000 * acos(
             cos(radians($1)) * cos(radians(d.current_latitude))
             * cos(radians(d.current_longitude) - radians($2))
             + sin(radians($1)) * sin(radians(d.current_latitude))
           )
         ) AS distance_m
       FROM drivers d
       JOIN users    u ON u.id = d.user_id
       LEFT JOIN vehicles v ON v.driver_id = d.id AND v.is_active = true
       WHERE d.is_online = true
         AND d.is_approved = true
         AND d.current_latitude  IS NOT NULL
         AND d.current_longitude IS NOT NULL
         AND (
           6371000 * acos(
             cos(radians($1)) * cos(radians(d.current_latitude))
             * cos(radians(d.current_longitude) - radians($2))
             + sin(radians($1)) * sin(radians(d.current_latitude))
           )
         ) <= $3
       ORDER BY distance_m
       LIMIT 20`,
      [lat, lng, rad]
    ) as any[];

    return NextResponse.json({ ok: true, data: rows });
  } catch (err: any) {
    console.error('[drivers/nearby]', err?.message);
    return NextResponse.json({ ok: false, data: [], error: err?.message }, { status: 500 });
  }
}
