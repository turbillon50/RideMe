'use client';

import { AppNav } from '@/components/layout/AppNav';
import { IconCash, IconLightning, IconWallet } from '@/components/rm-icons';

export default function WalletPage() {
  return (
    <main className="rm-app" style={{ overflow: 'auto' }}>
      <div className="rm-list">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rm-accent)]">Pago</p>
        <h1>Tu método</h1>

        <div className="mb-4 rounded-[18px] border border-[var(--rm-accent)] bg-[var(--rm-accent-muted)] p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--rm-accent)] text-[var(--rm-cta-fg)]">
              <IconCash size={22} />
            </span>
            <div>
              <p className="font-semibold">Efectivo</p>
              <p className="text-xs text-[var(--rm-text-3)]">Seleccionado · sin comisión extra</p>
            </div>
          </div>
          <p className="text-sm text-[var(--rm-text-2)]">Pagas al chofer al terminar el viaje. El precio que propones es el que se cobra.</p>
        </div>

        <div className="rounded-[18px] border border-[var(--rm-border)] bg-[var(--rm-surface)] p-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--rm-accent)]">
            <IconWallet size={18} />
            <span className="text-sm font-semibold">Más adelante</span>
          </div>
          <p className="text-sm text-[var(--rm-text-3)]">Tarjeta y Mercado Pago llegan en la siguiente versión. Por ahora RideMe es efectivo en toda la República.</p>
          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--rm-accent-muted)] px-3 py-1 text-xs font-bold text-[var(--rm-accent)]">
            <IconLightning size={12} />
            Tú propones el precio
          </div>
        </div>
      </div>
      <AppNav />
    </main>
  );
}
