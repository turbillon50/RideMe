'use client';

import { IconPin } from '@/components/rm-icons';

/** Dark map chrome + mint route — collage language, works without Mapbox. */
export function RideMap({
  pickup = 'Origen',
  dropoff = 'Destino',
  eta = '3 min',
}: {
  pickup?: string;
  dropoff?: string;
  eta?: string;
}) {
  return (
    <div className="rm-app__map" aria-hidden>
      <div className="rm-app__streets" />
      <svg className="rm-app__route" viewBox="0 0 390 640" preserveAspectRatio="xMidYMid slice">
        <path
          d="M64 560 C 90 460, 70 400, 140 360 S 250 300, 220 220 S 280 140, 310 72"
          className="rm-map__route"
          stroke="var(--rm-accent)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="64" cy="560" r="9" fill="var(--rm-accent)" />
        <circle cx="310" cy="72" r="11" fill="var(--rm-text)" stroke="var(--rm-accent)" strokeWidth="3" />
      </svg>
      <div className="absolute left-4 top-[42%] max-w-[200px] rounded-2xl border border-[var(--rm-border)] bg-[color-mix(in_srgb,var(--rm-bg)_78%,transparent)] px-3 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-[var(--rm-text-2)]">
          <IconPin size={14} className="rm-map__pin" />
          <span className="truncate">{pickup}</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-[var(--rm-text-3)]">
          <IconPin size={14} />
          <span className="truncate">{dropoff}</span>
        </div>
        <div className="mt-1 font-mono text-[11px] font-semibold text-[var(--rm-accent)]">{eta}</div>
      </div>
    </div>
  );
}
