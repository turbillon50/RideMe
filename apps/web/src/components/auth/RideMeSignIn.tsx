'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';
import { IconLightning, IconEye, IconEyeOff } from '@/components/rm-icons';

function clerkMessage(err: unknown): string {
  const e = err as { errors?: { longMessage?: string; message?: string; code?: string }[] };
  const first = e?.errors?.[0];
  const msg = first?.longMessage || first?.message || '';
  const code = first?.code || '';
  if (/form_password|password|contrase/i.test(`${code} ${msg}`)) {
    return 'Correo o contraseña incorrectos.';
  }
  if (/identifier|not_found|couldn't find|no encontr/i.test(`${code} ${msg}`)) {
    return 'No encontramos esa cuenta.';
  }
  if (/rate|too many/i.test(`${code} ${msg}`)) {
    return 'Demasiados intentos. Espera un momento.';
  }
  return msg || 'No se pudo iniciar sesión. Inténtalo de nuevo.';
}

export function RideMeSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = useMemo(() => {
    const next = params.get('redirect_url') || params.get('redirect') || '/app';
    return next.startsWith('/') ? next : '/app';
  }, [params]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isLoaded || !signIn) {
      setError('Cargando… intenta de nuevo en un segundo.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signIn.create({ identifier: email.trim(), password });
      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.push(redirect);
        return;
      }
      if (result.status === 'needs_first_factor') {
        const attempt = await signIn.attemptFirstFactor({ strategy: 'password', password });
        if (attempt.status === 'complete' && attempt.createdSessionId) {
          await setActive({ session: attempt.createdSessionId });
          router.push(redirect);
          return;
        }
      }
      setError('Completa el siguiente paso para entrar.');
    } catch (err) {
      setError(clerkMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="rm-auth">
      <form className="rm-auth__card rm-enter" onSubmit={onSubmit} noValidate>
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="rm-splash__glow rm-glow-pulse mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--rm-accent)] text-[var(--rm-cta-fg)]">
            <IconLightning size={22} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Entra a RideMe</h1>
          <p className="mt-1 text-sm text-[var(--rm-text-3)]">Bienvenido. Inicia sesión para continuar.</p>
        </div>

        <label className="rm-auth__label" htmlFor="rm-email">
          Correo electrónico
        </label>
        <input
          id="rm-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className="rm-auth__input"
        />

        <label className="rm-auth__label mt-3" htmlFor="rm-password">
          Contraseña
        </label>
        <div className="rm-auth__pw">
          <input
            id="rm-password"
            name="password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            className="rm-auth__input pr-12"
          />
          <button
            type="button"
            className="rm-auth__eye"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {show ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-[var(--rm-error)]">{error}</p> : null}

        <button type="submit" className="rm-btn rm-btn--primary rm-btn--block rm-btn--lg mt-5" disabled={loading}>
          {loading ? 'Entrando…' : 'Continuar'}
        </button>

        <p className="mt-5 text-center text-sm text-[var(--rm-text-3)]">
          ¿No tienes cuenta?{' '}
          <Link href="/sign-up" className="font-semibold text-[var(--rm-accent)]">
            Regístrate
          </Link>
        </p>
      </form>
    </main>
  );
}
