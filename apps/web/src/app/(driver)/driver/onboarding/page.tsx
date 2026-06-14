'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const C = {
  bg: '#0a0814', surface: '#0d0b1a', surface2: '#12102a',
  border: 'rgba(124,58,237,0.2)', violet: '#7c3aed', cyan: '#22d3ee',
  text: '#f8f7ff', muted: '#9891c4', green: '#10b981', red: '#ef4444',
};

const STEPS = [
  { id: 1, label: 'Datos personales' },
  { id: 2, label: 'Tu vehículo' },
  { id: 3, label: 'Documentos' },
  { id: 4, label: 'Términos & Privacidad' },
];

function Field({ label, id, ...props }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: '0.08em' }}>{label}</label>
      <input id={id} {...props} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 14px', color: C.text, fontSize: 14, outline: 'none', transition: 'border 0.2s', width: '100%', boxSizing: 'border-box' as const }} />
    </div>
  );
}

function UploadBox({ label, docType, onChange }: { label: string; docType: string; onChange: (url: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('doc_type', docType);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const d = await res.json();
    if (d.ok) { setPreview(d.url); onChange(d.url); }
    setUploading(false);
  };

  return (
    <div onClick={() => ref.current?.click()} style={{ cursor: 'pointer', border: `1.5px dashed ${preview ? C.cyan : C.border}`, borderRadius: 12, padding: '20px 16px', textAlign: 'center', transition: 'all 0.2s', background: preview ? C.cyan + '08' : 'transparent' }}>
      <input ref={ref} type="file" accept="image/*,application/pdf" onChange={handle} style={{ display: 'none' }} />
      {preview ? (
        preview.startsWith('data:image') ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" style={{ maxHeight: 100, borderRadius: 8, margin: '0 auto' }} />
        ) : (
          <p style={{ color: C.cyan, fontSize: 13 }}>✓ Archivo cargado</p>
        )
      ) : (
        <>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" style={{ margin: '0 auto 8px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p style={{ fontSize: 13, color: uploading ? C.cyan : C.muted, margin: 0 }}>{uploading ? 'Subiendo…' : label}</p>
          <p style={{ fontSize: 11, color: C.muted, margin: '4px 0 0' }}>JPG, PNG o PDF · max 2MB</p>
        </>
      )}
    </div>
  );
}

const PRIVACY = `AVISO DE PRIVACIDAD — RideMe

All Global Holding LLC ("RideMe") recaba tus datos personales (nombre, correo, teléfono, fotografía, documentos de identificación y vehículo) con la finalidad de:
• Verificar tu identidad y habilitarte como conductor en la plataforma.
• Gestionar el servicio de transporte y pagos.
• Cumplir con obligaciones legales y fiscales.

Tus datos serán tratados con confidencialidad y no serán compartidos con terceros salvo por requerimiento legal o para la prestación del servicio. Tienes derecho de acceso, rectificación, cancelación y oposición (ARCO) enviando un correo a privacidad@rideme.ink.`;

const TERMS = `TÉRMINOS Y CONDICIONES — RideMe

Al registrarte como conductor en RideMe aceptas:
1. Proporcionar información veraz y documentos vigentes.
2. Mantener tu vehículo en condiciones óptimas de seguridad.
3. Cumplir con la normativa vial y de transporte vigente.
4. Pagar la comisión de plataforma acordada por cada viaje completado.
5. No discriminar a ningún pasajero por motivo alguno.
6. Mantener una calificación mínima de 4.0 estrellas.
7. RideMe puede suspender tu cuenta ante incumplimiento de estos términos.

Para soporte: soporte@rideme.ink`;

export default function DriverOnboarding() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Form state
  const [personal, setPersonal] = useState({ full_name: user?.fullName || '', phone: user?.primaryPhoneNumber?.phoneNumber || '', license_number: '', license_expiry: '' });
  const [vehicle, setVehicle] = useState({ make: '', model: '', year: '', color: '', plate_number: '', vehicle_type: 'sedan' });
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState({ privacy: false, terms: false });

  const valid1 = personal.full_name && personal.phone && personal.license_number && personal.license_expiry;
  const valid2 = vehicle.make && vehicle.model && vehicle.year && vehicle.plate_number;
  const valid3 = docs['photo_selfie'] && docs['license_front'];
  const valid4 = agreed.privacy && agreed.terms;

  const canNext = step === 1 ? valid1 : step === 2 ? valid2 : step === 3 ? valid3 : valid4;

  const submit = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/driver/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.primaryEmailAddress?.emailAddress,
          ...personal,
          ...vehicle,
          vehicle_year: parseInt(vehicle.year) || null,
          license_expiry: personal.license_expiry,
          step_completed: 3,
        }),
      });
      setDone(true);
      setTimeout(() => router.push('/'), 3000);
    } catch { setSubmitting(false); }
  };

  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.green + '22', border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ color: C.text, fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>¡Solicitud enviada!</h2>
        <p style={{ color: C.muted, fontSize: 14 }}>Tu onboarding está en revisión. Te notificaremos por correo cuando seas aprobado.</p>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '20px 16px 60px', maxWidth: 520, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: '0 0 6px' }}>Únete como chofer</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>Completa los 4 pasos para activar tu cuenta</p>
      </div>

      {/* Steps indicator */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ flex: 1, height: 3, borderRadius: 99, background: step > s.id ? C.cyan : step === s.id ? C.violet : C.border, transition: 'background 0.3s' }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Paso {step} de 4 — {STEPS[step - 1].label}</p>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Nombre completo" id="name" value={personal.full_name} onChange={(e: any) => setPersonal(p => ({ ...p, full_name: e.target.value }))} placeholder="Juan García López" />
              <Field label="Teléfono" id="phone" type="tel" value={personal.phone} onChange={(e: any) => setPersonal(p => ({ ...p, phone: e.target.value }))} placeholder="+52 55 1234 5678" />
              <Field label="Número de licencia" id="lic" value={personal.license_number} onChange={(e: any) => setPersonal(p => ({ ...p, license_number: e.target.value }))} placeholder="CDMX-2024-001" />
              <Field label="Vencimiento de licencia" id="exp" type="date" value={personal.license_expiry} onChange={(e: any) => setPersonal(p => ({ ...p, license_expiry: e.target.value }))} />
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Marca" id="make" value={vehicle.make} onChange={(e: any) => setVehicle(v => ({ ...v, make: e.target.value }))} placeholder="Nissan" />
                <Field label="Modelo" id="model" value={vehicle.model} onChange={(e: any) => setVehicle(v => ({ ...v, model: e.target.value }))} placeholder="Versa" />
                <Field label="Año" id="year" type="number" value={vehicle.year} onChange={(e: any) => setVehicle(v => ({ ...v, year: e.target.value }))} placeholder="2022" />
                <Field label="Color" id="color" value={vehicle.color} onChange={(e: any) => setVehicle(v => ({ ...v, color: e.target.value }))} placeholder="Blanco" />
              </div>
              <Field label="Placas" id="plate" value={vehicle.plate_number} onChange={(e: any) => setVehicle(v => ({ ...v, plate_number: e.target.value }))} placeholder="ABC-123-D" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: '0.08em' }}>Tipo de vehículo</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['sedan','Sedán'],['suv','SUV'],['van','Van']].map(([val, lbl]) => (
                    <button key={val} onClick={() => setVehicle(v => ({ ...v, vehicle_type: val }))} style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: `1.5px solid ${vehicle.vehicle_type === val ? C.violet : C.border}`, background: vehicle.vehicle_type === val ? C.violet + '22' : 'transparent', color: vehicle.vehicle_type === val ? C.violet : C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>{lbl}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 13, color: C.muted }}>Sube los documentos requeridos. Los campos marcados con * son obligatorios.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><p style={{ fontSize: 11, color: C.muted, margin: '0 0 6px' }}>Foto personal *</p><UploadBox label="Selfie frontal" docType="photo_selfie" onChange={(url) => setDocs(d => ({ ...d, photo_selfie: url }))} /></div>
                <div><p style={{ fontSize: 11, color: C.muted, margin: '0 0 6px' }}>Licencia (frente) *</p><UploadBox label="Frente de licencia" docType="license_front" onChange={(url) => setDocs(d => ({ ...d, license_front: url }))} /></div>
                <div><p style={{ fontSize: 11, color: C.muted, margin: '0 0 6px' }}>Licencia (reverso)</p><UploadBox label="Reverso de licencia" docType="license_back" onChange={(url) => setDocs(d => ({ ...d, license_back: url }))} /></div>
                <div><p style={{ fontSize: 11, color: C.muted, margin: '0 0 6px' }}>Foto del vehículo</p><UploadBox label="Foto del auto" docType="vehicle_registration" onChange={(url) => setDocs(d => ({ ...d, vehicle_registration: url }))} /></div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: C.surface2, borderRadius: 10, padding: 16, maxHeight: 180, overflowY: 'auto', border: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 11, color: C.muted, whiteSpace: 'pre-line', lineHeight: 1.7 }}>{PRIVACY}</p>
              </div>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={agreed.privacy} onChange={e => setAgreed(a => ({ ...a, privacy: e.target.checked }))} style={{ marginTop: 2 }} />
                <span style={{ fontSize: 13, color: C.text }}>He leído y acepto el <span style={{ color: C.cyan }}>Aviso de Privacidad</span></span>
              </label>
              <div style={{ background: C.surface2, borderRadius: 10, padding: 16, maxHeight: 180, overflowY: 'auto', border: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 11, color: C.muted, whiteSpace: 'pre-line', lineHeight: 1.7 }}>{TERMS}</p>
              </div>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={agreed.terms} onChange={e => setAgreed(a => ({ ...a, terms: e.target.checked }))} style={{ marginTop: 2 }} />
                <span style={{ fontSize: 13, color: C.text }}>He leído y acepto los <span style={{ color: C.cyan }}>Términos y Condiciones</span></span>
              </label>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '13px 0', borderRadius: 12, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Atrás</button>
        )}
        <button
          onClick={step < 4 ? () => setStep(s => s + 1) : submit}
          disabled={!canNext || submitting}
          style={{ flex: 2, padding: '13px 0', borderRadius: 12, border: 'none', background: canNext ? `linear-gradient(135deg, ${C.violet}, ${C.cyan})` : C.border, color: '#fff', fontSize: 14, fontWeight: 700, cursor: canNext ? 'pointer' : 'not-allowed', opacity: submitting ? 0.7 : 1, transition: 'all 0.2s' }}>
          {submitting ? 'Enviando…' : step < 4 ? 'Continuar →' : '¡Enviar solicitud!'}
        </button>
      </div>
    </div>
  );
}
