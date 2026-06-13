import { ReactNode } from 'react';
import { SupportButton } from '@/components/SupportButton';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SupportButton />
    </>
  );
}
