"use client";
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

interface Suggestion { id: string; name: string; full_address: string; lat: number; lng: number; }

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSelect?: (s: Suggestion) => void;
  placeholder: string;
  icon?: string;
  savedAddresses?: { label: string; address: string; lat?: number; lng?: number }[];
}

export function AddressInput({ value, onChange, onSelect, placeholder, icon = '📍', savedAddresses }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(async (q: string) => {
    if (!q || q.length < 3) { setSuggestions([]); return; }
    if (!TOKEN) return;
    setLoading(true);
    try {
      const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(q)}&country=mx&language=es&limit=5&access_token=${TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();
      const items = (data.features || []).map((f: any) => ({
        id: f.id,
        name: f.properties.name || f.properties.full_address,
        full_address: f.properties.full_address || f.properties.name,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }));
      setSuggestions(items);
      setOpen(true);
    } catch { setSuggestions([]); }
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange(v);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => search(v), 350);
    if (!v) { setSuggestions([]); setOpen(false); }
  };

  const handleSelect = (s: Suggestion) => {
    onChange(s.full_address);
    setSuggestions([]);
    setOpen(false);
    onSelect?.(s);
  };

  const C = { surface2:'#12102a', border:'rgba(124,58,237,0.2)', text:'#f8f7ff', muted:'#9891c4', violet:'#7c3aed', cyan:'#22d3ee' };

  return (
    <div style={{ position:'relative' }}>
      <div style={{ display:'flex', alignItems:'center', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:12, padding:'11px 14px', gap:10 }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <input value={value} onChange={handleChange} onFocus={() => value.length>=3 && setOpen(true)} placeholder={placeholder}
          style={{ flex:1, background:'none', border:'none', outline:'none', color:C.text, fontSize:14 }} />
        {loading && <div style={{ width:14,height:14,borderRadius:'50%',border:`2px solid ${C.violet}`,borderTopColor:'transparent',animation:'spin 0.8s linear infinite' }} />}
      </div>

      {/* Saved addresses */}
      {!value && savedAddresses && savedAddresses.length > 0 && (
        <div style={{ marginTop:6, display:'flex', gap:6 }}>
          {savedAddresses.map(sa => (
            <button key={sa.label} onClick={() => { onChange(sa.address); onSelect?.({ id:sa.label, name:sa.label, full_address:sa.address, lat:sa.lat||0, lng:sa.lng||0 }); }}
              style={{ display:'flex',alignItems:'center',gap:5,padding:'5px 10px',borderRadius:8,background:'rgba(124,58,237,0.1)',border:`1px solid rgba(124,58,237,0.25)`,color:C.muted,fontSize:12,cursor:'pointer',fontWeight:600 }}>
              {sa.label === 'Casa' ? '🏠' : sa.label === 'Trabajo' ? '💼' : '⭐'} {sa.label}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-4 }}
            style={{ position:'absolute',top:'calc(100% + 4px)',left:0,right:0,background:'#0d0b1a',border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden',zIndex:50,boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
            {suggestions.map(s => (
              <button key={s.id} onClick={() => handleSelect(s)}
                style={{ width:'100%',padding:'12px 14px',background:'none',border:'none',borderBottom:`1px solid ${C.border}`,color:C.text,textAlign:'left',cursor:'pointer',display:'block',fontSize:13,lineHeight:1.4 }}>
                <span style={{ fontWeight:600 }}>{s.name}</span>
                {s.full_address !== s.name && <span style={{ color:C.muted,display:'block',fontSize:11,marginTop:2 }}>{s.full_address}</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
