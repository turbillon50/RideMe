'use client';

interface Driver {
  id: string;
  latitude: number;
  longitude: number;
  heading?: number;
}

interface MapViewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  drivers?: Driver[];
  userLocation?: { lat: number; lng: number };
  driverLocation?: { lat: number; lng: number };
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
const STYLE = 'mapbox/dark-v11';

function f(n: number): string {
  return n.toFixed(5);
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
}: MapViewProps) {
  const focus = userLocation || origin || center;

  const pins: string[] = [];
  // Driver pins (teal)
  drivers.slice(0, 14).forEach((d) => {
    pins.push(`pin-s+00D4AA(${f(d.longitude)},${f(d.latitude)})`);
  });
  if (driverLocation) pins.push(`pin-l+00D4AA(${f(driverLocation.lng)},${f(driverLocation.lat)})`);
  if (origin) pins.push(`pin-l+6C63FF(${f(origin.lng)},${f(origin.lat)})`);
  if (destination) pins.push(`pin-l+00D4AA(${f(destination.lng)},${f(destination.lat)})`);
  // User pin (violet) — last so it sits on top
  pins.push(`pin-l+6C63FF(${f(focus.lng)},${f(focus.lat)})`);

  const overlay = pins.join(',');
  const center2 =
    origin && destination
      ? 'auto'
      : `${f(focus.lng)},${f(focus.lat)},${zoom},0`;
  const size = '600x500@2x';
  const src = `https://api.mapbox.com/styles/v1/${STYLE}/static/${overlay}/${center2}/${size}?access_token=${TOKEN}&logo=false&attribution=false`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ height: '100%', minHeight: '100%', background: '#0A0A0F' }}
    >
      {TOKEN ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Mapa"
          className="h-full w-full"
          style={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
          Mapa no disponible
        </div>
      )}
      {/* subtle bottom fade to blend into the sheet */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{ height: '64px', background: 'linear-gradient(to top, var(--bg), transparent)' }}
      />
    </div>
  );
}
