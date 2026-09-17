'use client';

import { IconCar } from '@/components/rm-icons';

/** Dark city chrome + mint route — collage language, no Mapbox required. */
export function RideMap({
  pickup = 'Origen',
  dropoff = 'Destino',
  eta,
  mode = 'idle',
}: {
  pickup?: string;
  dropoff?: string;
  eta?: string;
  mode?: 'idle' | 'offers' | 'trip';
}) {
  return (
    <div className="rm-app__map" aria-hidden>
      <div className="rm-app__streets" />
      <svg className="rm-app__route" viewBox="0 0 390 640" preserveAspectRatio="xMidYMid slice">
        <g opacity="0.28" fill="#1c1c26">
          <rect x="28" y="48" width="92" height="70" rx="10" />
          <rect x="140" y="36" width="118" height="86" rx="10" />
          <rect x="278" y="58" width="80" height="64" rx="10" />
          <rect x="18" y="180" width="108" height="96" rx="10" />
          <rect x="148" y="168" width="86" height="78" rx="10" />
          <rect x="252" y="196" width="112" height="90" rx="10" />
          <rect x="40" y="320" width="96" height="72" rx="10" />
          <rect x="168" y="308" width="140" height="88" rx="10" />
          <rect x="20" y="430" width="124" height="80" rx="10" />
          <rect x="210" y="428" width="150" height="74" rx="10" />
        </g>
        <g stroke="rgba(255,255,255,0.07)" strokeWidth="10" fill="none">
          <path d="M0 220 H390" />
          <path d="M0 360 H390" />
          <path d="M0 500 H390" />
          <path d="M96 0 V640" />
          <path d="M210 0 V640" />
          <path d="M310 0 V640" />
        </g>
        <path
          d="M72 548 C 96 460, 78 402, 148 358 S 248 304, 228 228 S 276 148, 308 86"
          className="rm-map__route"
          stroke="var(--rm-accent)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="72" cy="548" r="11" fill="var(--rm-accent)" />
        <circle cx="72" cy="548" r="5" fill="var(--rm-cta-fg)" />
        <circle className="rm-map__pulse" cx="308" cy="86" r="18" fill="var(--rm-accent)" opacity="0.22" />
        <circle cx="308" cy="86" r="12" fill="var(--rm-text)" stroke="var(--rm-accent)" strokeWidth="3" />
        <text x="22" y="236" fill="rgba(255,255,255,0.28)" fontSize="11" fontFamily="Inter,system-ui">
          Centro
        </text>
        <text x="248" y="76" fill="rgba(255,255,255,0.28)" fontSize="11" fontFamily="Inter,system-ui">
          Aeropuerto
        </text>
      </svg>

      {mode === 'trip' && (
        <div className="rm-map__car" style={{ left: '42%', top: '46%' }}>
          <IconCar size={18} />
        </div>
      )}

      <div className="rm-map__chip">
        <span className="rm-map__chip-dot" />
        <span className="truncate">{pickup}</span>
        <span className="rm-map__chip-sep">→</span>
        <span className="truncate">{dropoff}</span>
      </div>

      {eta ? <div className="rm-map__eta">{eta}</div> : null}
    </div>
  );
}
