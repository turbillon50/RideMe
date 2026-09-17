import { Suspense } from 'react';
import { RideMeSignUp } from '@/components/auth/RideMeSignUp';

export default function SignUpPage() {
  return (
    <Suspense fallback={<main className="rm-auth" />}>
      <RideMeSignUp />
    </Suspense>
  );
}
