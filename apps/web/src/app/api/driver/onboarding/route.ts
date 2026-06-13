import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET  – obtener estado del onboarding del chofer actual
export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const sql = getDb();
  const rows = await sql.query(
    `SELECT * FROM driver_onboarding WHERE clerk_id = $1`, [userId]
  ) as any[];
  return NextResponse.json({ ok: true, data: rows[0] ?? null });
}

// POST – crear o actualizar onboarding (paso a paso)
export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const body = await req.json();
  const sql = getDb();
  const rows = await sql.query(
    `INSERT INTO driver_onboarding
       (clerk_id, email, full_name, phone, license_number, license_expiry,
        vehicle_make, vehicle_model, vehicle_year, vehicle_color, plate_number,
        vehicle_type, step_completed, submitted_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::vehicle_type,$13,
             CASE WHEN $13 >= 3 THEN NOW() ELSE NULL END, NOW())
     ON CONFLICT (clerk_id) DO UPDATE SET
       email          = COALESCE(EXCLUDED.email, driver_onboarding.email),
       full_name      = COALESCE(EXCLUDED.full_name, driver_onboarding.full_name),
       phone          = COALESCE(EXCLUDED.phone, driver_onboarding.phone),
       license_number = COALESCE(EXCLUDED.license_number, driver_onboarding.license_number),
       license_expiry = COALESCE(EXCLUDED.license_expiry, driver_onboarding.license_expiry),
       vehicle_make   = COALESCE(EXCLUDED.vehicle_make, driver_onboarding.vehicle_make),
       vehicle_model  = COALESCE(EXCLUDED.vehicle_model, driver_onboarding.vehicle_model),
       vehicle_year   = COALESCE(EXCLUDED.vehicle_year, driver_onboarding.vehicle_year),
       vehicle_color  = COALESCE(EXCLUDED.vehicle_color, driver_onboarding.vehicle_color),
       plate_number   = COALESCE(EXCLUDED.plate_number, driver_onboarding.plate_number),
       vehicle_type   = COALESCE(EXCLUDED.vehicle_type, driver_onboarding.vehicle_type),
       step_completed = GREATEST(driver_onboarding.step_completed, EXCLUDED.step_completed),
       submitted_at   = CASE WHEN EXCLUDED.step_completed >= 3 THEN NOW() ELSE driver_onboarding.submitted_at END,
       updated_at     = NOW()
     RETURNING *`,
    [
      userId,
      body.email ?? null,
      body.full_name ?? null,
      body.phone ?? null,
      body.license_number ?? null,
      body.license_expiry ?? null,
      body.vehicle_make ?? null,
      body.vehicle_model ?? null,
      body.vehicle_year ?? null,
      body.vehicle_color ?? null,
      body.plate_number ?? null,
      body.vehicle_type ?? 'sedan',
      body.step_completed ?? 1,
    ]
  ) as any[];
  return NextResponse.json({ ok: true, data: rows[0] });
}
