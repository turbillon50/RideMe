import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
// Max 2MB files stored as base64 in Neon (upgrade a R2 cuando esté configurado)
const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const docType = form.get('doc_type') as string || 'photo_selfie';

  if (!file) return NextResponse.json({ error: 'Sin archivo' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Máximo 2MB' }, { status: 413 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const b64 = `data:${file.type};base64,${buffer.toString('base64')}`;
  const sql = getDb();

  // Buscar driver_id del usuario
  const [dr] = await sql.query(
    `SELECT d.id FROM drivers d JOIN users u ON u.id=d.user_id WHERE u.clerk_id=$1 LIMIT 1`,
    [userId]
  ) as any[];

  if (!dr) {
    // Si no existe driver aún, guardar en onboarding como referencia temporal
    return NextResponse.json({ ok: true, url: b64, stored: 'inline' });
  }

  await sql.query(
    `INSERT INTO driver_documents (driver_id, document_type, file_url, status)
     VALUES ($1, $2::document_type, $3, 'pending')
     ON CONFLICT (driver_id, document_type) DO UPDATE SET file_url=$3, status='pending', updated_at=NOW()`,
    [dr.id, docType, b64]
  );

  return NextResponse.json({ ok: true, url: b64, stored: 'neon', driver_id: dr.id });
}
