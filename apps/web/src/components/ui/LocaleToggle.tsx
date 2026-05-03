'use client';

import { useLocale } from '@/lib/i18n/LocaleProvider';

export function LocaleToggle({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const { locale, setLocale } = useLocale();
  const padX = size === 'sm' ? 8 : 12;
  const padY = size === 'sm' ? 4 : 6;
  const fontSize = size === 'sm' ? 11 : 12;
  return (
    <div
      className="inline-flex p-0.5 rounded-full"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
    >
      {(['es', 'en'] as const).map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            onClick={() => setLocale(l)}
            style={{
              padding: `${padY}px ${padX}px`,
              borderRadius: 999,
              fontSize,
              fontWeight: 700,
              letterSpacing: '0.04em',
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? 'var(--brand)' : 'var(--text-muted)',
              boxShadow: active ? '0 1px 2px rgba(13,27,61,0.04)' : 'none',
              transition: 'all 0.15s ease',
            }}
            aria-pressed={active}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
