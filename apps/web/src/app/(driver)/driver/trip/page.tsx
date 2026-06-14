"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapView } from "@/components/maps/MapView";
import { useDriverStore } from "@/store/driverStore";
import { useGeolocation } from "@/hooks/useGeolocation";

const C = { bg:'#0a0814',surface:'#0d0b1a',surface2:'#12102a',
  border:'rgba(124,58,237,0.18)',violet:'#7c3aed',cyan:'#22d3ee',
  gold:'#fbbf24',green:'#10b981',red:'#ef4444',text:'#f8f7ff',muted:'#9891c4' };

const STATUS_FLOW = ['accepted','arrived','in_progress','completed'];

export default function DriverTripPage() {
  const router = useRouter();
  const params = useSearchParams();
  const rideId = params.get('id');
  const { location } = useGeolocation({ watch: true });
  const [ride, setRide] = useState<any>(null);
  const [acting, setActing] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const poll = useCallback(async () => {
    if (!rideId) return;
    const res = await fetch(`/api/rides/${rideId}`);
    const d = await res.json();
    if (d.ok) setRide(d.data);
    if (d.data?.status === 'completed') {
      setTimeout(() => router.push('/driver'), 3000);
    }
  }, [rideId]);

  useEffect(() => {
    if (!rideId) { router.push('/driver'); return; }
    poll();
    const id = setInterval(poll, 8000);
    return () => clearInterval(id);
  }, [rideId, poll]);

  // Location update
  useEffect(() => {
    if (!location || !rideId) return;
    fetch('/api/driver/location', { method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ latitude: location.latitude, longitude: location.longitude }) });
  }, [location?.latitude, location?.longitude]);

  const action = async (act: string) => {
    if (!rideId) return;
    setActing(true);
    await fetch(`/api/rides/${rideId}`, { method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ action: act }) });
    await poll();
    setActing(false);
  };

  const center = location ? { lat: location.latitude, lng: location.longitude } : { lat: 19.4326, lng: -99.1332 };
  const status = ride?.status || 'accepted';
  const passengerOrigin = ride?.origin_latitude ? { lat: Number(ride.origin_latitude), lng: Number(ride.origin_longitude) } : undefined;
  const destination = ride?.destination_latitude ? { lat: Number(ride.destination_latitude), lng: Number(ride.destination_longitude) } : undefined;

  const mxn = (v: number) => `$${Number(v).toFixed(0)} MXN`;

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column' }}>
      {/* Map */}
      <div style={{ height:'40vh', position:'relative' }}>
        <MapView center={center} userLocation={center} origin={passengerOrigin} destination={destination} className="w-full h-full" />
      </div>

      <div style={{ flex:1, padding:'16px 16px 24px', display:'flex', flexDirection:'column', gap:12 }}>

        {/* Passenger info */}
        {ride && (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'14px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div>
                <p style={{ fontSize:16, fontWeight:700, color:C.text, margin:0 }}>{ride.passenger_name || 'Pasajero'}</p>
                <p style={{ fontSize:12, color:C.muted, margin:'2px 0 0' }}>{ride.passenger_phone || ''}</p>
              </div>
              <p style={{ fontSize:22, fontWeight:800, color:C.violet, margin:0, fontFamily:'JetBrains Mono, monospace' }}>
                {mxn(ride.proposed_price)}
              </p>
            </div>
            <p style={{ fontSize:12, color:C.muted, margin:'0 0 3px' }}>📍 {ride.origin_address}</p>
            <p style={{ fontSize:12, color:C.muted, margin:0 }}>🏁 {ride.destination_address}</p>
          </div>
        )}

        {/* Status + CTA principal */}
        <AnimatePresence mode="wait">
          {/* Estado 1: Aceptado → ir al pasajero */}
          {status === 'accepted' && (
            <motion.div key="accepted" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
              <div style={{ background:C.violet+'15', border:`1.5px solid ${C.violet}`, borderRadius:12, padding:'12px 16px', marginBottom:10, textAlign:'center' }}>
                <p style={{ color:C.violet, fontWeight:700, margin:0 }}>🚗 Ve al punto de recogida</p>
              </div>
              {ride?.origin_address && (
                <a href={`https://maps.google.com/?q=${ride.origin_latitude},${ride.origin_longitude}`} target="_blank" rel="noreferrer"
                  style={{ display:'block', textAlign:'center', marginBottom:10, color:C.cyan, fontSize:13, fontWeight:600 }}>
                  Abrir en Google Maps →
                </a>
              )}
              <button onClick={() => action('arrived')} disabled={acting}
                style={{ width:'100%', padding:'15px 0', borderRadius:12, border:'none', background:`linear-gradient(135deg, ${C.violet}, ${C.cyan})`, color:'#fff', fontWeight:700, fontSize:15, cursor:'pointer', opacity: acting ? 0.7 : 1 }}>
                {acting ? '...' : '📍 Llegué al punto de encuentro'}
              </button>
            </motion.div>
          )}

          {/* Estado 2: Llegó → esperar que pasajero confirme */}
          {status === 'arrived' && (
            <motion.div key="arrived" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
              <div style={{ background:C.gold+'15', border:`1.5px solid ${C.gold}`, borderRadius:12, padding:'16px', textAlign:'center', marginBottom:10 }}>
                <p style={{ color:C.gold, fontWeight:700, fontSize:16, margin:'0 0 6px' }}>⏳ Esperando al pasajero</p>
                <p style={{ color:C.muted, fontSize:13, margin:0 }}>El pasajero debe confirmar que está en el auto</p>
              </div>
              {/* Por si el pasajero no responde, el chofer puede iniciar manualmente después de un tiempo */}
              <button onClick={() => action('start')} disabled={acting}
                style={{ width:'100%', padding:'13px 0', borderRadius:12, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontWeight:600, fontSize:14, cursor:'pointer' }}>
                {acting ? '...' : 'Iniciar viaje manualmente'}
              </button>
            </motion.div>
          )}

          {/* Estado 3: En camino → botón finalizar */}
          {status === 'in_progress' && (
            <motion.div key="in_progress" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}>
              <div style={{ background:C.green+'15', border:`1.5px solid ${C.green}`, borderRadius:12, padding:'12px', textAlign:'center', marginBottom:10 }}>
                <p style={{ color:C.green, fontWeight:700, margin:0 }}>🏁 Viaje en progreso</p>
              </div>
              {destination && (
                <a href={`https://maps.google.com/?q=${ride.destination_latitude},${ride.destination_longitude}`} target="_blank" rel="noreferrer"
                  style={{ display:'block', textAlign:'center', marginBottom:10, color:C.cyan, fontSize:13, fontWeight:600 }}>
                  Navegar al destino →
                </a>
              )}
              <button onClick={() => setShowComplete(true)} disabled={acting}
                style={{ width:'100%', padding:'15px 0', borderRadius:12, border:'none', background:`linear-gradient(135deg, ${C.green}, ${C.cyan})`, color:'#fff', fontWeight:700, fontSize:15, cursor:'pointer' }}>
                ✅ Finalizar viaje
              </button>
            </motion.div>
          )}

          {/* Completado */}
          {status === 'completed' && (
            <motion.div key="done" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center', padding:24 }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:C.green+'22', border:`2px solid ${C.green}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ color:C.text, fontSize:18, fontWeight:700, margin:'0 0 4px' }}>¡Viaje completado!</p>
              <p style={{ color:C.muted, fontSize:13 }}>Ganancias acreditadas</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón de llamada */}
        {ride?.passenger_phone && status !== 'completed' && (
          <a href={`tel:${ride.passenger_phone}`}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', borderRadius:12, background:C.surface2, border:`1px solid ${C.border}`, color:C.cyan, textDecoration:'none', fontWeight:600, fontSize:13, justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.49 2 2 0 0 1 3.59 1.31h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.29 6.29l.77-.84a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Llamar al pasajero
          </a>
        )}
      </div>

      {/* Modal: confirmar finalización */}
      <AnimatePresence>
        {showComplete && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, background:'rgba(3,2,10,0.85)', display:'flex', alignItems:'flex-end', zIndex:50 }}>
            <motion.div initial={{ y:200 }} animate={{ y:0 }} exit={{ y:200 }}
              style={{ width:'100%', background:C.surface, borderRadius:'20px 20px 0 0', padding:'28px 20px 40px', border:`1px solid ${C.border}` }}>
              <h3 style={{ fontSize:20, fontWeight:800, color:C.text, margin:'0 0 8px', textAlign:'center' }}>Finalizar viaje</h3>
              <p style={{ fontSize:14, color:C.muted, textAlign:'center', margin:'0 0 24px', lineHeight:1.6 }}>
                Al finalizar, el pasajero verá un aviso para confirmar que no olvidó sus pertenencias.
              </p>
              <div style={{ background:C.surface2, borderRadius:12, padding:'14px 16px', marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:13, color:C.muted }}>Total del viaje</span>
                  <span style={{ fontSize:16, fontWeight:700, color:C.violet }}>{mxn(ride?.proposed_price ?? 0)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color:C.muted }}>Tu ganancia (90%)</span>
                  <span style={{ fontSize:14, fontWeight:600, color:C.green }}>{mxn((ride?.proposed_price ?? 0) * 0.9)}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setShowComplete(false)}
                  style={{ flex:1, padding:'13px 0', borderRadius:12, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontWeight:600, cursor:'pointer' }}>
                  Cancelar
                </button>
                <button onClick={async () => { setShowComplete(false); await action('complete'); }}
                  style={{ flex:2, padding:'13px 0', borderRadius:12, border:'none', background:`linear-gradient(135deg, ${C.green}, ${C.cyan})`, color:'#fff', fontWeight:700, cursor:'pointer' }}>
                  ✅ Confirmar finalización
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
