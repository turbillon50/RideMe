import { ReactNode } from 'react';
import { SupportButton } from '@/components/SupportButton';

export default function DriverLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SupportButton />
    </>
  );
}
