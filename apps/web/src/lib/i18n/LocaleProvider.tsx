'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { dictionaries, type Dict, type Locale } from './dictionaries';

const STORAGE_KEY = 'rm:locale:v1';

interface LocaleCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
}

const Ctx = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');

  // Hidratar desde localStorage en mount
  useEffect(() => {
    try {
      const stored = (typeof window !== 'undefined'
        ? window.localStorage.getItem(STORAGE_KEY)
        : null) as Locale | null;
      if (stored === 'es' || stored === 'en') {
        setLocaleState(stored);
      } else {
        // Auto-detect: si navegador es español → es, si no → en (default es para MX)
        const navLang = (typeof navigator !== 'undefined' ? navigator.language : 'es').slice(0, 2);
        setLocaleState(navLang === 'en' ? 'en' : 'es');
      }
    } catch {}
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.setAttribute('lang', l);
    } catch {}
  }, []);

  // Mantener el atributo lang del <html> en sync
  useEffect(() => {
    try {
      document.documentElement.setAttribute('lang', locale);
    } catch {}
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('useLocale debe usarse dentro de <LocaleProvider>');
  }
  return ctx;
}

export function useT(): Dict {
  return useLocale().t;
}
