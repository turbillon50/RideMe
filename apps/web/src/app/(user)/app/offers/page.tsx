'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconStar, IconCar, IconLightning } from '@/components/rm-icons';
import { RideMap } from '@/components/ride/RideMap';
import { AppNav } from '@/components/layout/AppNav';
import { useTripStore } from '@/store/tripStore';
import { DEMO_OFFERS, DEMO_RIDE, DEMO_TRIP } from '@/lib/demo-ride';

export default function OffersPage() {
  const router = useRouter();
  const { activeRide, setActiveRide } = useTripStore();
  const ride = activeRide || DEMO_RIDE;
  const [offers] = useState(DEMO_OFFERS);

  useEffect(() => {
    if (!activeRide) setActiveRide(DEMO_RIDE);
  }, [activeRide, setActiveRide]);

  const accept = (price: number, name: string) => {
    setActiveRide({
      ...DEMO_TRIP,
      ...ride,
      status: 'driver_en_route',
      proposed_price: price,
      final_price: price,
      driver_name: name,
    });
    router.push('/app/trip');
  };

  return (
    <main className="rm-app">
      <RideMap pickup={ride.origin_address} dropoff={ride.destination_address} eta="buscando" />
      <header className="rm-app__top">
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--rm-border)] bg-[color-mix(in_srgb,var(--rm-bg)_70%,transparent)] px-2 py-1.5 backdrop-blur-md">
          <span className="rm-mark">
            <IconLightning size={18} />
          </span>
          <span className="pr-2 text-sm font-bold">Ofertas</span>
        </div>
        <div className="rm-price rounded-2xl bg-[var(--rm-bg)]/80 px-3 py-2 text-lg">${ride.proposed_price}</div>
      </header>

      <section className="rm-app__sheet" style={{ maxHeight: '58%' }}>
        <div className="rm-app__handle" />
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rm-accent)]">
          Choferes compitiendo
        </p>
        <h1 className="mb-3 text-[20px] font-bold tracking-tight">Elige tu RideMe</h1>
        <div className="flex max-h-[38vh] flex-col gap-2 overflow-y-auto pb-2">
          {offers.map((o) => (
            <article key={o.id} className="rm-offer">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--rm-accent-muted)] text-sm font-bold text-[var(--rm-accent)]">
                {o.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-sm font-semibold">
                  {o.name}
                  <IconStar size={12} className="text-[var(--rm-accent)]" />
                  <span className="text-xs text-[var(--rm-accent)]">{o.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--rm-text-3)]">
                  <IconCar size={12} />
                  {o.car} · {o.etaMin} min
                </div>
              </div>
              <div className="text-right">
                <div className="rm-price text-base">${o.price}</div>
                <button
                  type="button"
                  className="rm-pressable mt-1 text-xs font-bold text-[var(--rm-accent)]"
                  onClick={() => accept(o.price, o.name)}
                >
                  Aceptar
                </button>
              </div>
            </article>
          ))}
        </div>
        <button type="button" className="rm-btn rm-btn--ghost rm-btn--block mt-2" onClick={() => router.push('/app')}>
          Cancelar solicitud
        </button>
      </section>
      <AppNav />
    </main>
  );
}
