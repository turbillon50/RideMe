'use client';

import { ReactNode, useEffect } from 'react';

export type BrandingConfig = {
  app_name: string;
  primary_color: string;
  accent_color: string;
  logo_url: string;
  icon_url: string;
  theme: 'dark' | 'light';
};

const DEFAULT_BRANDING: BrandingConfig = {
  app_name: 'RideMe',
  primary_color: '#00E5A8',
  accent_color: '#00E5A8',
  logo_url: '/brand/icon-192.png',
  icon_url: '/brand/icon-192.png',
  theme: 'dark',
};

function readCookie(name: string) {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.split('=')[1];
}

export function applyTheme(theme: 'dark' | 'light') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
  localStorage.setItem('rideme_theme', theme);
  document.cookie = `rideme_theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

export function applyBranding(_branding: BrandingConfig) {
  const root = document.documentElement;
  const mint = '#00E5A8';
  // Ley visual Luis: mint único. Nunca purple / dual-gradient.
  root.style.setProperty('--brand-primary', mint);
  root.style.setProperty('--brand-accent', mint);
  root.style.setProperty('--accent', mint);
  root.style.setProperty('--secondary', mint);
  root.style.setProperty('--gradient-cta', mint);
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('rideme_theme') || readCookie('rideme_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme);
    }

    let cancelled = false;
    fetch('/api/branding', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const branding = { ...DEFAULT_BRANDING, ...(data.branding ?? {}) } as BrandingConfig;
        applyBranding(branding);
        const preferred = localStorage.getItem('rideme_theme') || readCookie('rideme_theme') || branding.theme;
        applyTheme(preferred === 'light' ? 'light' : 'dark');
      })
      .catch(() => {
        if (!cancelled) applyBranding(DEFAULT_BRANDING);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
