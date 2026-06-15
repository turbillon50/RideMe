"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapView } from "@/components/maps/MapView";
import { useTripStore } from "@/store/tripStore";
import { useGeolocation } from "@/hooks/useGeolocation";
import { BottomNav } from "@/components/layout/BottomNav";
import { useI18n } from "@/lib/i18n";

const C = { bg: '#0a0814', surface: '#0d0b1a', surface2: '#12102a',
  border: 'rgba(124,58,237,0.18)', violet: '#7c3aed', cyan: '#22d3ee',
  gold: '#fbbf24', green: '#10b981', text: '#f8f7ff', muted: '#9891c4' };

const STATUS_LABEL: Record<string, string> = {
  accepted: '✓ Chofer confirmado – en camino a ti',
  driver_en_route: '🚗 Tu chofer está en camino',
  arrived: '📍 Tu chofer llegó — ¿estás en el auto?',
  in_progress: '🏁 En camino a tu destino',
  completed: '✅ ¡Llegaste!',
};
const STATUS_COLOR: Record<string, string> = {
  accepted: '#7c3aed', driver_en_route: '#22d3ee',
  arrived: '#fbbf24', in_progress: '#10b981', completed: '#10b981',
};

function StarRow({ value, onRate }: { value: number; onRate: (n: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onRate(n)} style={{ fontSize: 36, background: 'none', border: 'none', cursor: 'pointer', filter: n <= value ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</button>
      ))}
    </div>
  );
}

export default function TripTrackingPage() {
  const router = useRouter();
  const { activeRide, setActiveRide } = useTripStore();
  const { location } = useGeolocation({ watch: true });
  const { t } = useI18n();
  const [ride, setRide] = useState<any>(activeRide);
  const [rating, setRating] = useState(5);
  const [ratingSent, setRatingSent] = useState(false);

  const center = location ? { lat: location.latitude, lng: location.longitude } : { lat: 19.4326, lng: -99.1332 };

  const poll = useCallback(async () => {
    if (!activeRide?.id) return;
    try {
      const res = await fetch(`/api/rides/${activeRide.id}`);
      const data = await res.json();
      if (data.ok) { setRide(data.data); setActiveRide(data.data); }
    } catch {}
  }, [activeRide?.id]);

  useEffect(() => {
    if (!activeRide?.id) { router.push('/app'); return; }
    poll();
    const id = setInterval(poll, 8000);
    return () => clearInterval(id);
  }, [activeRide?.id, poll]);

  const handleCancel = async () => {
    if (!ride?.id) return;
    await fetch(`/api/rides/${ride.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'cancel' }) });
    setActiveRide(null); router.push('/app');
  };

  const handleRate = async () => {
    if (!ride?.id) return;
    await fetch(`/api/rides/${ride.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'rate', rating }) });
    setRatingSent(true);
    setTimeout(() => { setActiveRide(null); router.push('/app'); }, 2000);
  };

  if (!ride) return <div style={{ minHeight: '100vh', background: C.bg }} />;

  const status = ride.status || 'accepted';
  const isCompleted = status === 'completed';
  const canCancel = ['searching','accepted'].includes(status);
  const driverLoc = ride.driver_lat ? { lat: Number(ride.driver_lat), lng: Number(ride.driver_lng) } : undefined;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Map */}
      <div style={{ height: '45vh', position: 'relative' }}>
        <MapView center={center} userLocation={center} driverLocation={driverLoc}
          origin={center} destination={ride.destination_latitude ? { lat: Number(ride.destination_latitude), lng: Number(ride.destination_longitude) } : undefined}
          className="w-full h-full" />
      </div>

      {/* Status bar */}
      <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[status] ?? C.violet, flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: STATUS_COLOR[status] ?? C.text }}>{STATUS_LABEL[status] ?? status}</span>
      </div>

      {/* Driver card */}
      {ride.driver_name && (
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {ride.driver_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{ride.driver_name}</p>
              <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>
                {ride.make} {ride.model} · {ride.color} · <span style={{ color: C.cyan, fontFamily: 'JetBrains Mono, monospace' }}>{ride.plate_number}</span>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: C.gold, margin: 0 }}>★ {Number(ride.rating_average || 5).toFixed(1)}</p>
              <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>{ride.total_trips ?? 0} viajes</p>
            </div>
          </div>
          {ride.driver_phone && (
            <a href={`tel:${ride.driver_phone}`} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '10px 14px', borderRadius: 10, background: C.surface2, border: `1px solid ${C.border}`, color: C.cyan, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.49 2 2 0 0 1 3.59 1.31h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.29 6.29l.77-.84a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Llamar al chofer
            </a>
          )}
        </div>
      )}

      {/* Ride info */}
      <div style={{ padding: '16px 20px', flex: 1 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: C.muted }}>Precio acordado</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.violet, fontFamily: 'JetBrains Mono, monospace' }}>${ride.proposed_price} MXN</span>
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>
            <p style={{ margin: '0 0 4px' }}>📍 {ride.origin_address}</p>
            <p style={{ margin: 0 }}>🏁 {ride.destination_address}</p>
          </div>
        </div>

        {/* Rating modal */}
        <AnimatePresence>
          {isCompleted && !ratingSent && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: C.surface, border: `2px solid ${C.gold}33`, borderRadius: 14, padding: '20px 16px', marginBottom: 14, textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>{t('rate_driver')}</p>
              <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px' }}>{ride.driver_name}</p>
              <StarRow value={rating} onRate={setRating} />
              <button onClick={handleRate} style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                {t('send_rating')}
              </button>
            </motion.div>
          )}
          {ratingSent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', color: C.green, fontSize: 16, fontWeight: 700 }}>
              ✓ ¡Gracias por tu calificación!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón de boarding cuando el chofer llegó */}
        {status === 'arrived' && (
          <motion.button initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }}
            onClick={async () => {
              await fetch(`/api/rides/${ride?.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action: 'start' }) });
            }}
            style={{ width:'100%', padding:'15px 0', borderRadius:12, border:'none', background:`linear-gradient(135deg, #fbbf24, #22d3ee)`, color:'#fff', fontWeight:700, fontSize:16, cursor:'pointer', marginBottom:12 }}>
            🚗 Estoy en el auto — Iniciar viaje
          </motion.button>
        )}

        {/* Popup de pertenencias al completar */}
        {status === 'completed' && ride?.belongings_confirmed_at === null && !ratingSent && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            style={{ background:'rgba(251,191,36,0.1)', border:`1.5px solid #fbbf24`, borderRadius:14, padding:'16px', marginBottom:14, textAlign:'center' }}>
            <p style={{ fontSize:20, margin:'0 0 8px' }}>🎒</p>
            <p style={{ fontSize:15, fontWeight:700, color:'#fbbf24', margin:'0 0 6px' }}>¡No olvides tus pertenencias!</p>
            <p style={{ fontSize:12, color:'#9891c4', margin:'0 0 14px' }}>Revisa que no dejaste nada en el auto antes de salir</p>
            <button onClick={async () => {
              await fetch(`/api/rides/${ride?.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action: 'confirm_belongings' }) });
            }} style={{ width:'100%', padding:'11px 0', borderRadius:10, border:'none', background:'#fbbf24', color:'#03020a', fontWeight:700, cursor:'pointer' }}>
              ✓ Confirmado, ya revisé
            </button>
          </motion.div>
        )}

        {canCancel && !isCompleted && (
          <button onClick={handleCancel} style={{ width: '100%', padding: '13px 0', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#ef4444', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            {t('cancel_ride')}
          </button>
        )}
      </div>
      
        {/* Botón de emergencia */}
        <div style={{ textAlign:'center', marginTop:8 }}>
          <button onClick={() => window.open('tel:911')}
            style={{ background:'transparent', border:`1px solid rgba(239,68,68,0.3)`, color:'#ef4444',
            padding:'8px 20px', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer' }}>
            🆘 Emergencia — llamar al 911
          </button>
        </div>
      <BottomNav role="passenger" />
    </div>
  );
}
