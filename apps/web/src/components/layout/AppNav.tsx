'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome, IconProfile, IconTrips } from '@/components/rm-icons';

const items = [
  { href: '/app', icon: IconHome, label: 'Viajar' },
  { href: '/app/history', icon: IconTrips, label: 'Viajes' },
  { href: '/app/profile', icon: IconProfile, label: 'Tú' },
];

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="rm-nav" aria-label="RideMe">
      {items.map((item) => {
        const on =
          item.href === '/app'
            ? pathname === '/app' || pathname.startsWith('/app/offers') || pathname.startsWith('/app/trip')
            : pathname === item.href || pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className={on ? 'is-on' : undefined}>
            <Icon size={22} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
