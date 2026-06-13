import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const sp = new URL(req.url).searchParams;
  const page   = Math.max(1, parseInt(sp.get('page')  ?? '1'));
  const limit  = Math.min(50, parseInt(sp.get('limit') ?? '20'));
  const status = sp.get('status') ?? '';
  const online = sp.get('online') ?? '';
  const q      = sp.get('q') ?? '';
  const offset = (page - 1) * limit;
  const sql = getDb();

  const where: string[] = [];
  const vals: any[] = [];
  let i = 1;
  if (status) { where.push(`d.approval_status = $${i++}::driver_approval_status`); vals.push(status); }
  if (online === 'true')  { where.push(`d.is_online = true`); }
  if (online === 'false') { where.push(`d.is_online = false`); }
  if (q) { where.push(`(u.name ILIKE $${i} OR u.email ILIKE $${i} OR d.license_number ILIKE $${i})`); vals.push('%'+q+'%'); i++; }
  const wClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const [rows, [{ count }]] = await Promise.all([
    sql.query(
      `SELECT d.id, d.is_online, d.is_approved, d.approval_status, d.approval_notes,
              d.license_number, d.rating_average, d.rating_count, d.total_trips,
              d.current_latitude, d.current_longitude,
              u.name, u.email, u.phone, u.is_blocked,
              v.make, v.model, v.year, v.color, v.plate_number, v.vehicle_type
       FROM drivers d
       JOIN users u ON u.id = d.user_id
       LEFT JOIN vehicles v ON v.driver_id = d.id AND v.is_active = true
       ${wClause}
       ORDER BY d.created_at DESC LIMIT $${i} OFFSET $${i+1}`,
      [...vals, limit, offset]
    ),
    sql.query(`SELECT COUNT(*) FROM drivers d JOIN users u ON u.id=d.user_id ${wClause}`, vals),
  ]) as [any[], [{ count: string }]];

  return NextResponse.json({ ok: true, drivers: rows, total: parseInt(count), page, limit });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const { id, action, notes } = await req.json();
  if (!id || !['approve','reject','toggle_block'].includes(action))
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
  const sql = getDb();
  if (action === 'toggle_block') {
    await sql.query(`UPDATE users SET is_blocked = NOT is_blocked, updated_at=NOW()
      WHERE id=(SELECT user_id FROM drivers WHERE id=$1)`, [id]);
    return NextResponse.json({ ok: true });
  }
  const newStatus = action === 'approve' ? 'approved' : 'rejected';
  await sql.query(
    `UPDATE drivers SET approval_status=$1::driver_approval_status, is_approved=$2,
     is_online=$2, approval_notes=$3, updated_at=NOW() WHERE id=$4`,
    [newStatus, action === 'approve', notes ?? null, id]
  );
  return NextResponse.json({ ok: true, status: newStatus });
}
