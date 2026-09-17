import { SignUp } from '@clerk/nextjs';

const appearance = {
  variables: {
    colorBackground: '#16161b',
    colorPrimary: '#00E5A8',
    colorText: '#f3f4f6',
    colorTextSecondary: '#8b8e96',
    colorInputBackground: '#1c1c22',
    colorInputText: '#f3f4f6',
    colorNeutral: '#f3f4f6',
    borderRadius: '0.9rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    card: 'bg-[#16161b] border border-[#2a2b32] shadow-2xl',
    formButtonPrimary: 'bg-[#00E5A8] text-[#04110c] normal-case font-semibold',
    footerActionLink: 'text-[#00E5A8]',
  },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0C] px-4 py-10">
      <SignUp appearance={appearance} signInUrl="/sign-in" fallbackRedirectUrl="/app" />
    </div>
  );
}
