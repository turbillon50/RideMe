import { SignUp } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-ui';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--rm-bg,#0A0A0C)] px-4 py-10">
      <SignUp
        appearance={clerkAppearance}
        signInUrl="/sign-in"
        fallbackRedirectUrl="/app"
      />
    </div>
  );
}
