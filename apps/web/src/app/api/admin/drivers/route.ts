import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// GET – lista de onboardings (por defecto los pending)
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const status = new URL(req.url).searchParams.get('status') ?? 'pending';
  const sql = getDb();
  const rows = await sql.query(
    `SELECT * FROM driver_onboarding WHERE ($1 = 'all' OR status = $1::driver_approval_status)
     ORDER BY submitted_at DESC NULLS LAST, created_at DESC LIMIT 50`,
    [status]
  ) as any[];
  return NextResponse.json({ ok: true, data: rows });
}

// PATCH – aprobar o rechazar un onboarding y activar al chofer en DB
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const { id, action, notes } = await req.json(); // action: 'approve' | 'reject'
  if (!id || !['approve','reject'].includes(action))
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });

  const sql = getDb();
  const newStatus = action === 'approve' ? 'approved' : 'rejected';

  // Actualizar onboarding
  const [ob] = await sql.query(
    `UPDATE driver_onboarding SET status=$1::driver_approval_status, admin_notes=$2, reviewed_at=NOW()
     WHERE id=$3 RETURNING *`,
    [newStatus, notes ?? null, id]
  ) as any[];
  if (!ob) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  if (action === 'approve') {
    // Crear o actualizar user en tabla users
    const [user] = await sql.query(
      `INSERT INTO users (clerk_id, email, name, first_name, role, is_active)
       VALUES ($1,$2,$3,$4,'driver',true)
       ON CONFLICT (clerk_id) DO UPDATE SET role='driver', updated_at=NOW()
       RETURNING id`,
      [ob.clerk_id, ob.email, ob.full_name, ob.full_name?.split(' ')[0]]
    ) as any[];

    // Crear driver row
    await sql.query(
      `INSERT INTO drivers
         (user_id, license_number, license_expiry_date, is_online, is_approved, approval_status, subscription_status)
       VALUES ($1,$2,$3,true,true,'approved','active')
       ON CONFLICT (user_id) DO UPDATE SET
         is_approved=true, is_online=true, approval_status='approved', updated_at=NOW()`,
      [user.id, ob.license_number ?? 'PENDIENTE', ob.license_expiry ?? null]
    );

    // Crear vehículo
    if (ob.plate_number) {
      await sql.query(
        `INSERT INTO vehicles (driver_id, make, model, year, color, plate_number, vehicle_type)
         VALUES ((SELECT id FROM drivers WHERE user_id=$1),$2,$3,$4,$5,$6,$7::vehicle_type)
         ON CONFLICT (plate_number) DO NOTHING`,
        [user.id, ob.vehicle_make??'N/A', ob.vehicle_model??'N/A',
         ob.vehicle_year??2020, ob.vehicle_color??'N/A', ob.plate_number, ob.vehicle_type]
      );
    }
  }

  return NextResponse.json({ ok: true, status: newStatus, data: ob });
}
