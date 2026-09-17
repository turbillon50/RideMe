'use client';

import { ReactNode } from 'react';

export function RideShell({
  map,
  panel,
  topLeft,
  topRight,
  nav,
}: {
  map: ReactNode;
  panel: ReactNode;
  topLeft?: ReactNode;
  topRight?: ReactNode;
  nav?: ReactNode;
}) {
  return (
    <div className="h-dvh overflow-hidden bg-[var(--rm-bg)] text-[var(--rm-fg)] xl:flex xl:pl-20">
      <div className="relative min-h-0 min-w-0 flex-1">
        <div className="absolute inset-0 xl:static xl:h-full">{map}</div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-3 pt-safe">
          <div className="pointer-events-auto">{topLeft}</div>
          <div className="pointer-events-auto">{topRight}</div>
        </div>
        <section
          aria-label="Panel de viaje"
          className="absolute inset-x-0 bottom-0 z-30 flex max-h-[82vh] flex-col rounded-t-[28px] bg-[var(--rm-sheet)] shadow-[0_-18px_50px_rgba(0,0,0,0.45)] ring-1 ring-[var(--rm-line)] xl:hidden"
        >
          <div className="flex justify-center py-2" aria-hidden>
            <div className="h-1 w-10 rounded-full bg-[var(--rm-line)]" />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-24">
            {panel}
          </div>
        </section>
      </div>
      <aside className="hidden h-full w-[400px] shrink-0 overflow-y-auto border-l border-[var(--rm-line)] bg-[var(--rm-sheet)] px-5 py-5 xl:block">
        {panel}
      </aside>
      {nav}
    </div>
  );
}

export function BrandChip() {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-[var(--rm-sheet)]/90 px-3 py-2 ring-1 ring-[var(--rm-line)] backdrop-blur-md">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--rm-accent)] text-[10px] font-bold text-[var(--rm-accent-fg)]">
        R
      </span>
      <span className="text-sm font-semibold tracking-tight">RideMe</span>
    </div>
  );
}
