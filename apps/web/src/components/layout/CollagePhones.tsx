'use client';

import { IconCar, IconLightning, IconPin, IconStar } from '@/components/rm-icons';

function Phone({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rm-phone ${className}`}>
      <div className="rm-phone__notch" />
      {children}
    </div>
  );
}

function MiniMap() {
  return (
    <div className="rm-phone__map">
      <svg viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <path
          d="M36 250 C 50 200, 40 170, 78 150 S 130 128, 118 92 S 145 58, 162 28"
          stroke="var(--rm-accent)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="36" cy="250" r="6" fill="var(--rm-accent)" />
        <circle cx="162" cy="28" r="7" fill="#fff" stroke="var(--rm-accent)" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function CollagePhones() {
  return (
    <div className="rm-collage" aria-hidden>
      <Phone className="rm-phone--a">
        <MiniMap />
        <div className="rm-phone__sheet">
          <div className="rm-phone__handle" />
          <p className="rm-phone__h">¿A dónde vas?</p>
          <div className="rm-phone__field">Mi ubicación</div>
          <div className="rm-phone__field rm-phone__field--on">
            <IconPin size={12} /> Aeropuerto GDL
          </div>
          <div className="rm-phone__row">
            <span>Tu precio</span>
            <span className="rm-price">$95</span>
          </div>
          <div className="rm-phone__cta">Pedir RideMe</div>
        </div>
      </Phone>

      <Phone className="rm-phone--b">
        <MiniMap />
        <div className="rm-phone__sheet">
          <div className="rm-phone__handle" />
          <p className="rm-phone__kicker">3 ofertas</p>
          <p className="rm-phone__h">Elige RideMe</p>
          {[
            ['JD', 'Juan D.', '4.97', '$95'],
            ['MS', 'María S.', '4.99', '$88'],
          ].map((o) => (
            <div key={o[0]} className="rm-phone__offer">
              <span className="rm-phone__av">{o[0]}</span>
              <span className="min-w-0 flex-1 truncate text-[11px] font-semibold">
                {o[1]} <IconStar size={9} className="inline text-[var(--rm-accent)]" /> {o[2]}
              </span>
              <span className="rm-price text-[12px]">{o[3]}</span>
            </div>
          ))}
        </div>
      </Phone>

      <Phone className="rm-phone--c">
        <MiniMap />
        <div className="absolute left-3 top-8 flex items-center gap-1 rounded-xl bg-[var(--rm-accent)] px-1.5 py-1 text-[var(--rm-cta-fg)]">
          <IconLightning size={10} />
        </div>
        <div className="rm-phone__sheet">
          <div className="rm-phone__handle" />
          <p className="rm-phone__kicker">En camino</p>
          <p className="rm-phone__h">Llega en 3 min</p>
          <div className="rm-phone__offer">
            <span className="rm-phone__av">JD</span>
            <span className="text-[11px] font-semibold">Juan D. · Corolla</span>
            <IconCar size={12} className="text-[var(--rm-accent)]" />
          </div>
        </div>
      </Phone>
    </div>
  );
}
