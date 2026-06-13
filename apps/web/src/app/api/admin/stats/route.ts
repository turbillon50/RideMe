import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const sql = getDb();
  const [kpiRows, byDay, recent] = await Promise.all([
    sql.query(`SELECT
      (SELECT COUNT(*) FROM rides WHERE created_at > NOW()-INTERVAL '1 day') AS rides_today,
      (SELECT COUNT(*) FROM rides WHERE status IN ('searching','negotiating','accepted','driver_en_route','in_progress')) AS rides_active,
      (SELECT COUNT(*) FROM drivers WHERE is_online=true AND is_approved=true) AS drivers_online,
      (SELECT COUNT(*) FROM drivers WHERE approval_status='pending') AS drivers_pending,
      (SELECT COUNT(*) FROM drivers) AS total_drivers,
      (SELECT COUNT(*) FROM users WHERE role='passenger') AS total_users,
      (SELECT COUNT(*) FROM users WHERE role='passenger' AND created_at > NOW()-INTERVAL '30 days') AS new_users_30d,
      (SELECT COUNT(*) FROM rides) AS total_rides,
      (SELECT COUNT(*) FROM rides WHERE status='completed') AS rides_completed,
      (SELECT COUNT(*) FROM rides WHERE status='cancelled') AS rides_canceled,
      (SELECT COALESCE(SUM(final_price),0) FROM rides WHERE status='completed' AND completed_at > NOW()-INTERVAL '30 days') AS revenue_30d,
      (SELECT COALESCE(SUM(final_price),0) FROM rides WHERE status='completed') AS revenue_total,
      (SELECT COALESCE(AVG(final_price),0) FROM rides WHERE status='completed') AS avg_ticket`, []),
    sql.query(`SELECT DATE_TRUNC('day', created_at)::date AS day, COUNT(*) AS rides
      FROM rides WHERE created_at > NOW()-INTERVAL '14 days'
      GROUP BY 1 ORDER BY 1`, []),
    sql.query(`SELECT r.id, r.status, r.proposed_price, r.final_price, r.created_at,
        u.name AS passenger_name, d_u.name AS driver_name
      FROM rides r
      LEFT JOIN users u ON u.id = r.passenger_id
      LEFT JOIN drivers d ON d.id = r.driver_id
      LEFT JOIN users d_u ON d_u.id = d.user_id
      ORDER BY r.created_at DESC LIMIT 10`, []),
  ]) as [any[], any[], any[]];

  return NextResponse.json({ ok: true, kpis: kpiRows[0], ridesByDay: byDay, recentRides: recent });
}
