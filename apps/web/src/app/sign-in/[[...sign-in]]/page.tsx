import { Suspense } from 'react';
import { RideMeSignIn } from '@/components/auth/RideMeSignIn';

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="rm-auth" />}>
      <RideMeSignIn />
    </Suspense>
  );
}
