'use client';

import { CSSProperties } from 'react';

interface LogoProps {
  size?: number;
  /**
   * 'mark'   = solo el símbolo (R + speed lines + pin)
   * 'lockup' = símbolo + texto "RideMe" al lado
   * 'stack'  = símbolo encima + texto "RideMe" abajo + tagline opcional
   */
  variant?: 'mark' | 'lockup' | 'stack';
  showTagline?: boolean;
  textColor?: string;
  className?: string;
  style?: CSSProperties;
  glow?: boolean;
}

/**
 * Logo de marca RideMe.
 * "R" estilizada en gradiente azul→cyan con líneas de velocidad
 * a la izquierda y un pin de localización integrado en la pierna
 * inferior derecha de la R.
 */
export function RideMeLogo({
  size = 48,
  variant = 'mark',
  showTagline = false,
  textColor,
  className = '',
  style,
  glow = false,
}: LogoProps) {
  const Mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={glow ? 'logo-breath' : ''}
    >
      <defs>
        <linearGradient id="rmGradMain" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#5BD0FF" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1A45BF" />
        </linearGradient>
        <linearGradient id="rmGradSpeed" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#5BD0FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00B4FF" />
        </linearGradient>
      </defs>

      {/* Speed lines (3 trazos horizontales decreciendo) */}
      <rect x="6"  y="35" width="22" height="6" rx="3" fill="url(#rmGradSpeed)" opacity="0.55"/>
      <rect x="2"  y="46" width="30" height="6" rx="3" fill="url(#rmGradSpeed)" opacity="0.85"/>
      <rect x="10" y="57" width="18" height="6" rx="3" fill="url(#rmGradSpeed)" opacity="0.40"/>

      {/* La "R" estilizada como un solo trazo grueso */}
      <path
        d="
          M 40 18
          L 40 82
          M 40 18
          L 64 18
          C 78 18, 82 32, 78 42
          C 76 48, 70 51, 64 51
          L 40 51
          M 60 51
          L 70 65
        "
        stroke="url(#rmGradMain)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Pin de localización integrado en la "pata" derecha de la R */}
      <g transform="translate(70 65)">
        <path
          d="M 0 -2 C -8 -2, -12 4, -12 10 C -12 18, 0 30, 0 30 C 0 30, 12 18, 12 10 C 12 4, 8 -2, 0 -2 Z"
          fill="url(#rmGradMain)"
        />
        <circle cx="0" cy="9" r="4" fill="#FFFFFF" />
      </g>
    </svg>
  );

  if (variant === 'mark') {
    return <span className={className} style={style}>{Mark}</span>;
  }

  const fontSize = size * 0.62;
  const tagSize = size * 0.18;

  if (variant === 'lockup') {
    return (
      <div
        className={`inline-flex items-center gap-3 ${className}`}
        style={style}
      >
        {Mark}
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontFamily: 'Inter',
            fontWeight: 800,
            fontSize,
            letterSpacing: '-0.03em',
            color: textColor || 'var(--brand-deep)',
          }}>
            Ride<span style={{ color: '#2563EB' }}>Me</span>
          </span>
          {showTagline && (
            <span style={{
              fontSize: tagSize,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: textColor || 'var(--text-secondary)',
              marginTop: 4,
            }}>
              Tu ride, tu destino.
            </span>
          )}
        </span>
      </div>
    );
  }

  // stack
  return (
    <div
      className={`inline-flex flex-col items-center gap-2 ${className}`}
      style={style}
    >
      {Mark}
      <span style={{
        fontFamily: 'Inter',
        fontWeight: 800,
        fontSize: size * 0.45,
        letterSpacing: '-0.03em',
        color: textColor || 'var(--brand-deep)',
      }}>
        Ride<span style={{ color: '#2563EB' }}>Me</span>
      </span>
      {showTagline && (
        <span style={{
          fontSize: tagSize,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: textColor || 'var(--text-secondary)',
        }}>
          Tu ride, tu destino.
        </span>
      )}
    </div>
  );
}
