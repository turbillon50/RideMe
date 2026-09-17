/**
 * RideMe icons — v2 filled/geometric (Forma) + extras in the same language.
 * Core 10: apps/web/src/ds/icons-v2.tsx
 */
export {
  IconPin,
  IconSearch,
  IconCall,
  IconChat,
  IconHome,
  IconTrips,
  IconWallet,
  IconProfile,
  IconCar,
  IconLightning,
  RideMeIconsV2,
} from '@/ds/icons-v2';
export type { RmIconProps, RideMeIconNameV2 } from '@/ds/icons-v2';

import type { ReactNode } from 'react';
import { RideMeIconsV2, type RmIconProps } from '@/ds/icons-v2';

function ExtraIcon({
  size = 24,
  title,
  children,
  className,
  variant: _variant,
  ...props
}: RmIconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconDot(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="12" cy="12" r="7.2" opacity={0.28} />
    </ExtraIcon>
  );
}

export function IconStar(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M12 2.4 14.4 8.5l6.6.7-5 4.3 1.4 6.5L12 16.8 6.6 20l1.4-6.5-5-4.3 6.6-.7L12 2.4Z" />
    </ExtraIcon>
  );
}

export function IconCash(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M3.2 6.4A1.6 1.6 0 0 1 4.8 4.8h14.4A1.6 1.6 0 0 1 20.8 6.4v11.2a1.6 1.6 0 0 1-1.6 1.6H4.8A1.6 1.6 0 0 1 3.2 17.6V6.4Zm8.8 3.1a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z" />
    </ExtraIcon>
  );
}

export function IconShield(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M12 2.4 4.4 5.1v6.4c0 4.2 2.9 7.2 7.6 8.9 4.7-1.7 7.6-4.7 7.6-8.9V5.1L12 2.4Zm-1.1 11.3-2.4-2.4 1.3-1.3 1.1 1.1 3.3-3.3 1.3 1.3-4.6 4.6Z" />
    </ExtraIcon>
  );
}

export function IconCalendar(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M7.2 2.6h1.8v2.2h6V2.6h1.8v2.2h2.4A1.8 1.8 0 0 1 21 6.6V19a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 19V6.6A1.8 1.8 0 0 1 4.8 4.8h2.4V2.6ZM4.8 10.2v8.8h14.4v-8.8H4.8Z" />
    </ExtraIcon>
  );
}

export function IconAlert(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M12 2.4a9.6 9.6 0 1 0 9.6 9.6A9.6 9.6 0 0 0 12 2.4Zm-.9 5.1h1.8v6.2H11.1V7.5Zm.9 9.5a1.15 1.15 0 1 1 0-2.3 1.15 1.15 0 0 1 0 2.3Z" />
    </ExtraIcon>
  );
}

export function IconEye(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M12 5c5.4 0 9.5 5.4 9.8 7-.3 1.6-4.4 7-9.8 7S2.5 13.6 2.2 12C2.5 10.4 6.6 5 12 5Zm0 3.4A3.6 3.6 0 1 0 15.6 12 3.6 3.6 0 0 0 12 8.4Z" />
    </ExtraIcon>
  );
}

export function IconEyeOff(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M3.2 4.4 4.5 3.1 20.9 19.5 19.6 20.8l-2.5-2.5A12.6 12.6 0 0 1 12 19c-5.4 0-9.5-5.4-9.8-7a13.4 13.4 0 0 1 4.4-5.5L3.2 4.4Zm8 5.3 3.1 3.1A3.2 3.2 0 0 1 12 16.2 3.2 3.2 0 0 1 8.8 13a3.2 3.2 0 0 1 2.4-3.3ZM12 5c1.1 0 2.1.2 3.1.6l-1.5 1.5A5.5 5.5 0 0 0 12 7c-5.4 0-9.5 5.4-9.8 7 .1.4.6 1.4 1.5 2.5L2.2 16 3.5 17.3l1.7-1.7C7 17.8 9.4 19 12 19c.5 0 1-.05 1.5-.12l1.5 1.5c-.9.2-1.9.32-3 .32-5.4 0-9.5-5.4-9.8-7C2.5 10.4 6.6 5 12 5Z" />
    </ExtraIcon>
  );
}

export function IconUpload(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M11.1 14.8V7.4L8.2 10.3 6.9 9l5.1-5.1L17.1 9l-1.3 1.3-2.9-2.9v7.4h-1.8ZM4.6 16.4h14.8v3.2H4.6v-3.2Z" />
    </ExtraIcon>
  );
}

export function IconChevronLeft(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M14.8 4.4 7.2 12l7.6 7.6 1.5-1.5L10.2 12l6.1-6.1-1.5-1.5Z" />
    </ExtraIcon>
  );
}

export function IconChevronRight(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M9.2 4.4 7.7 5.9 13.8 12l-6.1 6.1 1.5 1.5L16.8 12 9.2 4.4Z" />
    </ExtraIcon>
  );
}

export function IconSun(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M11.1 2.4h1.8v2.6h-1.8V2.4ZM11.1 19h1.8v2.6h-1.8V19ZM2.4 11.1h2.6v1.8H2.4v-1.8Zm16.6 0h2.6v1.8h-2.6v-1.8ZM5.3 4.1l1.3-1.3 1.8 1.8-1.3 1.3-1.8-1.8Zm10.3 10.3 1.8 1.8-1.3 1.3-1.8-1.8 1.3-1.3ZM4 18.7 5.3 20l1.8-1.8-1.3-1.3L4 18.7Zm12.7-12.7 1.8-1.8 1.3 1.3-1.8 1.8-1.3-1.3ZM12 7.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Z" />
    </ExtraIcon>
  );
}

export function IconMoon(props: RmIconProps) {
  return (
    <ExtraIcon {...props}>
      <path d="M13.2 2.6a8.6 8.6 0 1 0 8.2 11.4 7.2 7.2 0 0 1-8.2-11.4Z" />
    </ExtraIcon>
  );
}

export const RideMeIcons = {
  ...RideMeIconsV2,
  dot: IconDot,
  calendar: IconCalendar,
  alert: IconAlert,
  star: IconStar,
  shield: IconShield,
  eye: IconEye,
  eyeOff: IconEyeOff,
  upload: IconUpload,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  sun: IconSun,
  moon: IconMoon,
  cash: IconCash,
} as const;

export type RideMeIconName = keyof typeof RideMeIcons;
