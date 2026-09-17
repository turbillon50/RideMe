'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconCash, IconDot, IconLightning, IconPin } from '@/components/rm-icons';
import { RideMap } from '@/components/ride/RideMap';
import { AppNav } from '@/components/layout/AppNav';
import { useTripStore } from '@/store/tripStore';
import { DEMO_RIDE } from '@/lib/demo-ride';

const SHORTCUTS = ['Aeropuerto GDL', 'Andares', 'Centro Histórico'];

export default function PassengerHome() {
  const router = useRouter();
  const setActiveRide = useTripStore((s) => s.setActiveRide);
  const [pickup, setPickup] = useState('Mi ubicación');
  const [destination, setDestination] = useState('Aeropuerto GDL');
  const [price, setPrice] = useState(95);
  const [busy, setBusy] = useState(false);

  const ask = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!destination.trim()) return;
    setBusy(true);
    const ride = {
      ...DEMO_RIDE,
      origin_address: pickup || 'Mi ubicación',
      destination_address: destination.trim(),
      proposed_price: price,
      final_price: price,
    };
    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originAddress: ride.origin_address,
          originLatitude: 20.6767,
          originLongitude: -103.3475,
          destinationAddress: ride.destination_address,
          destinationLatitude: 20.5218,
          destinationLongitude: -103.3106,
          proposedPrice: price,
          paymentMethod: 'cash',
          vehicleType: 'standard',
          isScheduled: false,
        }),
      });
      const data = await res.json().catch(() => ({}));
      const created = data.data?.ride;
      setActiveRide(created || ride);
    } catch {
      setActiveRide(ride);
    }
    router.push('/app/offers');
  };

  return (
    <main className="rm-app">
      <RideMap pickup={pickup || 'Origen'} dropoff={destination || 'Destino'} eta="6 min" mode="idle" />
      <header className="rm-app__top">
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--rm-border)] bg-[color-mix(in_srgb,var(--rm-bg)_70%,transparent)] px-2 py-1.5 backdrop-blur-md">
          <span className="rm-mark">
            <IconLightning size={18} />
          </span>
          <span className="pr-2 text-sm font-bold tracking-tight">RideMe</span>
        </div>
      </header>

      <form className="rm-app__sheet rm-sheet-enter" onSubmit={ask}>
        <div className="rm-app__handle" />
        <h1 className="mb-3 text-[22px] font-bold tracking-tight">¿A dónde vas?</h1>

        <div className="mb-2 rm-field">
          <IconDot size={16} className="text-[var(--rm-text-3)]" />
          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Punto de recojo"
            aria-label="Origen"
          />
        </div>
        <div className="mb-3 rm-field">
          <IconPin size={18} className="rm-map__pin" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destino en México"
            aria-label="Destino"
            autoComplete="off"
          />
        </div>

        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {SHORTCUTS.map((place) => (
            <button
              key={place}
              type="button"
              className={`rm-chip rm-pressable ${destination === place ? 'is-on' : ''}`}
              onClick={() => setDestination(place)}
            >
              {place}
            </button>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between rounded-[18px] border border-[var(--rm-border)] bg-[var(--rm-surface-2)] px-3 py-3">
          <span className="text-sm text-[var(--rm-text-3)]">Tu precio</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rm-pressable h-11 w-11 rounded-full border border-[var(--rm-border)] text-lg"
              onClick={() => setPrice((p) => Math.max(40, p - 5))}
              aria-label="Bajar precio"
            >
              −
            </button>
            <div className="rm-price min-w-[72px] text-center text-[28px]">${price}</div>
            <button
              type="button"
              className="rm-pressable h-11 w-11 rounded-full border border-[var(--rm-border)] text-lg"
              onClick={() => setPrice((p) => Math.min(800, p + 5))}
              aria-label="Subir precio"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs text-[var(--rm-text-3)]">
          <IconCash size={14} className="text-[var(--rm-accent)]" />
          Efectivo · Guadalajara
        </div>

        <button type="submit" className="rm-btn rm-btn--primary rm-btn--block rm-btn--lg" disabled={busy || !destination.trim()}>
          {busy ? 'Publicando…' : 'Pedir RideMe'}
        </button>
      </form>
      <AppNav />
    </main>
  );
}
