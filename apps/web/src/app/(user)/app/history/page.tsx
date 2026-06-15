"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BottomNav } from '@/components/layout/BottomNav';

const C = { bg:'#0a0814',surface:'#0d0b1a',border:'rgba(124,58,237,0.18)',violet:'#7c3aed',cyan:'#22d3ee',green:'#10b981',red:'#ef4444',text:'#f8f7ff',muted:'#9891c4' };

const STATUS_LABEL: Record<string,{l:string;c:string}> = {
  completed: { l:'Completado', c:'#10b981' },
  cancelled: { l:'Cancelado', c:'#ef4444' },
  in_progress: { l:'En curso', c:'#22d3ee' },
  searching: { l:'Buscando chofer', c:'#7c3aed' },
};

export default function HistoryPage() {
  const router = useRouter();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/rides').then(r=>r.json()).then(d=>{ if(d.ok) setRides(d.data||[]); setLoading(false); });
  }, []);

  const mxn = (v:number) => `$${Number(v).toFixed(0)} MXN`;
  const fmt = (d:string) => new Date(d).toLocaleDateString('es-MX',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});

  return (
    <div style={{ minHeight:'100vh', background:C.bg, paddingBottom:80 }}>
      <div style={{ position:'sticky',top:0,zIndex:40,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:'14px 20px',display:'flex',alignItems:'center',gap:12 }}>
        <button onClick={()=>router.back()} style={{ background:'none',border:'none',color:C.muted,cursor:'pointer',padding:4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 style={{ fontSize:18,fontWeight:700,margin:0,color:C.text }}>Historial de viajes</h1>
      </div>

      <div style={{ padding:'16px',maxWidth:480,margin:'0 auto' }}>
        {loading && <p style={{ color:C.muted,textAlign:'center',padding:40 }}>Cargando...</p>}
        {!loading && rides.length === 0 && (
          <div style={{ textAlign:'center',padding:'60px 20px' }}>
            <p style={{ fontSize:40,margin:'0 0 12px' }}>🚗</p>
            <p style={{ fontSize:16,color:C.text,fontWeight:600 }}>Sin viajes aún</p>
            <p style={{ fontSize:13,color:C.muted }}>Tus viajes aparecerán aquí</p>
            <button onClick={()=>router.push('/app')} style={{ marginTop:20,padding:'12px 28px',borderRadius:12,border:'none',background:`linear-gradient(135deg, ${C.violet}, ${C.cyan})`,color:'white',fontWeight:700,cursor:'pointer' }}>
              Solicitar un viaje
            </button>
          </div>
        )}
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          {rides.map((ride,i) => {
            const st = STATUS_LABEL[ride.status] || { l:ride.status, c:C.muted };
            return (
              <motion.div key={ride.id} initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
                style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:'14px 16px',cursor:'pointer' }}
                onClick={()=>{ if(ride.status==='in_progress'||ride.status==='arrived'||ride.status==='accepted') router.push('/app/trip'); }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8 }}>
                  <div>
                    <span style={{ fontSize:11,fontWeight:700,color:st.c,textTransform:'uppercase',letterSpacing:'0.08em' }}>{st.l}</span>
                    <p style={{ fontSize:11,color:C.muted,margin:'2px 0 0' }}>{ride.created_at ? fmt(ride.created_at) : ''}</p>
                  </div>
                  <p style={{ fontSize:20,fontWeight:800,color:C.violet,margin:0,fontFamily:'JetBrains Mono,monospace' }}>{mxn(ride.proposed_price||0)}</p>
                </div>
                <p style={{ fontSize:13,color:C.text,margin:'0 0 3px' }}>📍 {ride.origin_address||'Origen'}</p>
                <p style={{ fontSize:13,color:C.muted,margin:0 }}>🏁 {ride.destination_address||'Destino'}</p>
                {ride.driver_name && <p style={{ fontSize:11,color:C.muted,marginTop:6 }}>Chofer: {ride.driver_name}</p>}
                {ride.rating_by_passenger && (
                  <p style={{ fontSize:11,color:C.gold,marginTop:4 }}>{'⭐'.repeat(ride.rating_by_passenger)} Tu calificación</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <BottomNav role="passenger" />
    </div>
  );
}
