'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { IconLightning } from '@/components/rm-icons';
import { CollagePhones } from '@/components/layout/CollagePhones';

export function Splash() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('rm-splash') === '1') {
        setVisible(false);
        return;
      }
    } catch {
      /* ignore */
    }

    if (reduce) {
      setVisible(false);
      try {
        sessionStorage.setItem('rm-splash', '1');
      } catch {
        /* ignore */
      }
      return;
    }

    const hold = window.setTimeout(() => setExiting(true), 900);
    const done = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem('rm-splash', '1');
      } catch {
        /* ignore */
      }
    }, 1250);
    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(done);
    };
  }, [reduce]);

  if (!visible) return null;

  return (
    <div className={`rm-splash${exiting ? ' is-exit' : ''}`} role="status" aria-label="RideMe">
      <div className="rm-splash__phones" aria-hidden>
        <CollagePhones />
      </div>
      <div className="rm-splash__scrim" />
      <div className="rm-splash__mark">
        <div className="rm-splash__glow">
          <IconLightning size={28} />
        </div>
        <span className="text-2xl font-bold tracking-tight">RideMe</span>
      </div>
    </div>
  );
}
