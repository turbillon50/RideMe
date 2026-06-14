'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── types ────────────────────────────────────────────────────────────────────
interface Kpis {
  rides_today: number; rides_active: number; drivers_online: number;
  drivers_pending: number; total_drivers: number; total_users: number;
  new_users_30d: number; total_rides: number; rides_completed: number;
  rides_canceled: number; revenue_30d: number; revenue_total: number; avg_ticket: number;
}
interface Ride { id: string; status: string; proposed_price: number; final_price: number;
  created_at: string; passenger_name: string; driver_name: string; }
interface Driver { id: string; name: string; email: string; is_online: boolean;
  approval_status: string; rating_average: number; total_trips: number;
  current_latitude: number; current_longitude: number; make: string; model: string; plate_number: string; }
interface DayRide { day: string; rides: number; }
interface Stats { kpis: Kpis; recentRides: Ride[]; ridesByDay: DayRide[]; }

// ─── paleta HUD (inline styles — Tailwind v4 arbitrary classes no generan en prod) ─
const C = {
  void: '#03020a', bg: '#0a0814', surface: '#0d0b1a', surface2: '#12102a',
  border: 'rgba(124,58,237,0.18)', borderCyan: 'rgba(34,211,238,0.18)',
  violet: '#7c3aed', cyan: '#22d3ee', gold: '#fbbf24',
  red: '#ef4444', green: '#10b981',
  textPrimary: '#f8f7ff', textMuted: '#9891c4',
};

// ─── utilidades ───────────────────────────────────────────────────────────────
const mxn = (v: any) => `$${Number(v ?? 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })}`;
const ago = (d: string) => {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
};
const STATUS_COLOR: Record<string, string> = {
  completed: C.green, in_progress: C.cyan, accepted: C.cyan,
  driver_en_route: C.cyan, searching: C.gold, negotiating: C.gold,
  cancelled: C.red, canceled: C.red,
};

// ─── Mapbox static con todos los choferes ─────────────────────────────────────
function CommandMap({ drivers }: { drivers: Driver[] }) {
  const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
  const f = (n: number) => Number(n).toFixed(5);
  const online = drivers.filter((d) => d.is_online && d.current_latitude);
  const offline = drivers.filter((d) => !d.is_online && d.current_latitude);
  const pins = [
    ...online.slice(0, 10).map((d) => `pin-s+10b981(${f(d.current_longitude)},${f(d.current_latitude)})`),
    ...offline.slice(0, 4).map((d) => `pin-s+6b7280(${f(d.current_longitude)},${f(d.current_latitude)})`),
  ];
  const overlay = pins.join(',') || 'pin-s+7c3aed(-99.1332,19.4326)';
  const src = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${overlay}/auto/900x420@2x?padding=60&access_token=${TOKEN}&logo=false&attribution=false`;
  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Mapa de choferes" style={{ width: '100%', display: 'block', minHeight: 200 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,2,10,0.7) 0%, transparent 50%)' }} />
      <div style={{ position: 'absolute', bottom: 12, left: 14, display: 'flex', gap: 16, fontSize: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.green }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, display: 'inline-block' }} /> En línea ({online.length})
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.textMuted }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} /> Desconectados ({offline.length})
        </span>
      </div>
    </div>
  );
}

// ─── KPI Card animado ─────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent, icon }: { label: string; value: string; sub?: string; accent?: 'violet' | 'cyan' | 'gold'; icon: string }) {
  const accentColor = accent === 'cyan' ? C.cyan : accent === 'gold' ? C.gold : accent === 'violet' ? C.violet : C.textMuted;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: C.surface, border: `1px solid ${accent ? accentColor + '33' : C.border}`, borderRadius: 12, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent ? `linear-gradient(90deg, ${accentColor}88, transparent)` : 'transparent' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textMuted, margin: 0 }}>{label}</p>
        <div style={{ width:24,height:24,borderRadius:7,background:accentColor+"22",display:"flex",alignItems:"center",justifyContent:"center" }}><div style={{ width:5,height:5,borderRadius:"50%",background:accentColor }} /></div>
      </div>
      <p style={{ fontSize: 26, fontWeight: 700, color: accent ? accentColor : C.textPrimary, margin: 0, fontFamily: 'JetBrains Mono, monospace' }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{sub}</p>}
    </motion.div>
  );
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function SparkBar({ data }: { data: DayRide[] }) {
  const max = Math.max(1, ...data.map((d) => Number(d.rides)));
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
      <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textMuted, margin: '0 0 12px' }}>Viajes — últimos 14 días</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 64 }}>
        {data.map((d, i) => (
          <div key={d.day} title={`${new Date(d.day).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}: ${d.rides}`}
            style={{ flex: 1, borderRadius: 3, background: i === data.length - 1 ? C.cyan : C.violet + '99', transition: 'height 0.4s', height: `${(Number(d.rides) / max) * 100}%`, minHeight: 3 }} />
        ))}
        {!data.length && <p style={{ color: C.textMuted, fontSize: 12 }}>Sin datos</p>}
      </div>
    </div>
  );
}

// ─── Notification broadcaster ─────────────────────────────────────────────────
function NotifSender() {
  const [msg, setMsg] = useState('');
  const [target, setTarget] = useState<'all' | 'drivers' | 'passengers'>('all');
  const [sent, setSent] = useState(false);
  const send = () => { if (!msg) return; setSent(true); setMsg(''); setTimeout(() => setSent(false), 3000); };
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.borderCyan}`, borderRadius: 12, padding: '16px 18px' }}>
      <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.cyan, margin: '0 0 12px' }}>📡 Broadcast</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {(['all', 'drivers', 'passengers'] as const).map((t) => (
          <button key={t} onClick={() => setTarget(t)}
            style={{ flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${target === t ? C.cyan : C.border}`, background: target === t ? C.cyan + '22' : 'transparent', color: target === t ? C.cyan : C.textMuted, transition: 'all 0.15s' }}>
            {t === 'all' ? 'Todos' : t === 'drivers' ? 'Choferes' : 'Pasajeros'}
          </button>
        ))}
      </div>
      <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Escribe el mensaje…"
        rows={2} style={{ width: '100%', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textPrimary, fontSize: 13, padding: '8px 10px', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
      <button onClick={send} style={{ marginTop: 8, width: '100%', padding: '8px 0', borderRadius: 8, background: sent ? C.green + '33' : `linear-gradient(135deg, ${C.violet}, ${C.cyan})`, border: 'none', color: C.textPrimary, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
        {sent ? '✓ Enviado' : 'Enviar notificación'}
      </button>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const color = STATUS_COLOR[status] ?? C.textMuted;
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 99, background: color + '22', color, border: `1px solid ${color}44` }}>{status.replace(/_/g, ' ')}</span>;
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminC4() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [tick, setTick] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [sRes, dRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/drivers?limit=50'),
      ]);
      const [s, d] = await Promise.all([sRes.json(), dRes.json()]);
      if (s.ok) setStats(s);
      if (d.ok) setDrivers(d.drivers ?? []);
      setLastRefresh(new Date());
    } catch { /* silent */ }
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const id = setInterval(() => { setTick((t) => t + 1); load(); }, 30_000);
    return () => clearInterval(id);
  }, [load]);

  const k = stats?.kpis;
  const online = drivers.filter((d) => d.is_online);
  const offline = drivers.filter((d) => !d.is_online);

  return (
    <div style={{ background: C.void, minHeight: '100vh', color: C.textPrimary, fontFamily: 'Inter, system-ui, sans-serif', padding: '0 0 40px' }}>

      {/* ── Header ── */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bg, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.cyan }}>RideMe</span>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', color: C.textMuted, textTransform: 'uppercase' }}>C4 Command Center</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: C.textMuted }}>
            Actualizado {lastRefresh.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <button onClick={load} disabled={refreshing}
            style={{ padding: '5px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: refreshing ? C.violet + '22' : 'transparent', color: C.violet, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            {refreshing ? '⟳ Cargando…' : '↻ Refresh'}
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── KPI row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          <KpiCard icon="🚗" label="Viajes hoy"         value={String(k?.rides_today ?? 0)}    accent="violet" />
          <KpiCard icon="⚡" label="Activos ahora"      value={String(k?.rides_active ?? 0)}   accent="cyan" />
          <KpiCard icon="🟢" label="Choferes en línea"  value={`${k?.drivers_online ?? 0} / ${k?.total_drivers ?? 0}`} accent="cyan" sub={`${k?.drivers_pending ?? 0} por aprobar`} />
          <KpiCard icon="👥" label="Usuarios"            value={String(k?.total_users ?? 0)}    sub={`+${k?.new_users_30d ?? 0} este mes`} />
          <KpiCard icon="💰" label="Ingresos 30d"        value={mxn(k?.revenue_30d)}             accent="gold" sub={`Total ${mxn(k?.revenue_total)}`} />
          <KpiCard icon="🎯" label="Ticket promedio"     value={mxn(k?.avg_ticket)}              sub={`${k?.rides_completed ?? 0} completados · ${k?.rides_canceled ?? 0} cancelados`} />
        </div>

        {/* ── Mapa + Broadcast ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.textMuted, margin: '0 0 8px' }}>Cobertura en tiempo real — CDMX</p>
            <CommandMap drivers={drivers} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <NotifSender />
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', flex: 1 }}>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textMuted, margin: '0 0 10px' }}>Estado de flota</p>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: C.green, margin: 0, fontFamily: 'JetBrains Mono, monospace' }}>{online.length}</p>
                  <p style={{ fontSize: 10, color: C.textMuted, margin: 0 }}>en línea</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: C.textMuted, margin: 0, fontFamily: 'JetBrains Mono, monospace' }}>{offline.length}</p>
                  <p style={{ fontSize: 10, color: C.textMuted, margin: 0 }}>offline</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
                {online.slice(0, 8).map((d) => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: C.textPrimary, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</span>
                    <span style={{ fontSize: 10, color: C.textMuted }}>★{Number(d.rating_average).toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Rides feed + Revenue ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>

          {/* Live rides */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.cyan, boxShadow: `0 0 6px ${C.cyan}` }} />
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textMuted, margin: 0 }}>Feed de viajes — live</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {['Pasajero', 'Chofer', 'Precio', 'Estado', 'Hace'].map((h) => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.textMuted, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {(stats?.recentRides ?? []).map((r) => (
                      <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: '9px 12px', color: C.textPrimary }}>{r.passenger_name ?? '—'}</td>
                        <td style={{ padding: '9px 12px', color: C.textMuted }}>{r.driver_name ?? '—'}</td>
                        <td style={{ padding: '9px 12px', color: C.gold, fontFamily: 'JetBrains Mono, monospace' }}>{mxn(r.final_price ?? r.proposed_price)}</td>
                        <td style={{ padding: '9px 12px' }}><StatusPill status={r.status} /></td>
                        <td style={{ padding: '9px 12px', color: C.textMuted }}>{ago(r.created_at)}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {!stats?.recentRides?.length && (
                    <tr><td colSpan={5} style={{ padding: '20px 12px', textAlign: 'center', color: C.textMuted, fontSize: 12 }}>Sin viajes aún — en espera de actividad…</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue chart + Choferes pendientes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SparkBar data={stats?.ridesByDay ?? []} />

            {/* Choferes por aprobar */}
            <div style={{ background: C.surface, border: `1px solid ${C.borderCyan}`, borderRadius: 12, padding: '14px 16px', flex: 1 }}>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.cyan, margin: '0 0 10px' }}>🕐 Por aprobar</p>
              {drivers.filter((d) => d.approval_status === 'pending').length === 0 ? (
                <p style={{ fontSize: 12, color: C.textMuted }}>Ninguno pendiente ✓</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {drivers.filter((d) => d.approval_status === 'pending').map((d) => (
                    <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: 12, color: C.textPrimary, margin: 0 }}>{d.name}</p>
                        <p style={{ fontSize: 10, color: C.textMuted, margin: 0 }}>{d.email}</p>
                      </div>
                      <a href="/admin/drivers" style={{ fontSize: 10, color: C.cyan, textDecoration: 'none', padding: '3px 10px', border: `1px solid ${C.cyan}44`, borderRadius: 6 }}>Ver →</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabla completa de choferes ── */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textMuted, margin: 0 }}>Flota completa</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Estado', 'Chofer', 'Vehículo', 'Placa', 'Rating', 'Viajes', 'Aprobación'].map((h) => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.textMuted, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drivers.map((d) => (
                  <tr key={d.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '9px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.is_online ? C.green : '#6b7280', flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: d.is_online ? C.green : C.textMuted }}>{d.is_online ? 'en línea' : 'offline'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '9px 12px' }}>
                      <p style={{ margin: 0, color: C.textPrimary, fontWeight: 600 }}>{d.name}</p>
                      <p style={{ margin: 0, color: C.textMuted, fontSize: 10 }}>{d.email}</p>
                    </td>
                    <td style={{ padding: '9px 12px', color: C.textMuted }}>{d.make ? `${d.make} ${d.model}` : '—'}</td>
                    <td style={{ padding: '9px 12px', color: C.cyan, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{d.plate_number ?? '—'}</td>
                    <td style={{ padding: '9px 12px', color: C.gold, fontFamily: 'JetBrains Mono, monospace' }}>★ {Number(d.rating_average).toFixed(2)}</td>
                    <td style={{ padding: '9px 12px', color: C.textPrimary, fontFamily: 'JetBrains Mono, monospace' }}>{d.total_trips}</td>
                    <td style={{ padding: '9px 12px' }}><StatusPill status={d.approval_status} /></td>
                  </tr>
                ))}
                {!drivers.length && (
                  <tr><td colSpan={7} style={{ padding: '20px 12px', textAlign: 'center', color: C.textMuted }}>Cargando flota…</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
