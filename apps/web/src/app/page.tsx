'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RideMeLogo } from '@/components/brand/Logo';
import { RoleIcon } from '@/components/brand/RoleIcon';
import { LocaleToggle } from '@/components/ui/LocaleToggle';
import { useT } from '@/lib/i18n/LocaleProvider';

/**
 * Home / Welcome — sensación de app nativa.
 * Sin scroll, viewport completo, layout estable, foco en role-select.
 */
export default function WelcomePage() {
  const t = useT();

  return (
    <div
      className="relative flex flex-col"
      style={{
        height: '100dvh',
        minHeight: '100dvh',
        background: 'var(--bg)',
        overflow: 'hidden',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Fondo: glow estático suave */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.20) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-[-200px] right-[-100px] w-[420px] h-[420px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,180,255,0.18) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Top bar mínima */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-3">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          {t.brand}
        </span>
        <LocaleToggle size="sm"/>
      </header>

      {/* Brand block */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-6 pb-2">
        <div className="logo-breath">
          <RideMeLogo variant="mark" size={104} />
        </div>
        <h1
          className="mt-5 font-black tracking-tight"
          style={{
            color: 'var(--brand-deep)',
            fontSize: 'clamp(36px, 9vw, 52px)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }}
        >
          Ride<span style={{ color: '#2563EB' }}>Me</span>
        </h1>
        <p
          className="mt-2 font-bold tracking-[0.22em] uppercase"
          style={{ color: 'var(--text-secondary)', fontSize: '11px' }}
        >
          {t.tagline}
        </p>
      </section>

      {/* Role selection — acceso directo */}
      <section className="relative z-10 flex-1 flex flex-col px-5 pt-5 pb-3 gap-3 overflow-hidden">
        <div
          className="text-xs font-semibold uppercase tracking-widest mb-1 text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          {t.chooseRole}
        </div>

        <RoleCard
          href="/app"
          variant="passenger"
          title={t.rolePassenger}
          subtitle={t.rolePassengerSub}
        />
        <RoleCard
          href="/driver"
          variant="driver"
          title={t.roleDriver}
          subtitle={t.roleDriverSub}
        />
        <RoleCard
          href="/driver/subscription"
          variant="admin"
          title={t.roleAdmin}
          subtitle={t.roleAdminSub}
        />
      </section>

      {/* Auth links discretos al pie */}
      <footer className="relative z-10 flex flex-col items-center gap-2 px-6 pb-3 pt-1">
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>{t.haveAccount}</span>
          <Link
            href="/login"
            className="font-bold"
            style={{ color: 'var(--brand)' }}
          >
            {t.signIn}
          </Link>
        </div>
        <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <Link href="/privacy" className="hover:opacity-100">{t.privacyPolicy}</Link>
          <span>·</span>
          <Link href="/terms" className="hover:opacity-100">{t.termsConditions}</Link>
        </div>
      </footer>
    </div>
  );
}

function RoleCard({
  href,
  variant,
  title,
  subtitle,
}: {
  href: string;
  variant: 'passenger' | 'driver' | 'admin';
  title: string;
  subtitle: string;
}) {
  const accent =
    variant === 'driver' ? 'var(--brand-deep)' : variant === 'admin' ? '#00B4FF' : 'var(--brand)';
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl px-4 py-3 transition-shadow"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <RoleIcon variant={variant} size={56} />
      <div className="flex-1 min-w-0">
        <div className="font-black text-lg" style={{ color: 'var(--brand-deep)' }}>
          {title}
        </div>
        <div className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </div>
      </div>
      <ArrowRight size={20} style={{ color: 'var(--brand)' }} />
    </Link>
  );
}
