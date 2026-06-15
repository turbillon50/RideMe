"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BottomNav } from '@/components/layout/BottomNav';
import { useI18n } from '@/lib/i18n';

const C = {
  bg:'#0a0814',surface:'#0d0b1a',surface2:'#12102a',border:'rgba(124,58,237,0.18)',
  violet:'#7c3aed',cyan:'#22d3ee',gold:'#fbbf24',green:'#10b981',red:'#ef4444',
  text:'#f8f7ff',muted:'#9891c4',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,marginBottom:12,overflow:'hidden' }}>
      <p style={{ fontSize:10,color:C.muted,textTransform:'uppercase',letterSpacing:'0.12em',padding:'12px 16px 0',margin:0,fontWeight:700 }}>{title}</p>
      {children}
    </div>
  );
}

function Row({ icon, label, value, action, onClick, color }: any) {
  return (
    <button onClick={onClick} style={{ width:'100%',display:'flex',alignItems:'center',gap:12,padding:'13px 16px',background:'none',border:'none',cursor:onClick?'pointer':'default',borderTop:`1px solid ${C.border}` }}>
      <span style={{ fontSize:18,flexShrink:0 }}>{icon}</span>
      <div style={{ flex:1,textAlign:'left' }}>
        <p style={{ fontSize:13,color:color||C.text,margin:0,fontWeight:500 }}>{label}</p>
        {value && <p style={{ fontSize:11,color:C.muted,margin:'2px 0 0' }}>{value}</p>}
      </div>
      {action && <span style={{ fontSize:12,color:C.muted }}>{action}</span>}
    </button>
  );
}

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { t, lang, setLang } = useI18n();
  const [dbUser, setDbUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [homeAddr, setHomeAddr] = useState('');
  const [workAddr, setWorkAddr] = useState('');
  const [prefVehicle, setPrefVehicle] = useState('standard');
  const [prefPayment, setPrefPayment] = useState('cash');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.fullName || '');
    setPhone(user.primaryPhoneNumber?.phoneNumber || '');
    fetch('/api/user/profile').then(r=>r.json()).then(d=>{
      if (d.ok && d.user) {
        const u = d.user;
        setDbUser(u);
        setHomeAddr(u.home_address||'');
        setWorkAddr(u.work_address||'');
        setPrefVehicle(u.preferred_vehicle||'standard');
        setPrefPayment(u.preferred_payment||'cash');
        if (u.avatar_url) setAvatarPreview(u.avatar_url);
      }
    });
  }, [user]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingPhoto(true);
    const form = new FormData();
    form.append('file', file);
    form.append('doc_type', 'photo_selfie');
    const res = await fetch('/api/upload', { method:'POST', body:form });
    const d = await res.json();
    if (d.ok) {
      setAvatarPreview(d.url);
      await fetch('/api/user/profile', { method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ avatar_url: d.url }) });
    }
    setUploadingPhoto(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const parts = name.trim().split(' ');
    if (parts.length && name !== user.fullName) {
      await user.update({ firstName: parts[0], lastName: parts.slice(1).join(' ') || undefined });
    }
    await fetch('/api/user/profile', { method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name: name.trim(), phone, home_address: homeAddr, work_address: workAddr,
        preferred_vehicle: prefVehicle, preferred_payment: prefPayment }) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = (name || user?.fullName || 'U').split(' ').map((n:string)=>n[0]).join('').slice(0,2).toUpperCase();

  return (
    <div style={{ minHeight:'100vh', background:C.bg, color:C.text, paddingBottom:80, fontFamily:'Inter,system-ui,sans-serif' }}>

      {/* Header */}
      <div style={{ position:'sticky',top:0,zIndex:40,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:'14px 20px',display:'flex',alignItems:'center',gap:12 }}>
        <button onClick={()=>router.back()} style={{ background:'none',border:'none',color:C.muted,cursor:'pointer',padding:4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h1 style={{ fontSize:18,fontWeight:700,margin:0 }}>{t('my_profile')}</h1>
        <AnimatePresence>
          {saved && <motion.span initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}} style={{ marginLeft:'auto',fontSize:12,color:C.green,fontWeight:700 }}>✓ Guardado</motion.span>}
        </AnimatePresence>
      </div>

      <div style={{ maxWidth:480,margin:'0 auto',padding:'16px 16px 0' }}>

        {/* Avatar */}
        <div style={{ textAlign:'center',padding:'20px 0 16px' }}>
          <div style={{ position:'relative',display:'inline-block' }}>
            <div onClick={()=>fileRef.current?.click()} style={{ width:90,height:90,borderRadius:'50%',cursor:'pointer',overflow:'hidden',
              background:`linear-gradient(135deg, ${C.violet}, ${C.cyan})`,display:'flex',alignItems:'center',justifyContent:'center',
              border:`2px solid ${C.border}`,position:'relative' }}>
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="avatar" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
              ) : (
                <span style={{ fontSize:32,fontWeight:800,color:'white' }}>{initials}</span>
              )}
              {uploadingPhoto && (
                <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <div style={{ width:20,height:20,borderRadius:'50%',border:'2px solid white',borderTopColor:'transparent',animation:'spin 0.8s linear infinite' }} />
                </div>
              )}
            </div>
            <button onClick={()=>fileRef.current?.click()} style={{ position:'absolute',bottom:0,right:0,width:28,height:28,borderRadius:'50%',
              background:C.violet,border:`2px solid ${C.bg}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display:'none' }} capture="user" />
          </div>
          <p style={{ fontSize:16,fontWeight:700,margin:'10px 0 2px' }}>{name || user?.fullName || 'Usuario'}</p>
          <p style={{ fontSize:12,color:C.muted,margin:0 }}>{user?.primaryEmailAddress?.emailAddress}</p>
          {dbUser?.referral_code && (
            <div style={{ marginTop:8,display:'inline-flex',alignItems:'center',gap:6,padding:'4px 12px',background:'rgba(34,211,238,0.1)',borderRadius:99,border:`1px solid rgba(34,211,238,0.2)` }}>
              <span style={{ fontSize:11,color:C.cyan,fontWeight:700 }}>Código de referido: {dbUser.referral_code}</span>
            </div>
          )}
        </div>

        {/* Info Personal */}
        <Section title="Información personal">
          <div style={{ padding:'10px 16px 16px',display:'flex',flexDirection:'column',gap:12 }}>
            <div>
              <p style={{ fontSize:11,color:C.muted,margin:'0 0 5px',fontWeight:600 }}>Nombre completo</p>
              <input value={name} onChange={e=>setName(e.target.value)} style={{ width:'100%',background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 12px',color:C.text,fontSize:14,outline:'none',boxSizing:'border-box' as const }} />
            </div>
            <div>
              <p style={{ fontSize:11,color:C.muted,margin:'0 0 5px',fontWeight:600 }}>Teléfono</p>
              <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel" placeholder="+52 55 1234 5678" style={{ width:'100%',background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 12px',color:C.text,fontSize:14,outline:'none',boxSizing:'border-box' as const }} />
            </div>
          </div>
        </Section>

        {/* Direcciones guardadas */}
        <Section title="Direcciones frecuentes">
          <div style={{ padding:'10px 16px 16px',display:'flex',flexDirection:'column',gap:12 }}>
            {[['🏠','Casa',homeAddr,setHomeAddr],['💼','Trabajo',workAddr,setWorkAddr]].map(([icon,label,val,setter]:any) => (
              <div key={label}>
                <p style={{ fontSize:11,color:C.muted,margin:'0 0 5px',fontWeight:600 }}>{icon} {label}</p>
                <input value={val} onChange={(e:any)=>setter(e.target.value)} placeholder={`Agrega tu dirección de ${label.toLowerCase()}`}
                  style={{ width:'100%',background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 12px',color:C.text,fontSize:13,outline:'none',boxSizing:'border-box' as const }} />
              </div>
            ))}
          </div>
        </Section>

        {/* Preferencias */}
        <Section title="Preferencias de viaje">
          <div style={{ padding:'10px 16px 16px',display:'flex',flexDirection:'column',gap:14 }}>
            <div>
              <p style={{ fontSize:11,color:C.muted,margin:'0 0 8px',fontWeight:600 }}>Tipo de vehículo predeterminado</p>
              <div style={{ display:'flex',gap:6 }}>
                {[['standard','Estándar'],['comfort','Confort'],['xl','XL']].map(([v,l])=>(
                  <button key={v} onClick={()=>setPrefVehicle(v)}
                    style={{ flex:1,padding:'8px 4px',borderRadius:9,border:`1.5px solid ${prefVehicle===v?C.violet:C.border}`,background:prefVehicle===v?C.violet+'22':'transparent',color:prefVehicle===v?C.violet:C.muted,fontSize:12,fontWeight:700,cursor:'pointer',transition:'all 0.2s' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize:11,color:C.muted,margin:'0 0 8px',fontWeight:600 }}>Método de pago predeterminado</p>
              <div style={{ display:'flex',gap:6 }}>
                {[['cash','💵 Efectivo'],['card','💳 Tarjeta'],['mp','💙 Mercado Pago']].map(([v,l])=>(
                  <button key={v} onClick={()=>setPrefPayment(v)}
                    style={{ flex:1,padding:'8px 4px',borderRadius:9,border:`1.5px solid ${prefPayment===v?C.cyan:C.border}`,background:prefPayment===v?C.cyan+'15':'transparent',color:prefPayment===v?C.cyan:C.muted,fontSize:11,fontWeight:700,cursor:'pointer',transition:'all 0.2s' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Métodos de pago */}
        <Section title="Métodos de pago">
          <Row icon="💳" label="Tarjeta de crédito/débito" value="Sin tarjetas guardadas" action="Agregar →" onClick={()=>router.push('/app/payment/add-card')} />
          <Row icon="💙" label="Mercado Pago" value="Conectar cuenta MP" action="→" onClick={()=>router.push('/app/payment/mercado-pago')} />
        </Section>

        {/* Historial rápido */}
        <Section title="Mi actividad">
          <Row icon="🚗" label="Historial de viajes" value={`${dbUser?.total_rides||0} viajes`} action="Ver →" onClick={()=>router.push('/app/history')} />
          <Row icon="⭐" label="Mi calificación promedio" value="Próximamente" />
        </Section>

        {/* Apariencia e idioma */}
        <Section title={t('appearance')}>
          <div style={{ padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:`1px solid ${C.border}` }}>
            <div>
              <p style={{ fontSize:13,color:C.text,margin:0,fontWeight:500 }}>Tema</p>
              <p style={{ fontSize:11,color:C.muted,margin:'2px 0 0' }}>Claro u oscuro</p>
            </div>
            <ThemeToggle />
          </div>
          <div style={{ padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:`1px solid ${C.border}` }}>
            <div>
              <p style={{ fontSize:13,color:C.text,margin:0,fontWeight:500 }}>{t('language')}</p>
            </div>
            <div style={{ display:'flex',gap:6 }}>
              {(['es','en'] as const).map(l=>(
                <button key={l} onClick={()=>setLang(l)} style={{ padding:'4px 12px',borderRadius:7,fontSize:12,fontWeight:700,cursor:'pointer',
                  border:`1px solid ${lang===l?C.cyan:C.border}`,background:lang===l?C.cyan+'15':'transparent',color:lang===l?C.cyan:C.muted }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Guardar */}
        <button onClick={handleSave} disabled={saving}
          style={{ width:'100%',padding:'14px',borderRadius:12,border:'none',background:`linear-gradient(135deg, ${C.violet}, ${C.cyan})`,color:'white',fontWeight:700,fontSize:15,cursor:'pointer',opacity:saving?0.7:1,marginBottom:12 }}>
          {saving ? 'Guardando...' : t('save_changes')}
        </button>

        {/* Soporte + Cerrar sesión */}
        <Section title="Cuenta">
          <Row icon="💬" label="Soporte" value="¿Necesitas ayuda?" action="→" onClick={()=>window.open('https://wa.me/521XXXXXXXXXX?text=Hola%20RideMe%20soporte','_blank')} />
          <Row icon="📤" label={t('sign_out')} onClick={()=>signOut(()=>router.push('/'))} color={C.red} />
        </Section>
      </div>

      <BottomNav role="passenger" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
