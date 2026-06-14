"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

const C = {
  bg:'#0a0814',surface:'#0d0b1a',surface2:'#12102a',
  border:'rgba(124,58,237,0.18)',violet:'#7c3aed',cyan:'#22d3ee',
  text:'#f8f7ff',muted:'#9891c4',green:'#10b981',
};

const STEPS = ['Tu perfil','Teléfono','Método de pago','Listo'];

function Field({ label, id, ...props }: any) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label htmlFor={id} style={{ fontSize:12, fontWeight:600, color:C.muted, letterSpacing:'0.08em' }}>{label}</label>
      <input id={id} {...props} style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 14px', color:C.text, fontSize:14, outline:'none', width:'100%', boxSizing:'border-box' as const }} />
    </div>
  );
}

type PayMethod = 'cash' | 'stripe' | 'mp';

export default function UserOnboarding() {
  const { user } = useUser();
  const router = useRouter();
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.primaryPhoneNumber?.phoneNumber || '');
  const [payMethod, setPayMethod] = useState<PayMethod>('cash');

  useEffect(() => {
    if (user?.fullName) setName(user.fullName);
  }, [user]);

  const canNext = step === 1 ? !!name.trim() : step === 2 ? phone.length >= 8 : true;

  const handleFinish = async () => {
    setSaving(true);
    try {
      // Save name to Clerk
      if (user && name !== user.fullName) {
        const parts = name.trim().split(' ');
        await user.update({
          firstName: parts[0],
          lastName: parts.slice(1).join(' ') || undefined,
        });
      }
      // If Stripe card chosen, redirect to Stripe setup
      if (payMethod === 'stripe') {
        router.push('/app/payment/add-card');
        return;
      }
      if (payMethod === 'mp') {
        router.push('/app/payment/mercado-pago');
        return;
      }
      router.push('/app');
    } finally {
      setSaving(false);
    }
  };

  const PAY_OPTIONS: { id: PayMethod; label: string; sub: string; icon: string }[] = [
    { id:'cash', label:'Efectivo', sub:'Paga directamente al chofer', icon:'💵' },
    { id:'stripe', label:'Tarjeta de crédito/débito', sub:'Visa, Mastercard, Amex', icon:'💳' },
    { id:'mp', label:'Mercado Pago', sub:'Paga con tu cuenta MP', icon:'💙' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:C.bg, padding:'32px 20px 60px', maxWidth:480, margin:'0 auto' }}>

      {/* Progress */}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:'flex', gap:6, marginBottom:12 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex:1, height:3, borderRadius:99,
              background: step > i+1 ? C.cyan : step === i+1 ? C.violet : C.border,
              transition:'background 0.3s' }} />
          ))}
        </div>
        <p style={{ fontSize:11, color:C.muted, textTransform:'uppercase', letterSpacing:'0.1em' }}>
          Paso {step} de {STEPS.length} — {STEPS[step-1]}
        </p>
      </div>

      <h1 style={{ fontSize:26, fontWeight:800, color:C.text, margin:'0 0 6px' }}>
        {step === 1 ? '¡Bienvenido a RideMe!' : step === 2 ? 'Tu número de teléfono' : step === 3 ? 'Método de pago' : '¡Todo listo!'}
      </h1>
      <p style={{ fontSize:14, color:C.muted, margin:'0 0 28px' }}>
        {step === 1 ? 'Cuéntanos cómo te llamas' : step === 2 ? 'Para que el chofer te pueda contactar' : step === 3 ? 'Elige cómo quieres pagar tus viajes' : 'Tu cuenta está configurada'}
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.2 }}>

          {step === 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <Field label="Tu nombre completo" id="name" value={name}
                onChange={(e: any) => setName(e.target.value)} placeholder="Juan García" autoFocus />
              {user?.primaryEmailAddress?.emailAddress && (
                <div style={{ padding:'12px 14px', background:C.surface2, borderRadius:10, border:`1px solid ${C.border}` }}>
                  <p style={{ fontSize:11, color:C.muted, margin:'0 0 2px' }}>Correo verificado</p>
                  <p style={{ fontSize:13, color:C.text, margin:0 }}>{user.primaryEmailAddress.emailAddress}</p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <Field label="Número de teléfono" id="phone" type="tel" value={phone}
              onChange={(e: any) => setPhone(e.target.value)} placeholder="+52 55 1234 5678" autoFocus />
          )}

          {step === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {PAY_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => setPayMethod(opt.id)}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', borderRadius:14,
                    border:`1.5px solid ${payMethod===opt.id ? C.violet : C.border}`,
                    background: payMethod===opt.id ? C.violet+'15' : 'transparent',
                    cursor:'pointer', textAlign:'left', transition:'all 0.2s', width:'100%' }}>
                  <span style={{ fontSize:28, flexShrink:0 }}>{opt.icon}</span>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>{opt.label}</p>
                    <p style={{ fontSize:12, color:C.muted, margin:'2px 0 0' }}>{opt.sub}</p>
                  </div>
                  {payMethod === opt.id && (
                    <div style={{ marginLeft:'auto', width:20, height:20, borderRadius:'50%', background:C.violet, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
              ))}
              <p style={{ fontSize:11, color:C.muted, marginTop:8, textAlign:'center' }}>Puedes cambiar esto en cualquier momento desde tu perfil</p>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, damping:12 }}
                style={{ width:80, height:80, borderRadius:'50%', background:C.green+'22', border:`2px solid ${C.green}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </motion.div>
              <p style={{ fontSize:16, color:C.text, lineHeight:1.6 }}>
                {payMethod === 'stripe' ? 'Ahora agregarás tu tarjeta de forma segura con Stripe' :
                 payMethod === 'mp' ? 'Conectarás tu cuenta de Mercado Pago' :
                 'Listo, pagarás en efectivo al chofer después de cada viaje'}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ display:'flex', gap:10, marginTop:32 }}>
        {step > 1 && step < 4 && (
          <button onClick={() => setStep(s => s-1)} style={{ flex:1, padding:'13px 0', borderRadius:12, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontWeight:600, cursor:'pointer' }}>← Atrás</button>
        )}
        <button
          onClick={step < 4 ? () => setStep(s => s+1) : handleFinish}
          disabled={!canNext || saving}
          style={{ flex:2, padding:'13px 0', borderRadius:12, border:'none',
            background: canNext ? `linear-gradient(135deg, ${C.violet}, ${C.cyan})` : C.border,
            color:'#fff', fontWeight:700, fontSize:14, cursor: canNext ? 'pointer' : 'not-allowed', opacity: saving ? 0.7 : 1, transition:'all 0.2s' }}>
          {saving ? 'Guardando...' : step < 4 ? 'Continuar →' : payMethod === 'cash' ? 'Ir al mapa 🗺️' : 'Agregar método →'}
        </button>
      </div>
    </div>
  );
}
