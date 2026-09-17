'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTripStore } from '@/store/tripStore';
import { BottomNav } from '@/components/layout/BottomNav';
import { RideShell, BrandChip } from '@/components/shell/RideShell';
import { MapView } from '@/components/maps/MapView';
import { OfferCard } from '@/components/ride/OfferCard';
import { useRideNegotiation } from '@/hooks/useRideNegotiation';
import { useGeolocation } from '@/hooks/useGeolocation';

export default function OffersPage() {
  const router = useRouter();
  const { activeRide, setActiveRide, offers, selectedOffer, setSelectedOffer } = useTripStore();
  const { acceptOffer, cancelRide } = useRideNegotiation();
  const { location } = useGeolocation({ watch: true });
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);

  const center = location
    ? { lat: location.latitude, lng: location.longitude }
    : { lat: 19.4326, lng: -99.1332 };

  const poll = useCallback(async () => {
    if (!activeRide?.id) return;
    try {
      const res = await fetch(`/api/rides/${activeRide.id}`);
      const data = await res.json();
      const ride = data.data;
      if (!ride) return;
      setActiveRide(ride);
      if (ride.status === 'accepted' || ride.status === 'driver_en_route') {
        router.push('/app/trip');
      }
    } catch {}
  }, [activeRide?.id, router, setActiveRide]);

  useEffect(() => {
    if (!activeRide?.id) {
      router.push('/app');
      return;
    }
    const pollId = setInterval(poll, 6000);
    const elId = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      clearInterval(pollId);
      clearInterval(elId);
    };
  }, [activeRide?.id, poll, router]);

  const confirm = async () => {
    if (!selectedOffer) return;
    setLoading(true);
    try {
      await acceptOffer(selectedOffer);
    } finally {
      setLoading(false);
    }
  };

  const live = offers.filter((o) => o.status !== 'rejected' && o.status !== 'expired');

  return (
    <RideShell
      map={<MapView center={center} userLocation={center} className="h-full w-full" />}
      topLeft={<BrandChip />}
      nav={<BottomNav role="passenger" />}
      panel={
        <div className="flex flex-col gap-4 pb-4">
          <header>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--rm-subtle)]">
              {live.length ? `${live.length} ofertas` : 'Buscando'} · {String(Math.floor(elapsed / 60)).padStart(2, '0')}:
              {String(elapsed % 60).padStart(2, '0')}
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              {live.length ? 'Elige chofer' : 'Esperando ofertas'}
            </h1>
          </header>

          {activeRide && (
            <p className="text-sm text-[var(--rm-muted)]">
              {activeRide.origin_address || 'Tu ubicación'} → {activeRide.destination_address || 'Destino'}
            </p>
          )}

          <ul className="flex flex-col gap-2">
            <AnimatePresence>
              {live.map((offer, i) => (
                <li key={offer.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedOffer(offer)}
                    className="w-full text-left"
                  >
                    <OfferCard
                      offer={offer}
                      index={i}
                      onAccept={() => setSelectedOffer(offer)}
                      onReject={() => {}}
                      loading={loading}
                    />
                  </button>
                </li>
              ))}
            </AnimatePresence>
          </ul>

          {live.length === 0 && (
            <p className="py-8 text-center text-sm text-[var(--rm-muted)]">
              Publicando tu tarifa a choferes cercanos…
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancelRide}
              className="h-12 flex-1 rounded-2xl ring-1 ring-[var(--rm-danger)]/40 text-sm font-semibold text-[var(--rm-danger)]"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!selectedOffer || loading}
              onClick={confirm}
              className="h-12 flex-[2] rounded-2xl bg-[var(--rm-accent)] text-sm font-semibold text-[var(--rm-accent-fg)] disabled:opacity-40"
            >
              Confirmar
            </button>
          </div>
        </div>
      }
    />
  );
}
