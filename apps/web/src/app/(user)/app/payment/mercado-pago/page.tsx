"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const C = { bg:'#0a0814',surface:'#0d0b1a',border:'rgba(124,58,237,0.18)',
  violet:'#7c3aed',cyan:'#22d3ee',text:'#f8f7ff',muted:'#9891c4',mp:'#009ee3' };

export default function MercadoPagoPage() {
  const router = useRouter();
  const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';

  const handleConnect = () => {
    if (!MP_PUBLIC_KEY) {
      alert('Mercado Pago estará disponible pronto');
      return;
    }
    // TODO: MP OAuth flow cuando recibamos credenciales
    router.push('/app');
  };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:28 }}>
      <button onClick={() => router.back()} style={{ position:'absolute', top:24, left:24, background:'none', border:'none', color:C.muted, cursor:'pointer', fontSize:13 }}>← Atrás</button>

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', maxWidth:380 }}>
        <div style={{ width:80, height:80, borderRadius:24, background:C.mp+'22', border:`2px solid ${C.mp}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:36 }}>
          💙
        </div>
        <h1 style={{ fontSize:24, fontWeight:800, color:C.text, margin:'0 0 8px' }}>Conectar Mercado Pago</h1>
        <p style={{ fontSize:14, color:C.muted, margin:'0 0 32px', lineHeight:1.7 }}>
          Vincularás tu cuenta de Mercado Pago para pagar viajes y recibir reembolsos automáticamente.
        </p>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px 20px', marginBottom:24, textAlign:'left' }}>
          {['Pago seguro sin compartir datos de tarjeta','Reembolsos automáticos en segundos','Protección al comprador de Mercado Pago'].map(item => (
            <div key={item} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'flex-start' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.mp} strokeWidth="2" style={{ flexShrink:0, marginTop:2 }}><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontSize:13, color:C.text }}>{item}</span>
            </div>
          ))}
        </div>
        <button onClick={handleConnect}
          style={{ width:'100%', padding:'14px 0', borderRadius:12, border:'none', background:C.mp, color:'#fff', fontWeight:700, fontSize:15, cursor:'pointer' }}>
          Conectar con Mercado Pago →
        </button>
        <p style={{ fontSize:11, color:C.muted, marginTop:12 }}>
          Serás redirigido a Mercado Pago para autorizar el acceso
        </p>
      </motion.div>
    </div>
  );
}
