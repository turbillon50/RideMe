import { SignIn } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-ui';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--rm-bg,#0A0A0C)] px-4 py-10">
      <SignIn
        appearance={clerkAppearance}
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/app"
      />
    </div>
  );
}
