"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTripStore } from "@/store/tripStore";
import { useI18n } from "@/lib/i18n";
import { BottomNav } from "@/components/layout/BottomNav";

const C = { bg: '#0a0814', surface: '#0d0b1a', border: 'rgba(124,58,237,0.18)',
  violet: '#7c3aed', cyan: '#22d3ee', text: '#f8f7ff', muted: '#9891c4' };

const STEPS = [
  "Publicando tu solicitud...",
  "Notificando choferes cercanos...",
  "Esperando confirmación...",
  "Conectando con el mejor chofer...",
];

export default function OffersPage() {
  const router = useRouter();
  const { activeRide, setActiveRide } = useTripStore();
  const { t } = useI18n();
  const [stepIdx, setStepIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const poll = useCallback(async () => {
    if (!activeRide?.id) return;
    try {
      const res = await fetch(`/api/rides/${activeRide.id}`);
      const data = await res.json();
      const ride = data.data;
      if (!ride) return;
      setActiveRide(ride);
      if (ride.status === 'accepted' || ride.status === 'driver_en_route') {
        router.push('/app/trip');
      }
    } catch {}
  }, [activeRide?.id]);

  useEffect(() => {
    if (!activeRide?.id) { router.push('/app'); return; }
    const pollId = setInterval(poll, 6000);
    const stepId = setInterval(() => setStepIdx(i => Math.min(i + 1, STEPS.length - 1)), 4000);
    const elId   = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { clearInterval(pollId); clearInterval(stepId); clearInterval(elId); };
  }, [activeRide?.id, poll]);

  const handleCancel = async () => {
    if (!activeRide?.id) return;
    await fetch(`/api/rides/${activeRide.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', cancelReason: 'Cancelado por pasajero' }),
    });
    setActiveRide(null);
    router.push('/app');
  };

  const mins = Math.floor(elapsed / 60), secs = elapsed % 60;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Radar animation */}
      <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 32 }}>
        {[1,2,3].map(i => (
          <motion.div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid ${C.violet}` }}
            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
            transition={{ duration: 2.5, delay: i * 0.8, repeat: Infinity, ease: 'easeOut' }} />
        ))}
        <div style={{ position: 'absolute', inset: 20, borderRadius: '50%', background: C.violet + '22', border: `2px solid ${C.violet}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.violet} strokeWidth="1.5"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="16" r="1"/></svg>
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: '0 0 8px', textAlign: 'center' }}>
        {t('searching')}
      </h2>

      {activeRide && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 20px', marginBottom: 20, width: '100%', maxWidth: 340 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted, marginBottom: 8 }}>
            <span>Solicitud enviada</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: C.cyan }}>{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</span>
          </div>
          <p style={{ fontSize: 13, color: C.text, margin: '0 0 4px' }}>📍 {activeRide.origin_address || 'Tu ubicación'}</p>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>🏁 {activeRide.destination_address || 'Destino'}</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: C.violet, margin: '10px 0 0', fontFamily: 'JetBrains Mono, monospace' }}>
            ${activeRide.proposed_price} MXN
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.p key={stepIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          style={{ fontSize: 13, color: C.muted, marginBottom: 32, textAlign: 'center' }}>
          {STEPS[stepIdx]}
        </motion.p>
      </AnimatePresence>

      <button onClick={handleCancel} style={{ background: 'transparent', border: `1px solid rgba(239,68,68,0.3)`, color: '#ef4444', padding: '10px 28px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        {t('cancel_ride')}
      </button>

      <BottomNav role="passenger" />
    </div>
  );
}
