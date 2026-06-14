import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const nav = [
  { href: '/admin',             label: 'C4 Centro',       emoji: '⚡' },
  { href: '/admin/rides',        label: 'Viajes',          emoji: '🚗' },
  { href: '/admin/drivers',      label: 'Choferes',        emoji: '👨‍✈️' },
  { href: '/admin/users',        label: 'Usuarios',        emoji: '👥' },
  { href: '/admin/invitations',  label: 'Invitaciones',    emoji: '✉️' },
  { href: '/admin/support',      label: 'Soporte',         emoji: '💬' },
  { href: '/admin/branding',     label: 'Branding',        emoji: '🎨' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin();
  if (!admin) redirect("/");
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#03020a', color: '#f8f7ff' }}>
      <aside style={{ width: 200, flexShrink: 0, borderRight: '1px solid rgba(124,58,237,0.18)', background: '#0a0814', display: 'flex', flexDirection: 'column', padding: '16px 10px', gap: 2 }} className="hidden md:flex">
        <div style={{ padding: '8px 12px 20px', borderBottom: '1px solid rgba(124,58,237,0.18)', marginBottom: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#22d3ee', margin: 0 }}>RideMe</p>
          <p style={{ fontSize: 10, color: '#9891c4', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Admin</p>
        </div>
        {nav.map(({ href, label, emoji }) => (
          <Link key={href} href={href}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#9891c4', textDecoration: 'none', transition: 'all 0.15s' }}
            className="hover:bg-[rgba(124,58,237,0.12)] hover:text-white">
            <span style={{ fontSize: 15 }}>{emoji}</span>{label}
          </Link>
        ))}
      </aside>
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <header style={{ display: 'flex', gap: 8, overflowX: 'auto', borderBottom: '1px solid rgba(124,58,237,0.18)', background: '#0a0814', padding: '10px 12px' }} className="md:hidden">
          {nav.map(({ href, label }) => (
            <Link key={href} href={href} style={{ fontSize: 12, color: '#9891c4', whiteSpace: 'nowrap', padding: '4px 10px', borderRadius: 6, textDecoration: 'none' }}>{label}</Link>
          ))}
        </header>
        {children}
      </div>
    </div>
  );
}
