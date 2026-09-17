'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconCall, IconChat, IconDot, IconLightning, IconPin, IconStar } from '@/components/rm-icons';
import { RideMap } from '@/components/ride/RideMap';
import { AppNav } from '@/components/layout/AppNav';
import { useTripStore } from '@/store/tripStore';
import { DEMO_TRIP } from '@/lib/demo-ride';

export default function TripTrackingPage() {
  const router = useRouter();
  const { activeRide, setActiveRide } = useTripStore();
  const ride = activeRide && activeRide.status !== 'searching' ? activeRide : DEMO_TRIP;

  useEffect(() => {
    if (!activeRide || activeRide.status === 'searching') setActiveRide(DEMO_TRIP);
  }, [activeRide, setActiveRide]);

  return (
    <main className="rm-app">
      <RideMap
        pickup={String(ride.origin_address)}
        dropoff={String(ride.destination_address)}
        eta="3 min"
        mode="trip"
      />
      <header className="rm-app__top">
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--rm-border)] bg-[color-mix(in_srgb,var(--rm-bg)_70%,transparent)] px-2 py-1.5 backdrop-blur-md">
          <span className="rm-mark">
            <IconLightning size={18} />
          </span>
          <span className="pr-2 text-sm font-bold">En viaje</span>
        </div>
        <span className="rm-live-pill">En camino</span>
      </header>

      <section className="rm-app__sheet rm-enter">
        <div className="rm-app__handle" />
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rm-accent)]">Tu RideMe</p>
        <h1 className="mb-4 text-[22px] font-bold tracking-tight">Llega en 3 min</h1>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--rm-accent-muted)] text-lg font-bold text-[var(--rm-accent)]">
            {(ride.driver_name || 'J').slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 font-semibold">
              {ride.driver_name || 'Juan D.'}
              <IconStar size={13} className="text-[var(--rm-accent)]" />
              <span className="text-sm text-[var(--rm-accent)]">{Number(ride.driver_rating || 4.97).toFixed(2)}</span>
            </div>
            <p className="text-xs text-[var(--rm-text-3)]">
              {ride.vehicle_make} {ride.vehicle_model}
            </p>
            <span className="rm-plate">{ride.plate_number}</span>
          </div>
          <a href="tel:+525512345678" className="rm-pressable flex h-12 w-12 items-center justify-center rounded-full bg-[var(--rm-accent)] text-[var(--rm-cta-fg)]" aria-label="Llamar">
            <IconCall size={20} />
          </a>
          <button type="button" className="rm-pressable flex h-12 w-12 items-center justify-center rounded-full border border-[var(--rm-border)]" aria-label="Chat">
            <IconChat size={18} />
          </button>
        </div>

        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <IconDot size={14} className="mt-0.5 text-[var(--rm-accent)]" />
            <span>{ride.origin_address}</span>
          </div>
          <div className="ml-[6px] h-4 w-px bg-[var(--rm-border-strong)]" />
          <div className="flex items-start gap-2">
            <IconPin size={14} className="rm-map__pin mt-0.5" />
            <span>{ride.destination_address}</span>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-[var(--rm-text-3)]">Precio acordado</span>
          <span className="rm-price text-xl">${ride.proposed_price}</span>
        </div>

        <button type="button" className="rm-btn rm-btn--secondary rm-btn--block" onClick={() => router.push('/app')}>
          Terminé · volver
        </button>
      </section>
      <AppNav />
    </main>
  );
}
