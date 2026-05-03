'use client';

import { CSSProperties } from 'react';

type RoleVariant = 'passenger' | 'driver' | 'admin';

interface RoleIconProps {
  variant: RoleVariant;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Tres iconos de rol — squircle con la "R" de RideMe + glifo
 * sectorial (pin / volante / engrane), según diseño de marca.
 */
export function RoleIcon({ variant, size = 64, className = '', style }: RoleIconProps) {
  const tile =
    variant === 'driver'
      ? 'linear-gradient(160deg, #0D1B3D 0%, #142454 60%, #0A1A33 100%)'
      : variant === 'admin'
      ? 'linear-gradient(160deg, #2563EB 0%, #00B4FF 100%)'
      : 'linear-gradient(160deg, #FFFFFF 0%, #F2F6FB 100%)';

  const isLight = variant === 'passenger';
  const stroke = isLight ? 'url(#riGradStrokeLight)' : '#FFFFFF';
  const speedColor = isLight ? '#2563EB' : '#FFFFFF';
  const speedOpacity = isLight ? '0.85' : '0.95';
  const innerGlyphColor = isLight ? '#2563EB' : '#5BD0FF';

  const id = `ri-${variant}`;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: tile,
        boxShadow: isLight
          ? '0 4px 16px rgba(13,27,61,0.10), inset 0 1px 0 rgba(255,255,255,0.7)'
          : '0 6px 22px rgba(13,27,61,0.30), inset 0 1px 0 rgba(255,255,255,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-strokeLight`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5BD0FF" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="riGradStrokeLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5BD0FF" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        {/* Speed lines */}
        <rect x="6"  y="35" width="20" height="5" rx="2.5" fill={speedColor} opacity={Number(speedOpacity) * 0.55}/>
        <rect x="2"  y="46" width="28" height="5" rx="2.5" fill={speedColor} opacity={speedOpacity}/>
        <rect x="10" y="57" width="16" height="5" rx="2.5" fill={speedColor} opacity={Number(speedOpacity) * 0.45}/>

        {/* "R" simplificada como un trazo */}
        <path
          d="
            M 40 18
            L 40 82
            M 40 18
            L 62 18
            C 76 18, 80 32, 76 42
            C 74 48, 68 51, 62 51
            L 40 51
            M 58 51
            L 68 65
          "
          stroke={stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Glifo sectorial — distinto por rol */}
        {variant === 'passenger' && (
          <g transform="translate(70 67)">
            {/* Pin */}
            <path
              d="M 0 -3 C -8 -3, -12 3, -12 9 C -12 18, 0 28, 0 28 C 0 28, 12 18, 12 9 C 12 3, 8 -3, 0 -3 Z"
              fill={innerGlyphColor}
            />
            <circle cx="0" cy="8" r="3.5" fill="#FFFFFF" />
          </g>
        )}

        {variant === 'driver' && (
          <g transform="translate(68 70)">
            {/* Volante */}
            <circle cx="0" cy="0" r="13" fill="none" stroke={innerGlyphColor} strokeWidth="3.5" />
            <circle cx="0" cy="0" r="3" fill={innerGlyphColor} />
            <line x1="0" y1="-3" x2="0" y2="-10" stroke={innerGlyphColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="-3" y1="2" x2="-10" y2="6" stroke={innerGlyphColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="3" y1="2" x2="10" y2="6" stroke={innerGlyphColor} strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {variant === 'admin' && (
          <g transform="translate(68 72)">
            {/* Engrane */}
            <g fill={innerGlyphColor}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <rect
                  key={deg}
                  x="-2"
                  y="-12"
                  width="4"
                  height="6"
                  rx="1"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
            <circle cx="0" cy="0" r="7" fill="none" stroke={innerGlyphColor} strokeWidth="3" />
          </g>
        )}
      </svg>
    </div>
  );
}
