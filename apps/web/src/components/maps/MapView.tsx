"use client";

import { useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';

interface Driver { id: string; latitude: number; longitude: number; }
interface MapViewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  drivers?: Driver[];
  userLocation?: { lat: number; lng: number };
  driverLocation?: { lat: number; lng: number };
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  className?: string;
  showGpsButton?: boolean;
}

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
const STYLE = 'mapbox/dark-v11';
const f = (n: number) => n.toFixed(5);

function DarkMap({ hasRoute }: { hasRoute?: boolean }) {
  return (
    <svg viewBox="0 0 1000 1100" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="1000" height="1100" fill="#0a0a0c" />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={`h${i}`} x="0" y={50 + i * 64} width="1000" height={i % 5 === 0 ? 10 : 5} fill={i % 5 === 0 ? '#24252e' : '#1a1b22'} />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={`v${i}`} x={40 + i * 80} y="0" width={i % 4 === 0 ? 10 : 5} height="1100" fill={i % 4 === 0 ? '#24252e' : '#1a1b22'} />
      ))}
      <rect x="120" y="200" width="200" height="150" rx="16" fill="#0d1814" />
      <rect x="620" y="540" width="240" height="170" rx="16" fill="#0d1814" />
      {hasRoute ? (
        <path d="M 420 720 Q 540 480 720 280" fill="none" stroke="#00e5a8" strokeWidth="8" strokeLinecap="round" />
      ) : null}
      <circle cx="420" cy="720" r="10" fill="#00e5a8" />
      {hasRoute ? <circle cx="720" cy="280" r="8" fill="#f3f4f6" /> : null}
    </svg>
  );
}

export function MapView({
  center = { lat: 19.4326, lng: -99.1332 },
  zoom = 14,
  drivers = [],
  userLocation,
  driverLocation,
  origin,
  destination,
  className = 'w-full h-full',
  showGpsButton = true,
}: MapViewProps) {
  const { location, requestPermission, isLoading, error, hasPermission } = useGeolocation({ watch: true });
  const [imgError, setImgError] = useState(false);

  const gpsLoc = location ? { lat: location.latitude, lng: location.longitude } : null;
  const focus = gpsLoc || userLocation || origin || center;

  const pins: string[] = [];
  drivers.slice(0, 10).forEach(d => pins.push(`pin-s+00e5a8(${f(d.longitude)},${f(d.latitude)})`));
  if (driverLocation) pins.push(`pin-l+00e5a8(${f(driverLocation.lng)},${f(driverLocation.lat)})`);
  if (origin) pins.push(`pin-l+f3f4f6(${f(origin.lng)},${f(origin.lat)})`);
  if (destination) pins.push(`pin-l+00e5a8(${f(destination.lng)},${f(destination.lat)})`);
  pins.push(`pin-l+00e5a8(${f(focus.lng)},${f(focus.lat)})`);

  const overlay = pins.join(',');
  const centerStr = origin && destination ? 'auto' : `${f(focus.lng)},${f(focus.lat)},${zoom},0`;
  const src = TOKEN && !imgError
    ? `https://api.mapbox.com/styles/v1/${STYLE}/static/${overlay}/${centerStr}/600x500@2x?access_token=${TOKEN}&logo=false&attribution=false`
    : null;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: '#0a0a0c' }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="Mapa" onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <DarkMap hasRoute={!!(origin && destination)} />
      )}

      {showGpsButton && (
        <button onClick={requestPermission} aria-label="Centrar mapa"
          className="absolute right-3 top-24 z-20 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--rm-sheet)]/90 ring-1 ring-[var(--rm-line)] backdrop-blur-md">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.6 3.1 20.4 20a.8.8 0 0 1-1.1 1L12 17.4 4.7 21a.8.8 0 0 1-1.1-1L11.4 3.1a.7.7 0 0 1 1.2 0Z" />
          </svg>
        </button>
      )}

      {error && hasPermission === false && (
        <div className="absolute left-3 right-3 top-3 rounded-xl bg-[var(--rm-danger)] px-3 py-2 text-xs font-semibold text-white">
          {error}
        </div>
      )}
    </div>
  );
}
