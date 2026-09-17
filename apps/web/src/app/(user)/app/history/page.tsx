'use client';

import { AppNav } from '@/components/layout/AppNav';
import { IconCar, IconPin, IconStar } from '@/components/rm-icons';
import { useRouter } from 'next/navigation';

const TRIPS = [
  { id: 't1', status: 'Completado', from: 'Centro, Guadalajara', to: 'Aeropuerto GDL', price: 95, when: 'Hoy · 08:14', rating: 5 },
  { id: 't2', status: 'Completado', from: 'Andares', to: 'Centro Histórico', price: 72, when: 'Ayer · 19:02', rating: 5 },
  { id: 't3', status: 'Cancelado', from: 'Plaza del Sol', to: 'Zapopan', price: 80, when: '12 sep · 11:40', rating: 0 },
];

export default function HistoryPage() {
  const router = useRouter();
  return (
    <main className="rm-app" style={{ overflow: 'auto' }}>
      <div className="rm-list">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rm-accent)]">Tu actividad</p>
        <h1>Viajes</h1>
        <div className="flex flex-col gap-2">
          {TRIPS.map((t) => (
            <article
              key={t.id}
              className="rm-offer rm-pressable"
              onClick={() => t.status === 'Completado' && router.push('/app/trip')}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--rm-accent-muted)] text-[var(--rm-accent)]">
                <IconCar size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--rm-accent)]">{t.status}</p>
                <p className="truncate text-sm font-semibold">{t.to}</p>
                <p className="flex items-center gap-1 truncate text-xs text-[var(--rm-text-3)]">
                  <IconPin size={11} /> {t.from} · {t.when}
                </p>
              </div>
              <div className="text-right">
                <div className="rm-price text-base">${t.price}</div>
                {t.rating > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-[var(--rm-accent)]">
                    <IconStar size={10} /> {t.rating}.0
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
        <button type="button" className="rm-btn rm-btn--primary rm-btn--block mt-4" onClick={() => router.push('/app')}>
          Pedir RideMe
        </button>
      </div>
      <AppNav />
    </main>
  );
}
