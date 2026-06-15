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

  // Prioridad: GPS real > userLocation prop > center default
  const gpsLoc = location ? { lat: location.latitude, lng: location.longitude } : null;
  const focus = gpsLoc || userLocation || origin || center;

  const pins: string[] = [];
  drivers.slice(0, 10).forEach(d => pins.push(`pin-s+22d3ee(${f(d.longitude)},${f(d.latitude)})`));
  if (driverLocation) pins.push(`pin-l+22d3ee(${f(driverLocation.lng)},${f(driverLocation.lat)})`);
  if (origin) pins.push(`pin-l+7c3aed(${f(origin.lng)},${f(origin.lat)})`);
  if (destination) pins.push(`pin-l+22d3ee(${f(destination.lng)},${f(destination.lat)})`);
  pins.push(`pin-l+7c3aed(${f(focus.lng)},${f(focus.lat)})`);

  const overlay = pins.join(',');
  const centerStr = origin && destination ? 'auto' : `${f(focus.lng)},${f(focus.lat)},${zoom},0`;
  const src = TOKEN && !imgError
    ? `https://api.mapbox.com/styles/v1/${STYLE}/static/${overlay}/${centerStr}/600x500@2x?access_token=${TOKEN}&logo=false&attribution=false`
    : null;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: '#0a0814' }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="Mapa" onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.3)',fontSize:13 }}>
          Mapa no disponible
        </div>
      )}

      {/* Botón GPS */}
      {showGpsButton && (
        <button onClick={requestPermission}
          style={{ position:'absolute',bottom:80,right:14,width:40,height:40,borderRadius:10,
            background: gpsLoc ? 'rgba(34,211,238,0.9)' : 'rgba(10,8,20,0.85)',
            border:`1.5px solid ${gpsLoc ? '#22d3ee' : 'rgba(255,255,255,0.2)'}`,
            backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',
            cursor:'pointer',transition:'all 0.2s',boxShadow:'0 2px 12px rgba(0,0,0,0.4)' }}>
          {isLoading ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gpsLoc ? '#0a0814' : 'white'} strokeWidth="2"
              style={{ animation:'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
              <path d="M12 2 a10 10 0 0 1 10 10"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gpsLoc ? '#0a0814' : 'white'} strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>
            </svg>
          )}
        </button>
      )}

      {/* Error de GPS */}
      {error && hasPermission === false && (
        <div style={{ position:'absolute',top:10,left:10,right:10,background:'rgba(239,68,68,0.9)',
          backdropFilter:'blur(8px)',borderRadius:10,padding:'8px 12px',fontSize:12,color:'white',fontWeight:600 }}>
          📍 {error}
        </div>
      )}

      {/* Fade inferior */}
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:60,
        background:'linear-gradient(to top, #0a0814, transparent)',pointerEvents:'none' }} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
