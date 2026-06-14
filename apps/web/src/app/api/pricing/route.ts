import { NextRequest, NextResponse } from 'next/server';
import { calculatePrice, calculateCancellationFee } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

// GET /api/pricing?distanceKm=X&estimatedMinutes=Y&rideType=Z
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const distanceKm = parseFloat(searchParams.get('distanceKm') ?? '10');
  const estimatedMinutes = parseInt(searchParams.get('estimatedMinutes') ?? '20', 10);
  const rideType = searchParams.get('rideType') ?? 'standard';

  const breakdown = calculatePrice({ distanceKm, estimatedMinutes, rideType });
  return NextResponse.json({ ok: true, data: breakdown });
}
