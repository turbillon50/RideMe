'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { AppNav } from '@/components/layout/AppNav';
import { IconChevronRight, IconLightning, IconShield, IconTrips, IconWallet } from '@/components/rm-icons';

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const name = user?.fullName || 'Invitado RideMe';
  const email = user?.primaryEmailAddress?.emailAddress || 'Sin sesión — demo 390';
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const rows = [
    { icon: IconTrips, label: 'Viajes', href: '/app/history' },
    { icon: IconWallet, label: 'Pago · Efectivo', href: '/app' },
    { icon: IconShield, label: 'Seguridad', href: '/app' },
  ];

  return (
    <main className="rm-app" style={{ overflow: 'auto' }}>
      <div className="rm-list">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rm-accent)]">Cuenta</p>
        <h1>Tú</h1>
        <div className="mb-4 flex items-center gap-3 rounded-[18px] border border-[var(--rm-border)] bg-[var(--rm-surface)] p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--rm-accent)] text-lg font-bold text-[var(--rm-cta-fg)]">
            {user ? initials : <IconLightning size={22} />}
          </div>
          <div className="min-w-0">
            <p className="font-semibold">{name}</p>
            <p className="truncate text-xs text-[var(--rm-text-3)]">{email}</p>
          </div>
        </div>

        <div className="mb-4 overflow-hidden rounded-[18px] border border-[var(--rm-border)] bg-[var(--rm-surface)]">
          {rows.map((row) => (
            <button
              key={row.label}
              type="button"
              className="rm-pressable flex w-full items-center gap-3 border-b border-[var(--rm-border)] px-4 py-3.5 last:border-0"
              onClick={() => router.push(row.href)}
            >
              <row.icon size={18} className="text-[var(--rm-accent)]" />
              <span className="flex-1 text-left text-sm font-medium">{row.label}</span>
              <IconChevronRight size={16} className="text-[var(--rm-text-3)]" />
            </button>
          ))}
        </div>

        {user ? (
          <button type="button" className="rm-btn rm-btn--secondary rm-btn--block" onClick={() => signOut(() => router.push('/'))}>
            Cerrar sesión
          </button>
        ) : (
          <button type="button" className="rm-btn rm-btn--primary rm-btn--block" onClick={() => router.push('/sign-in?redirect_url=/app/profile')}>
            Iniciar sesión
          </button>
        )}
      </div>
      <AppNav />
    </main>
  );
}
