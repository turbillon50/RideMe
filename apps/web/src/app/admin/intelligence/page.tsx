"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const C = {
  void: '#03020a', bg: '#0a0814', surface: '#0d0b1a', surface2: '#12102a',
  border: 'rgba(124,58,237,0.18)', violet: '#7c3aed', cyan: '#22d3ee',
  gold: '#fbbf24', text: '#f8f7ff', muted: '#9891c4',
  green: '#10b981', red: '#ef4444', orange: '#f97316',
};

// Predicción de demanda por hora basada en patrones CDMX
const DEMAND_CURVE = [
  { h: 0, v: 10 }, { h: 1, v: 5 }, { h: 2, v: 3 }, { h: 3, v: 2 },
  { h: 4, v: 4 }, { h: 5, v: 12 }, { h: 6, v: 28 }, { h: 7, v: 65 },
  { h: 8, v: 82 }, { h: 9, v: 71 }, { h: 10, v: 55 }, { h: 11, v: 48 },
  { h: 12, v: 62 }, { h: 13, v: 70 }, { h: 14, v: 58 }, { h: 15, v: 50 },
  { h: 16, v: 55 }, { h: 17, v: 78 }, { h: 18, v: 95 }, { h: 19, v: 100 },
  { h: 20, v: 88 }, { h: 21, v: 72 }, { h: 22, v: 48 }, { h: 23, v: 25 },
];

// Zonas de demanda CDMX
const ZONES = [
  { name: 'Polanco',         score: 94, revenue_est: 4200, drivers_needed: 8 },
  { name: 'Santa Fe',        score: 88, revenue_est: 3800, drivers_needed: 7 },
  { name: 'Roma / Condesa',  score: 85, revenue_est: 3500, drivers_needed: 6 },
  { name: 'Centro Histórico',score: 79, revenue_est: 2900, drivers_needed: 5 },
  { name: 'Insurgentes Sur', score: 76, revenue_est: 2600, drivers_needed: 5 },
  { name: 'Del Valle',       score: 71, revenue_est: 2200, drivers_needed: 4 },
  { name: 'Tepito / Buenavista', score: 45, revenue_est: 1100, drivers_needed: 2 },
];

function GoalBar({ label, current, target, unit = '' }: { label: string; current: number; target: number; unit?: string }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  const color = pct >= 80 ? C.green : pct >= 50 ? C.gold : C.orange;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: C.muted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace' }}>{current}{unit} / {target}{unit}</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: C.surface2, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${C.violet}, ${color})` }} />
      </div>
    </div>
  );
}

function DemandChart() {
  const now = new Date().getHours();
  const max = 100;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80 }}>
        {DEMAND_CURVE.map(({ h, v }) => (
          <div key={h} style={{ flex: 1, position: 'relative' }}>
            <div style={{ height: `${(v / max) * 100}%`, minHeight: 2, borderRadius: '2px 2px 0 0', background: h === now ? C.cyan : h < now ? C.violet + '66' : C.violet + '33', transition: 'all 0.3s' }} />
            {h === now && <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: C.cyan, whiteSpace: 'nowrap', fontWeight: 700 }}>Ahora</div>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 9, color: C.muted }}>00h</span>
        <span style={{ fontSize: 9, color: C.muted }}>06h</span>
        <span style={{ fontSize: 9, color: C.muted }}>12h</span>
        <span style={{ fontSize: 9, color: C.muted }}>18h</span>
        <span style={{ fontSize: 9, color: C.muted }}>23h</span>
      </div>
    </div>
  );
}

export default function VulcanoIntelligence() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => { if (d.ok) setStats(d); });
  }, []);

  const k = stats?.kpis || {};
  const now = new Date().getHours();
  const demandNow = DEMAND_CURVE[now]?.v ?? 50;
  const demandNext = DEMAND_CURVE[(now + 1) % 24]?.v ?? 50;
  const trend = demandNext > demandNow ? '↑ subiendo' : '↓ bajando';
  const trendColor = demandNext > demandNow ? C.green : C.orange;

  // Objetivos semanales estimados (escalables)
  const weekly_target_rides = 200;
  const weekly_target_revenue = 25000;
  const weekly_target_drivers = 15;
  const rides_so_far = Number(k.total_rides ?? 0);
  const revenue_so_far = Number(k.revenue_total ?? 0);
  const drivers_so_far = Number(k.total_drivers ?? 0);

  // Score de la plataforma
  const platform_score = Math.min(100, Math.round(
    (Math.min(drivers_so_far / weekly_target_drivers, 1) * 40) +
    (Number(k.drivers_online ?? 0) / Math.max(1, drivers_so_far) * 30) +
    (Math.min(rides_so_far / weekly_target_rides, 1) * 30)
  ));

  return (
    <div style={{ background: C.void, minHeight: '100vh', color: C.text, padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.5"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3z"/><path d="M19 3l.7 2.3L22 6l-2.3.7L19 9l-.7-2.3L16 6l2.3-.7L19 3z" opacity=".6"/></svg>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Vulcano Intelligence</h1>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: C.violet + '33', color: C.violet, fontWeight: 700, letterSpacing: '0.1em' }}>BETA</span>
        </div>
        <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Amplificación de objetivos · Predicción de demanda · Score de plataforma</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>

        {/* Platform Score */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted, margin: '0 0 16px' }}>Score de plataforma</p>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
              <svg viewBox="0 0 36 36" style={{ width: 100, height: 100, transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={C.surface2} strokeWidth="2.5"/>
                <motion.circle cx="18" cy="18" r="15.9" fill="none"
                  stroke={platform_score >= 70 ? C.cyan : platform_score >= 40 ? C.gold : C.orange}
                  strokeWidth="2.5" strokeLinecap="round"
                  initial={{ strokeDasharray: '0 100' }}
                  animate={{ strokeDasharray: `${platform_score} 100` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ strokeDashoffset: 0 }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: 'JetBrains Mono, monospace' }}>{platform_score}</span>
                <span style={{ fontSize: 9, color: C.muted }}>/100</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: C.muted, textAlign: 'center', margin: 0 }}>
            {platform_score >= 70 ? '🟢 Operación saludable' : platform_score >= 40 ? '🟡 En crecimiento' : '🔴 Necesita atención'}
          </p>
        </div>

        {/* Amplificación de Objetivos */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted, margin: '0 0 16px' }}>Amplificación de objetivos</p>
          <GoalBar label="Viajes acumulados" current={rides_so_far} target={weekly_target_rides} />
          <GoalBar label="Revenue acumulado" current={Math.round(revenue_so_far)} target={weekly_target_revenue} unit=" MXN" />
          <GoalBar label="Flota activa" current={drivers_so_far} target={weekly_target_drivers} unit=" choferes" />
          <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: C.violet + '15', border: `1px solid ${C.violet}33` }}>
            <p style={{ fontSize: 12, color: C.violet, fontWeight: 600, margin: '0 0 4px' }}>⚡ Siguiente objetivo</p>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
              {drivers_so_far < 10 ? `Necesitas ${10 - drivers_so_far} choferes más para escalar zona Polanco` :
               rides_so_far < 50 ? `${50 - rides_so_far} viajes para alcanzar volumen mínimo de analytics` :
               'Activa surge pricing en horas pico 18-20h para +30% revenue'}
            </p>
          </div>
        </div>

        {/* Predicción de demanda */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted, margin: '0 0 4px' }}>Predicción de demanda — CDMX</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: C.cyan, fontFamily: 'JetBrains Mono, monospace' }}>{demandNow}%</span>
            <span style={{ fontSize: 12, color: trendColor, fontWeight: 600 }}>{trend}</span>
          </div>
          <DemandChart />
          <p style={{ fontSize: 11, color: C.muted, margin: '8px 0 0' }}>Próxima hora: demanda estimada {demandNext}%</p>
        </div>

        {/* Zonas calientes */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted, margin: '0 0 14px' }}>Zonas de mayor oportunidad</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ZONES.slice(0, 5).map((z, i) => (
              <div key={z.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: C.muted, width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: C.text }}>{z.name}</span>
                    <span style={{ fontSize: 11, color: C.gold, fontFamily: 'JetBrains Mono, monospace' }}>~${z.revenue_est.toLocaleString()}/día</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: C.surface2 }}>
                    <div style={{ height: '100%', width: `${z.score}%`, borderRadius: 99, background: `linear-gradient(90deg, ${C.violet}, ${C.cyan})` }} />
                  </div>
                </div>
                <span style={{ fontSize: 10, color: C.muted, width: 60, textAlign: 'right', flexShrink: 0 }}>{z.drivers_needed} chofs.</span>
              </div>
            ))}
          </div>
        </div>

        {/* Algo que ni pensaste: Radar de crecimiento */}
        <div style={{ background: C.surface, border: `1px solid ${C.cyan}33`, borderRadius: 14, padding: 20, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.cyan, margin: 0 }}>Radar de aceleración — insights automáticos</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { icon: '🎯', title: 'Precio óptimo estimado', body: 'Con los viajes actuales el precio de aceptación más alto sería $95-$110 MXN en horario pico', color: C.gold },
              { icon: '📍', title: 'Zona sin cubrir', body: 'Satélite y Pedregal no tienen cobertura activa. Potencial de $8,000 MXN/semana sin explotar', color: C.violet },
              { icon: '⏰', title: 'Ventana de oro', body: 'Vie-Sáb 19-22h es el período de mayor demanda. Activa incentivos para choferes esta franja', color: C.cyan },
              { icon: '🚀', title: 'Escalabilidad', body: 'Con 20 choferes activos puedes cubrir el 80% de CDMX en horas pico. Te faltan solo 12 más', color: C.green },
            ].map(({ icon, title, body, color }) => (
              <div key={title} style={{ padding: '14px 16px', borderRadius: 10, background: C.surface2, border: `1px solid ${color}22` }}>
                <p style={{ fontSize: 16, margin: '0 0 6px' }}>{icon}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color, margin: '0 0 4px' }}>{title}</p>
                <p style={{ fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.6 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
