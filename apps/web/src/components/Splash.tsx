'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { IconCar } from '@/components/rm-icons';

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
      <div className="rm-splash__collage" aria-hidden>
        <img src="/brand/hero.jpg" alt="" className="rm-splash__tile rm-splash__tile--a" />
        <img src="/brand/app.jpg" alt="" className="rm-splash__tile rm-splash__tile--b" />
        <img src="/brand/driver.jpg" alt="" className="rm-splash__tile rm-splash__tile--c" />
      </div>
      <div className="rm-splash__scrim" />
      <div className="rm-splash__mark">
        <div className="rm-splash__glow">
          <IconCar size={28} />
        </div>
        <span className="text-2xl font-bold tracking-tight">RideMe</span>
      </div>
    </div>
  );
}
