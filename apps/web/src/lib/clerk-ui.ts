/** Clerk appearance — RideMe tokens v0 (obsidiana + mint). Locale ES en layout. */
import { esMX } from '@clerk/localizations';
import type { LocalizationResource } from '@clerk/types';

export const clerkLocalization = {
  ...esMX,
  signIn: {
    ...esMX.signIn,
    start: {
      ...esMX.signIn?.start,
      title: 'Entra a RideMe',
      subtitle: 'Bienvenido. Inicia sesión para continuar.',
    },
  },
  signUp: {
    ...esMX.signUp,
    start: {
      ...esMX.signUp?.start,
      title: 'Crea tu cuenta RideMe',
      subtitle: 'Viaja en toda la República. Tú propones el precio.',
    },
  },
} as LocalizationResource;

export const clerkAppearance = {
  layout: {
    logoPlacement: 'none' as const,
    socialButtonsPlacement: 'bottom' as const,
    unsafe_disableDevelopmentModeWarnings: true,
  },
  variables: {
    colorBackground: '#121218',
    colorPrimary: '#00E5A8',
    colorText: '#FFFFFF',
    colorTextSecondary: 'rgba(255, 255, 255, 0.82)',
    colorInputBackground: '#1A1A22',
    colorInputText: '#FFFFFF',
    colorNeutral: '#FFFFFF',
    borderRadius: '12px',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  elements: {
    rootBox: 'w-full max-w-[400px] flex justify-center',
    card: 'rm-auth__card bg-[#121218] border border-white/10 shadow-2xl w-full',
    headerTitle: 'text-white',
    headerSubtitle: 'text-white/80',
    socialButtonsBlockButton: 'border-white/10 text-white',
    dividerLine: 'bg-white/10',
    dividerText: 'text-white/55',
    formFieldLabel: 'text-white/80',
    formFieldInput: 'min-h-12',
    formButtonPrimary:
      'bg-[#00E5A8] text-[#0A0A0C] hover:bg-[#00C992] normal-case font-semibold min-h-12',
    footerActionText: 'text-white/55',
    footerActionLink: 'text-[#00E5A8] hover:text-[#00C992]',
    /* Minimiza «Secured by Clerk» / links clerk.com (dev + prod) */
    footer: 'hidden',
    footerPages: 'hidden',
    footerPagesLink: 'hidden',
    logoBox: 'hidden',
    logoImage: 'hidden',
  },
};
