"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const C = { bg:'#0a0814',surface:'#0d0b1a',surface2:'#12102a',border:'rgba(124,58,237,0.18)',
  violet:'#7c3aed',cyan:'#22d3ee',text:'#f8f7ff',muted:'#9891c4',green:'#10b981' };

function Field({ label, id, ...props }: any) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label htmlFor={id} style={{ fontSize:12, fontWeight:600, color:C.muted, letterSpacing:'0.08em' }}>{label}</label>
      <input id={id} {...props} style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 14px', color:C.text, fontSize:14, outline:'none', width:'100%', boxSizing:'border-box' as const, fontFamily:'JetBrains Mono, monospace' }} />
    </div>
  );
}

export default function AddCardPage() {
  const router = useRouter();
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const formatCard = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExp = (v: string) => { const d=v.replace(/\D/g,''); return d.length>2 ? d.slice(0,2)+'/'+d.slice(2,4) : d; };

  const handleSave = async () => {
    setSaving(true);
    // TODO: Stripe.js createPaymentMethod → POST /api/stripe/save-card
    // Por ahora mock hasta recibir Stripe Connect config
    await new Promise(r => setTimeout(r, 1200));
    setDone(true);
    setTimeout(() => router.push('/app'), 2000);
    setSaving(false);
  };

  const valid = card.replace(/\s/g,'').length===16 && expiry.length===5 && cvc.length>=3 && name.length>2;

  if (done) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center', padding:40 }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:C.green+'22', border:`2px solid ${C.green}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <p style={{ color:C.text, fontSize:18, fontWeight:700 }}>¡Tarjeta guardada!</p>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:C.bg, padding:'32px 20px 60px', maxWidth:440, margin:'0 auto' }}>
      <button onClick={() => router.back()} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer', marginBottom:24, display:'flex', alignItems:'center', gap:6, fontSize:14 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Atrás
      </button>

      <h1 style={{ fontSize:24, fontWeight:800, color:C.text, margin:'0 0 6px' }}>Agregar tarjeta</h1>
      <p style={{ fontSize:14, color:C.muted, margin:'0 0 28px' }}>Tus datos están protegidos con Stripe (PCI DSS Level 1)</p>

      {/* Card preview */}
      <div style={{ background:`linear-gradient(135deg, ${C.violet}, ${C.cyan})`, borderRadius:16, padding:'22px 24px', marginBottom:28, minHeight:120, position:'relative' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.15em', color:'rgba(255,255,255,0.8)' }}>RIDEME PAY</span>
          <svg width="40" height="26" viewBox="0 0 40 26" fill="none"><rect width="40" height="26" rx="4" fill="white" fillOpacity=".2"/><circle cx="16" cy="13" r="8" fill="white" fillOpacity=".5"/><circle cx="24" cy="13" r="8" fill="white" fillOpacity=".3"/></svg>
        </div>
        <p style={{ fontSize:18, fontFamily:'JetBrains Mono, monospace', color:'rgba(255,255,255,0.9)', letterSpacing:'0.15em', margin:'0 0 12px' }}>
          {card || '•••• •••• •••• ••••'}
        </p>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>{name || 'NOMBRE DEL TITULAR'}</span>
          <span style={{ fontSize:12, fontFamily:'JetBrains Mono, monospace', color:'rgba(255,255,255,0.7)' }}>{expiry || 'MM/AA'}</span>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Field label="Número de tarjeta" id="card" value={card}
          onChange={(e: any) => setCard(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} inputMode="numeric" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Vencimiento" id="exp" value={expiry}
            onChange={(e: any) => setExpiry(formatExp(e.target.value))} placeholder="MM/AA" maxLength={5} inputMode="numeric" />
          <Field label="CVC" id="cvc" value={cvc}
            onChange={(e: any) => setCvc(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="123" maxLength={4} inputMode="numeric" type="password" />
        </div>
        <Field label="Nombre en la tarjeta" id="cname" value={name}
          onChange={(e: any) => setName(e.target.value.toUpperCase())} placeholder="JUAN GARCIA" autoComplete="cc-name" />
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:8, margin:'20px 0', padding:'12px 14px', background:C.surface2, borderRadius:10, border:`1px solid ${C.border}` }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <p style={{ fontSize:11, color:C.muted, margin:0 }}>Encriptación 256-bit SSL. Nunca almacenamos tu número completo.</p>
      </div>

      <button onClick={handleSave} disabled={!valid || saving}
        style={{ width:'100%', padding:'14px 0', borderRadius:12, border:'none',
          background: valid ? `linear-gradient(135deg, ${C.violet}, ${C.cyan})` : C.border,
          color:'#fff', fontWeight:700, fontSize:15, cursor: valid ? 'pointer' : 'not-allowed', opacity: saving ? 0.7 : 1, marginTop:8 }}>
        {saving ? 'Guardando...' : 'Guardar tarjeta de forma segura'}
      </button>
    </div>
  );
}
