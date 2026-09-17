'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
import { IconCar, IconEye, IconEyeOff } from '@/components/rm-icons';

function clerkMessage(err: unknown): string {
  const e = err as { errors?: { longMessage?: string; message?: string; code?: string }[] };
  const first = e?.errors?.[0];
  const msg = first?.longMessage || first?.message || '';
  const code = first?.code || '';
  if (/password/i.test(`${code} ${msg}`)) return 'La contraseña no cumple los requisitos.';
  if (/identifier|email|exists|taken/i.test(`${code} ${msg}`)) {
    return 'Ese correo ya está registrado o no es válido.';
  }
  return msg || 'No se pudo crear la cuenta. Inténtalo de nuevo.';
}

export function RideMeSignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = useMemo(() => {
    const next = params.get('redirect_url') || params.get('redirect') || '/app';
    return next.startsWith('/') ? next : '/app';
  }, [params]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [verify, setVerify] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const finish = async (sessionId: string | null) => {
    if (!sessionId || !setActive) return;
    await setActive({ session: sessionId });
    router.push(redirect);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isLoaded || !signUp) return;
    setLoading(true);
    setError('');
    try {
      if (!verify) {
        const created = await signUp.create({ emailAddress: email.trim(), password });
        if (created.status === 'complete' && created.createdSessionId) {
          await finish(created.createdSessionId);
          return;
        }
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setVerify(true);
        return;
      }
      const attempted = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (attempted.status === 'complete' && attempted.createdSessionId) {
        await finish(attempted.createdSessionId);
        return;
      }
      setError('No se pudo verificar el código.');
    } catch (err) {
      setError(clerkMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="rm-auth">
      <form className="rm-auth__card" onSubmit={onSubmit} noValidate>
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--rm-accent)] text-[var(--rm-cta-fg)]">
            <IconCar size={22} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Crea tu cuenta RideMe</h1>
          <p className="mt-1 text-sm text-[var(--rm-text-3)]">
            {verify ? 'Te enviamos un código a tu correo.' : 'Viaja en toda la República. Tú propones el precio.'}
          </p>
        </div>

        {!verify ? (
          <>
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
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
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
          </>
        ) : (
          <>
            <label className="rm-auth__label" htmlFor="rm-code">
              Código de verificación
            </label>
            <input
              id="rm-code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6 dígitos"
              className="rm-auth__input"
            />
          </>
        )}

        {error ? <p className="mt-3 text-sm text-[var(--rm-error)]">{error}</p> : null}

        <button type="submit" className="rm-btn rm-btn--primary rm-btn--block rm-btn--lg mt-5" disabled={loading || !isLoaded}>
          {loading ? 'Enviando…' : verify ? 'Verificar' : 'Crear cuenta'}
        </button>

        <p className="mt-5 text-center text-sm text-[var(--rm-text-3)]">
          ¿Ya tienes cuenta?{' '}
          <Link href="/sign-in" className="font-semibold text-[var(--rm-accent)]">
            Inicia sesión
          </Link>
        </p>
      </form>
    </main>
  );
}
