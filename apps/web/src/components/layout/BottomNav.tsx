'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Map, Clock, History, User,
  LayoutDashboard, DollarSign, CreditCard,
} from 'lucide-react';
import { useT } from '@/lib/i18n/LocaleProvider';

interface NavItem {
  href: string;
  icon: React.ElementType;
  labelKey: keyof ReturnType<typeof useT>;
}

const passengerNav: NavItem[] = [
  { href: '/app',          icon: Map,     labelKey: 'tabRides' },
  { href: '/app/schedule', icon: Clock,   labelKey: 'tabScheduled' },
  { href: '/app/history',  icon: History, labelKey: 'tabHistory' },
  { href: '/app/profile',  icon: User,    labelKey: 'tabProfile' },
];

const driverNav: NavItem[] = [
  { href: '/driver',              icon: LayoutDashboard, labelKey: 'driverDashboard' },
  { href: '/driver/earnings',     icon: DollarSign,      labelKey: 'todayEarnings' },
  { href: '/driver/subscription', icon: CreditCard,      labelKey: 'subscription' },
  { href: '/driver/profile',      icon: User,            labelKey: 'tabProfile' },
];

interface BottomNavProps {
  role?: 'passenger' | 'driver';
}

export function BottomNav({ role = 'passenger' }: BottomNavProps) {
  const pathname = usePathname();
  const t = useT();
  const items = role === 'driver' ? driverNav : passengerNav;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div
        className="backdrop-blur-xl px-2 pb-1 pt-2"
        style={{
          background: 'rgba(255,255,255,0.92)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/app' && item.href !== '/driver' && pathname.startsWith(item.href));
            const Icon = item.icon;
            const label = (t as Record<string, string>)[item.labelKey as string] ?? '';
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors"
              >
                <div className="relative">
                  <Icon
                    size={22}
                    style={{ color: active ? 'var(--brand)' : 'var(--text-muted)' }}
                  />
                  {active && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: 'var(--brand)' }}
                    />
                  )}
                </div>
                <span
                  className="text-[10px] font-semibold transition-colors"
                  style={{ color: active ? 'var(--brand)' : 'var(--text-muted)' }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
