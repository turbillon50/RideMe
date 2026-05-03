'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Bell, MapPin, Plus, RefreshCw, MessageCircle } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { StaticMapPreview } from '@/components/maps/StaticMapPreview';
import { useT } from '@/lib/i18n/LocaleProvider';

/**
 * Pantalla principal del pasajero — replicando el mockup de Luis:
 *  - Header (☰, título, 🔔)
 *  - Card de origen / destino
 *  - Mapa preview (SVG estático mientras no hay Google Maps)
 *  - Card "Sugerencia de precio" con rango
 *  - Botón "Buscar conductores"
 *  - Bottom nav (4 tabs)
 */
export default function PassengerHomePage() {
  const router = useRouter();
  const t = useT();
  const [origin, setOrigin] = useState(t.myLocation);
  const [destination, setDestination] = useState('');

  const fareLow = 120;
  const fareHigh = 145;

  const onSearchDrivers = () => {
    if (!destination.trim()) setDestination('Plaza Antara');
    router.push('/app/offers');
  };

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {/* ─── Header ─── */}
      <header className="px-4 pt-3 pb-3 flex items-center gap-3" style={{ background: 'var(--bg)' }}>
        <button
          aria-label="menú"
          className="w-10 h-10 rounded-full grid place-items-center"
          style={{ background: 'var(--surface)', color: 'var(--brand-deep)', boxShadow: 'var(--shadow-card)' }}
        >
          <Menu size={20}/>
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>RideMe</div>
          <div className="text-base font-black truncate" style={{ color: 'var(--brand-deep)' }}>
            {t.whereTo}
          </div>
        </div>
        <button
          aria-label="notificaciones"
          className="w-10 h-10 rounded-full grid place-items-center relative"
          style={{ background: 'var(--surface)', color: 'var(--brand)', boxShadow: 'var(--shadow-card)' }}
        >
          <Bell size={18}/>
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: 'var(--brand)' }}
          />
        </button>
      </header>

      {/* ─── Cuerpo scrollable ─── */}
      <main className="flex-1 px-4 pb-24 flex flex-col gap-3" style={{ overflowY: 'auto' }}>
        {/* Origen + destino card */}
        <section
          className="rounded-2xl p-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
        >
          {/* Row Origen */}
          <div className="flex items-center gap-3 px-2 py-2.5">
            <span
              className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0"
              style={{ background: 'rgba(37,99,235,0.10)', color: 'var(--brand)' }}
            >
              <MapPin size={16}/>
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t.origin}
              </div>
              <input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder={t.myLocation}
                className="w-full bg-transparent outline-none text-base font-semibold"
                style={{ color: 'var(--brand-deep)' }}
              />
            </div>
            <button
              aria-label="recenter"
              className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0"
              style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}
            >
              <RefreshCw size={14}/>
            </button>
          </div>

          <div className="ml-6 my-1 h-3 w-px" style={{ background: 'var(--border-strong)' }} />

          {/* Row Destino */}
          <div className="flex items-center gap-3 px-2 py-2.5">
            <span
              className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0"
              style={{ background: 'var(--brand-deep)', color: '#fff' }}
            >
              <MapPin size={16}/>
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t.destination}
              </div>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={t.whereTo}
                className="w-full bg-transparent outline-none text-base font-semibold"
                style={{ color: 'var(--brand-deep)' }}
              />
            </div>
            <button
              aria-label="agregar destino"
              className="w-8 h-8 rounded-full grid place-items-center text-white flex-shrink-0"
              style={{ background: 'var(--brand)', boxShadow: 'var(--shadow-brand)' }}
            >
              <Plus size={16}/>
            </button>
          </div>
        </section>

        {/* Mapa preview (SVG estático) */}
        <StaticMapPreview height={180} />

        {/* Card de sugerencia de precio */}
        <section
          className="rounded-2xl p-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {t.priceSuggestion}
              </div>
              <div
                className="font-mono font-black mt-1"
                style={{ color: 'var(--brand-deep)', fontSize: 'clamp(22px, 6.4vw, 28px)', letterSpacing: '-0.02em' }}
              >
                ${fareLow} – ${fareHigh}{' '}
                <span className="text-sm font-bold align-middle" style={{ color: 'var(--text-muted)' }}>MXN</span>
              </div>
              <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {t.estimatedFare}
              </div>
            </div>
            <button
              type="button"
              className="w-9 h-9 rounded-full grid place-items-center flex-shrink-0"
              style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}
              aria-label="ajustar precio"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <button
            onClick={onSearchDrivers}
            className="mt-4 w-full py-3.5 rounded-full text-white font-bold tracking-tight transition-transform active:scale-[0.99]"
            style={{ background: 'var(--brand)', boxShadow: 'var(--shadow-brand)' }}
          >
            {t.searchDrivers}
          </button>
        </section>

        {/* Hint negociación */}
        <div
          className="flex items-center justify-center gap-2 rounded-full py-2 px-4 mt-1 text-xs font-semibold"
          style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}
        >
          <MessageCircle size={14} style={{ color: 'var(--brand)' }}/>
          {t.negotiateHint}
        </div>
      </main>

      <BottomNav role="passenger"/>
    </div>
  );
}
