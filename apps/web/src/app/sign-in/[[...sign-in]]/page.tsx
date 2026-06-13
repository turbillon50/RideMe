import { SignIn } from '@clerk/nextjs';

const appearance = {
  variables: {
    colorBackground: '#0d0b1a',
    colorPrimary: '#6C63FF',
    colorText: '#ffffff',
    colorTextSecondary: '#9ca3af',
    colorInputBackground: '#15131f',
    colorInputText: '#ffffff',
    colorNeutral: '#ffffff',
    borderRadius: '1rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    card: 'bg-[#0d0b1a] border border-white/10 shadow-2xl',
    headerTitle: 'text-white',
    headerSubtitle: 'text-white/50',
    socialButtonsBlockButton: 'border-white/10 text-white',
    dividerLine: 'bg-white/10',
    dividerText: 'text-white/40',
    formFieldLabel: 'text-white/70',
    formButtonPrimary: 'bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] text-white normal-case',
    footerActionText: 'text-white/50',
    footerActionLink: 'text-[#6C63FF] hover:text-[#00D4AA]',
  },
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] px-4 py-10">
      <SignIn appearance={appearance} signUpUrl="/sign-up" fallbackRedirectUrl="/app" />
    </div>
  );
}
