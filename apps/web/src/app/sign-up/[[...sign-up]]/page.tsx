import { SignUp } from '@clerk/nextjs';

const appearance = {
  variables: {
    colorBackground: '#101526',
    colorPrimary: '#93AECE',
    colorText: '#E8EDF4',
    colorTextSecondary: '#8A94A6',
    colorInputBackground: '#161C2C',
    colorInputText: '#E8EDF4',
    colorNeutral: '#E8EDF4',
    borderRadius: '0.9rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    card: 'bg-[#101526] border border-white/10 shadow-2xl',
    headerTitle: 'text-[#E8EDF4]',
    headerSubtitle: 'text-[#8A94A6]',
    socialButtonsBlockButton: 'border-white/10 text-[#E8EDF4]',
    dividerLine: 'bg-white/10',
    dividerText: 'text-[#8A94A6]',
    formFieldLabel: 'text-[#8A94A6]',
    formButtonPrimary: 'bg-[#E8E4DA] text-[#141820] normal-case hover:brightness-105',
    footerActionText: 'text-[#8A94A6]',
    footerActionLink: 'text-[#93AECE]',
    footerAction__usePasskey: 'hidden',
  },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070A14] px-4 py-10">
      <SignUp appearance={appearance} signInUrl="/sign-in" fallbackRedirectUrl="/app" />
    </div>
  );
}
