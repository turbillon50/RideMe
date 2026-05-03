'use client';

import { CSSProperties } from 'react';

interface StaticMapPreviewProps {
  height?: number | string;
  showCar?: boolean;
  showRoute?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Mapa preview estilizado en SVG — placeholder estático bonito mientras
 * no hay API key de Google Maps. Replica la estética del mockup.
 */
export function StaticMapPreview({
  height = 200,
  showCar = true,
  showRoute = true,
  className = '',
  style,
}: StaticMapPreviewProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height,
        position: 'relative',
        overflow: 'hidden',
        background: '#E8EFF8',
        borderRadius: 16,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 390 220"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        style={{ display: 'block' }}
        aria-hidden
      >
        {/* Base */}
        <rect width="390" height="220" fill="#E8EFF8" />

        {/* Parques (verde claro) */}
        <path d="M30 30 L130 20 L160 90 L70 110 Z" fill="#D9EEDC" opacity="0.85"/>
        <path d="M260 150 L350 140 L360 200 L290 215 L255 180 Z" fill="#D9EEDC" opacity="0.85"/>

        {/* Río (azul claro diagonal) */}
        <path d="M-20 170 L420 110 L420 150 L-20 200 Z" fill="#CFE3F4" opacity="0.7"/>

        {/* Edificios (rectángulos rounded) */}
        {[
          [10,80,80,40],[100,75,70,55],[180,70,80,50],[270,60,90,55],
          [10,140,75,55],[95,150,80,45],[180,135,90,55],[280,125,100,45],
          [200,15,80,50],[295,15,75,40],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#F4F8FD" />
        ))}

        {/* Calles (anchas blancas) */}
        <g stroke="#FFFFFF" strokeWidth="14" fill="none" strokeLinecap="round">
          <path d="M-10 130 L420 130" />
          <path d="M-10 75 L420 75" opacity="0.8"/>
          <path d="M180 -10 L180 230" />
          <path d="M85 -10 L85 230" opacity="0.8"/>
          <path d="M285 -10 L285 230" />
        </g>

        {/* Centerlines punteadas (azul claro) */}
        <g stroke="#DCE5F1" strokeWidth="1.4" strokeDasharray="6 8" fill="none">
          <path d="M-10 130 L420 130" />
          <path d="M180 -10 L180 230" />
        </g>

        {/* Diagonal */}
        <path d="M-10 30 L420 200" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" fill="none" />

        {showRoute && (
          <>
            {/* Ruta principal */}
            <path
              d="M70 180 C 100 140, 160 130, 200 100 S 280 60, 320 40"
              stroke="#2563EB"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Pin de origen (azul) */}
            <g transform="translate(70 180)">
              <circle r="9" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" />
              <circle r="3.5" fill="#2563EB" />
            </g>
            {/* Pin de destino */}
            <g transform="translate(320 40)">
              <path
                d="M0 -16 C-9 -16, -13 -9, -13 -4 C-13 4, 0 14, 0 14 C0 14, 13 4, 13 -4 C13 -9, 9 -16, 0 -16 Z"
                fill="#2563EB"
              />
              <circle cy="-5" r="4" fill="#FFFFFF" />
            </g>
          </>
        )}

        {showCar && (
          <g transform="translate(180 110) rotate(-25)">
            {/* Auto top-down minimalista */}
            <rect x="-16" y="-9" width="32" height="18" rx="4" fill="#FFFFFF" stroke="#0D1B3D" strokeWidth="1.5"/>
            <rect x="-12" y="-6" width="24" height="6" rx="2" fill="#5BD0FF" opacity="0.7"/>
            <rect x="-12" y="2"  width="24" height="4" rx="1" fill="#0D1B3D" opacity="0.2"/>
          </g>
        )}
      </svg>

      {/* Compass / locate button */}
      <button
        type="button"
        className="absolute right-3 top-3 w-9 h-9 rounded-full grid place-items-center shadow-md transition-transform hover:scale-105"
        style={{ background: '#fff', border: '1px solid var(--border)', color: '#2563EB' }}
        aria-label="Recenter"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
