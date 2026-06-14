// RideMe Pricing Engine
// Reglas validadas con Luis Uber (operador)

export interface PriceBreakdown {
  base: number;          // Precio base del viaje
  dynamicSurcharge: number; // Cargo por tiempo extra
  subtotal: number;      // Lo que paga el pasajero
  commission: number;    // 10% → RideMe
  driverEarns: number;   // Lo que recibe el chofer
  rideType: string;
}

export interface CancellationFee {
  amount: number;
  reason: string;
  pct?: number;
}

const COMMISSION_RATE = 0.10;          // 10% RideMe
const BASE_RATE_MXN = 150;             // $150 por 30min/20km
const BASE_MINUTES = 30;
const BASE_KM = 20;
const DYNAMIC_TRIGGER_MINUTES = 5;     // Después de 5min extra
const DYNAMIC_RATE = 1.50;             // $1.50/min adicional
const CANCEL_FLAT_FEE = 20;            // $20 cancelación inmediata
const AIRPORT_MINIMUM = 800;           // $800 mínimo aeropuerto
const AIRPORT_MAX_KM = 40;
const PROMO_FREE_RIDES = 100;          // Primeros 100 viajes sin comisión

export function calculatePrice({
  distanceKm,
  estimatedMinutes,
  actualMinutes,
  rideType = 'standard',
  driverFreeRidesRemaining = 0,
}: {
  distanceKm: number;
  estimatedMinutes: number;
  actualMinutes?: number;
  rideType?: string;
  driverFreeRidesRemaining?: number;
}): PriceBreakdown {
  // Precio base proporcional a distancia y tiempo
  const distanceFactor = Math.max(1, distanceKm / BASE_KM);
  const timeFactor = Math.max(1, estimatedMinutes / BASE_MINUTES);
  let base = BASE_RATE_MXN * Math.max(distanceFactor, timeFactor);

  // Aeropuerto: mínimo $800
  if (rideType === 'airport') {
    base = Math.max(AIRPORT_MINIMUM, base);
  }

  // Cargo dinámico por tiempo extra
  const usedMinutes = actualMinutes ?? estimatedMinutes;
  const extraMinutes = Math.max(0, usedMinutes - estimatedMinutes - DYNAMIC_TRIGGER_MINUTES);
  const dynamicSurcharge = extraMinutes * DYNAMIC_RATE;

  const subtotal = Math.round((base + dynamicSurcharge) * 100) / 100;

  // Comisión (0 si el chofer tiene viajes promo restantes)
  const commissionRate = driverFreeRidesRemaining > 0 ? 0 : COMMISSION_RATE;
  const commission = Math.round(subtotal * commissionRate * 100) / 100;
  const driverEarns = subtotal - commission;

  return { base, dynamicSurcharge, subtotal, commission, driverEarns, rideType };
}

export function calculateCancellationFee({
  isScheduled,
  scheduledFor,
  proposedPrice,
  cancelledBy,
}: {
  isScheduled: boolean;
  scheduledFor?: Date | string | null;
  proposedPrice: number;
  cancelledBy?: string;
}): CancellationFee {
  // Viaje inmediato: tarifa plana $20
  if (!isScheduled) {
    return { amount: CANCEL_FLAT_FEE, reason: `Cargo por cancelación: $${CANCEL_FLAT_FEE} MXN` };
  }

  // Reservación programada: escalonado por anticipación
  const hoursUntil = scheduledFor
    ? (new Date(scheduledFor).getTime() - Date.now()) / 3_600_000
    : 99;

  if (hoursUntil <= 2) {
    const amount = Math.round(proposedPrice * 0.80 * 100) / 100;
    return { amount, pct: 80, reason: `Cancelación < 2hrs: 80% del viaje ($${amount} MXN)` };
  }
  if (hoursUntil <= 8) {
    const amount = Math.round(proposedPrice * 0.50 * 100) / 100;
    return { amount, pct: 50, reason: `Cancelación < 8hrs: 50% del viaje ($${amount} MXN)` };
  }
  const amount = Math.round(proposedPrice * 0.20 * 100) / 100;
  return { amount, pct: 20, reason: `Cancelación > 8hrs: 20% del viaje ($${amount} MXN)` };
}

export function validateAirportRide(distanceKm: number, estimatedMinutes: number): {
  valid: boolean; error?: string;
} {
  if (distanceKm > AIRPORT_MAX_KM) {
    return { valid: false, error: `Aeropuerto: máximo ${AIRPORT_MAX_KM}km` };
  }
  if (estimatedMinutes > 60) {
    return { valid: false, error: 'Aeropuerto: máximo 1 hora de trayecto' };
  }
  return { valid: true };
}

export const PRICING_CONFIG = {
  COMMISSION_RATE,
  BASE_RATE_MXN,
  DYNAMIC_RATE,
  DYNAMIC_TRIGGER_MINUTES,
  CANCEL_FLAT_FEE,
  AIRPORT_MINIMUM,
  AIRPORT_MAX_KM,
  PROMO_FREE_RIDES,
};
