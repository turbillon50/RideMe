"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MapView } from "@/components/maps/MapView";
import { BottomNav } from "@/components/layout/BottomNav";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useDriverStore } from "@/store/driverStore";
import { useI18n } from "@/lib/i18n";
import { useUser } from "@clerk/nextjs";

const C = { bg:'#0a0814',surface:'#0d0b1a',surface2:'#12102a',border:'rgba(124,58,237,0.18)',
  violet:'#7c3aed',cyan:'#22d3ee',gold:'#fbbf24',green:'#10b981',red:'#ef4444',text:'#f8f7ff',muted:'#9891c4' };

interface PendingRide {
  id: string; origin_address: string; destination_address: string;
  proposed_price: number; distance_m: number; passenger_name: string;
}

export default function DriverDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const { isOnline, setOnline } = useDriverStore();
  const { location } = useGeolocation({ watch: true, enableHighAccuracy: true });
  const { t } = useI18n();
  const [earnings, setEarnings] = useState({ today_gross: 0, week_gross: 0, total_trips: 0 });
  const [pendingRide, setPendingRide] = useState<PendingRide | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const locationRef = useRef(location);
  locationRef.current = location;

  // Load earnings
  useEffect(() => {
    fetch('/api/driver/earnings').then(r => r.json()).then(d => { if (d.ok) setEarnings(d.data); });
  }, []);

  // Update location while online
  useEffect(() => {
    if (!isOnline || !location) return;
    const update = () => {
      if (!locationRef.current) return;
      fetch('/api/driver/location', { method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ latitude: locationRef.current.latitude, longitude: locationRef.current.longitude }) });
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, [isOnline, location?.latitude, location?.longitude]);

  // Poll for pending rides
  const pollRides = useCallback(async () => {
    if (!isOnline) return;
    try {
      const res = await fetch('/api/driver/pending-rides');
      const data = await res.json();
      const rides = data.data ?? [];
      if (rides.length > 0 && !pendingRide) setPendingRide(rides[0]);
    } catch {}
  }, [isOnline, pendingRide]);

  useEffect(() => {
    if (!isOnline) { setPendingRide(null); return; }
    pollRides();
    const id = setInterval(pollRides, 8000);
    return () => clearInterval(id);
  }, [isOnline, pollRides]);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await fetch('/api/driver/online', { method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ isOnline: !isOnline }) });
      const data = await res.json();
      if (data.ok) setOnline(data.isOnline);
    } catch {}
    setToggling(false);
  };

  const handleAccept = async (rideId: string) => {
    setAccepting(true);
    try {
      const res = await fetch(`/api/driver/rides/${rideId}/accept`, { method:'POST' });
      const data = await res.json();
      if (data.ok) { router.push('/driver/trip?id=' + rideId); }
      else { alert(data.error || 'Viaje ya tomado'); setPendingRide(null); }
    } catch {}
    setAccepting(false);
  };

  const center = location ? { lat: location.latitude, lng: location.longitude } : { lat: 19.4326, lng: -99.1332 };
  const mxn = (v: number) => `$${Number(v).toLocaleString('es-MX', { maximumFractionDigits: 0 })}`;

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column' }}>
      {/* Map */}
      <div style={{ height:'42vh', position:'relative' }}>
        <MapView center={center} userLocation={center} className="w-full h-full" />
        {/* Online toggle overlay */}
        <div style={{ position:'absolute', top:14, left:0, right:0, padding:'0 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ background:'rgba(10,8,20,0.9)', backdropFilter:'blur(12px)', borderRadius:14, padding:'8px 14px', border:`1px solid ${C.border}` }}>
            <span style={{ fontSize:12, fontWeight:700, color:C.muted, letterSpacing:'0.08em' }}>RIDEME</span>
            <span style={{ fontSize:10, color:C.muted, letterSpacing:'0.12em', display:'block' }}>CONDUCTOR</span>
          </div>
          <button onClick={handleToggle} disabled={toggling}
            style={{ background: isOnline ? C.green+'33' : C.surface2, border:`1.5px solid ${isOnline ? C.green : C.border}`, borderRadius:12, padding:'10px 18px', display:'flex', alignItems:'center', gap:8, cursor:'pointer', transition:'all 0.2s' }}>
            <div style={{ width:8,height:8,borderRadius:'50%',background: isOnline ? C.green : C.muted }} />
            <span style={{ fontSize:13, fontWeight:700, color: isOnline ? C.green : C.muted }}>{toggling ? '...' : isOnline ? t('driver_online') : t('driver_offline')}</span>
          </button>
        </div>
      </div>

      {/* Earnings strip */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'14px 20px', display:'flex', gap:0 }}>
        {[
          { label:'Hoy', value: mxn(earnings.today_gross), color: C.gold },
          { label:'Semana', value: mxn(earnings.week_gross), color: C.violet },
          { label:'Viajes', value: String(earnings.total_trips), color: C.cyan },
        ].map((item, i) => (
          <div key={i} style={{ flex:1, textAlign:'center', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
            <p style={{ fontSize:11, color:C.muted, margin:'0 0 3px', textTransform:'uppercase', letterSpacing:'0.08em' }}>{item.label}</p>
            <p style={{ fontSize:20, fontWeight:800, color:item.color, margin:0, fontFamily:'JetBrains Mono, monospace' }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Status / incoming ride */}
      <div style={{ flex:1, padding:'20px 16px' }}>
        <AnimatePresence>
          {pendingRide ? (
            <motion.div key="offer" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
              style={{ background:C.surface, border:`2px solid ${C.violet}`, borderRadius:16, padding:'18px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                <div style={{ width:8,height:8,borderRadius:'50%',background:C.gold }} />
                <span style={{ fontSize:12, fontWeight:700, color:C.gold, textTransform:'uppercase', letterSpacing:'0.1em' }}>{t('new_ride')}</span>
              </div>
              <p style={{ fontSize:15, color:C.text, margin:'0 0 4px', fontWeight:600 }}>📍 {pendingRide.origin_address}</p>
              <p style={{ fontSize:13, color:C.muted, margin:'0 0 14px' }}>🏁 {pendingRide.destination_address}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <div>
                  <p style={{ fontSize:24, fontWeight:800, color:C.violet, margin:0, fontFamily:'JetBrains Mono, monospace' }}>
                    ${pendingRide.proposed_price} MXN
                  </p>
                  <p style={{ fontSize:11, color:C.muted, margin:'2px 0 0' }}>{Math.round(pendingRide.distance_m / 100) / 10} km · {pendingRide.passenger_name}</p>
                </div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setPendingRide(null)}
                  style={{ flex:1, padding:'13px 0', borderRadius:12, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontWeight:600, fontSize:14, cursor:'pointer' }}>
                  {t('reject')}
                </button>
                <button onClick={() => handleAccept(pendingRide.id)} disabled={accepting}
                  style={{ flex:2, padding:'13px 0', borderRadius:12, border:'none', background:`linear-gradient(135deg, ${C.violet}, ${C.cyan})`, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', opacity: accepting ? 0.7 : 1 }}>
                  {accepting ? '...' : t('accept')} →
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="waiting" initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:'center', padding:'40px 20px' }}>
              {isOnline ? (
                <>
                  {[1,2,3].map(i => (
                    <motion.div key={i} style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', width:80+i*30, height:80+i*30, borderRadius:'50%', border:`1px solid ${C.violet}`, marginTop: -20 }}
                      animate={{ scale:[1,1.3], opacity:[0.4,0] }} transition={{ duration:2.5, delay:i*0.7, repeat:Infinity }} />
                  ))}
                  <p style={{ fontSize:15, fontWeight:700, color:C.text, position:'relative', zIndex:1 }}>En línea — esperando viajes</p>
                  <p style={{ fontSize:12, color:C.muted, position:'relative', zIndex:1 }}>Busca viajes cada 8 segundos</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize:15, color:C.muted }}>Estás desconectado</p>
                  <p style={{ fontSize:12, color:C.muted }}>Activa el botón para recibir viajes</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav role="driver" />
    </div>
  );
}
