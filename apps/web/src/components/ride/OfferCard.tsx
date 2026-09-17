'use client';

import { motion } from 'framer-motion';
import { Star, Clock, Check, X } from '@/components/icons';
import type { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
  index: number;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
  loading?: boolean;
}

export function OfferCard({ offer, index, onAccept, onReject, loading }: OfferCardProps) {
  const d = offer.driver;
  const initials = d ? `${d.firstName[0]}${d.lastName[0]}` : '?';
  const etaMin = offer.driverEtaSeconds ? Math.ceil(offer.driverEtaSeconds / 60) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 400, damping: 30 }}
      className="rounded-2xl bg-[var(--rm-elevated)] p-4 ring-1 ring-[var(--rm-line)]"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--rm-sheet)] text-sm font-semibold text-[var(--rm-accent)]">
          {d?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.avatarUrl} alt="" className="h-full w-full rounded-xl object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">
            {d ? `${d.firstName} ${d.lastName}` : 'Chofer'}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--rm-muted)]">
            <Star size={11} className="text-[var(--rm-warn)]" />
            {d?.ratingAverage?.toFixed(1) ?? '5.0'}
            <span>· {d?.totalTrips ?? 0} viajes</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold tabular-nums">${offer.offeredPrice.toFixed(0)}</div>
          {offer.offerType === 'counter' && (
            <span className="text-[11px] font-medium text-[var(--rm-warn)]">Contraoferta</span>
          )}
        </div>
      </div>

      {d?.vehicle && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-[var(--rm-raised)] px-3 py-2 text-xs text-[var(--rm-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--rm-accent)]" />
          {d.vehicle.make} {d.vehicle.model} · {d.vehicle.color} · {d.vehicle.plateNumber}
        </div>
      )}

      <div className="flex items-center gap-3">
        {etaMin && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--rm-muted)]">
            <Clock size={13} />
            {etaMin} min
          </div>
        )}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => onReject(offer.id)}
            disabled={loading}
            className="flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-[var(--rm-danger)]/30 text-[var(--rm-danger)] disabled:opacity-50"
            aria-label="Rechazar oferta"
          >
            <X size={16} />
          </button>
          <button
            onClick={() => onAccept(offer.id)}
            disabled={loading}
            className="flex h-11 items-center gap-2 rounded-xl bg-[var(--rm-accent)] px-4 text-sm font-semibold text-[var(--rm-accent-fg)] disabled:opacity-50"
          >
            <Check size={16} /> Aceptar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
