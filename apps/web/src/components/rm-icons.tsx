/**
 * RideMe icon set v2 — FILLED geometric craft (Forma).
 * Zero Lucide DNA. Zero stroke-2 outline clones.
 * Firmado Forma/Luis 2026-09-17: dark+#00E5A8.
 */
import type { ReactNode, SVGProps } from "react";

export type RmIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  title?: string;
};

function RmIcon({
  size = 24,
  title,
  children,
  className,
  ...props
}: RmIconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...props}
    >
      {children}
    </svg>
  );
}

/** Destino — gota filled con hueco circular */
export function IconPin(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path
        fillRule="evenodd"
        d="M12 1.8c-4.7 0-8.5 3.9-8.5 8.8 0 5.7 6.4 12.2 7.9 13.6a.9.9 0 0 0 1.2 0c1.5-1.4 7.9-7.9 7.9-13.6 0-4.9-3.8-8.8-8.5-8.8Zm0 5.6a3.1 3.1 0 1 0 .02 6.2A3.1 3.1 0 0 0 12 7.4Z"
      />
    </RmIcon>
  );
}

/** Origen — disco filled (no gota Lucide) */
export function IconDot(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="12" cy="12" r="5.2" />
      <circle cx="12" cy="12" r="8.4" fill="currentColor" opacity="0.22" />
    </RmIcon>
  );
}

export function IconSearch(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path
        fillRule="evenodd"
        d="M10.4 2.6a7.8 7.8 0 1 0 4.9 13.9l4.4 4.4a1.3 1.3 0 0 0 1.8-1.8l-4.4-4.4A7.8 7.8 0 0 0 10.4 2.6Zm0 2.6a5.2 5.2 0 1 1 0 10.4 5.2 5.2 0 0 1 0-10.4Z"
      />
    </RmIcon>
  );
}

/** Auricular filled, geometría propia */
export function IconCall(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M7.4 3.2 9.6 3.8a1.6 1.6 0 0 1 1.1 2l-.5 2.1A1.5 1.5 0 0 1 9.3 9L7.8 9.6a11 11 0 0 0 6.6 6.6l.6-1.5a1.5 1.5 0 0 1 1.1-1l2.1-.5a1.6 1.6 0 0 1 2 1.1l.6 2.2a1.8 1.8 0 0 1-1.5 2.3c-6.8 1.3-14.3-6-13.2-12.8A1.8 1.8 0 0 1 7.4 3.2Z" />
    </RmIcon>
  );
}

export function IconChat(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M4.2 6.1A3.6 3.6 0 0 1 7.8 2.6h8.4A3.6 3.6 0 0 1 19.8 6.1v7.2a3.6 3.6 0 0 1-3.6 3.5H10l-4.6 3.6A1 1 0 0 1 3.8 19.6V6.1Z" />
      <rect x="7.4" y="7.4" width="9.2" height="1.7" rx="0.85" fill="#0A0A0C" />
      <rect x="7.4" y="10.6" width="6.2" height="1.7" rx="0.85" fill="#0A0A0C" />
    </RmIcon>
  );
}

/** Casa filled con hueco de puerta */
export function IconHome(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path
        fillRule="evenodd"
        d="M11.3 2.6a1.2 1.2 0 0 1 1.4 0l8.1 6.4A1.4 1.4 0 0 1 21.4 10v9.2A2.4 2.4 0 0 1 19 21.6H5A2.4 2.4 0 0 1 2.6 19.2V10a1.4 1.4 0 0 1 .6-1L11.3 2.6ZM10 12.4h4A1.4 1.4 0 0 1 15.4 13.8V21.6h-6.8v-7.8A1.4 1.4 0 0 1 10 12.4Z"
      />
    </RmIcon>
  );
}

/** Viajes — tickets apilados, no reloj Lucide */
export function IconTrips(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M7.2 5.2h11.2A2.2 2.2 0 0 1 20.6 7.4v.8H7.2A1.6 1.6 0 0 1 5.6 6.6c0-.8.7-1.4 1.6-1.4Z" opacity="0.45" />
      <path
        fillRule="evenodd"
        d="M4.4 8.4A2.2 2.2 0 0 1 6.6 6.2h11.2A2.2 2.2 0 0 1 20 8.4v9.2A2.2 2.2 0 0 1 17.8 19.8H6.6A2.2 2.2 0 0 1 4.4 17.6V8.4Zm3.2 2.4h8.8a.9.9 0 1 1 0 1.8H7.6a.9.9 0 1 1 0-1.8Zm0 3.6h5.6a.9.9 0 1 1 0 1.8H7.6a.9.9 0 1 1 0-1.8Z"
      />
    </RmIcon>
  );
}

export function IconWallet(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M3.4 8.2A2.4 2.4 0 0 1 5.8 5.8h11.2A1.6 1.6 0 0 1 18.6 7.4V8.2H5.8A2.4 2.4 0 0 1 3.4 5.8v2.4Z" opacity="0.5" />
      <path
        fillRule="evenodd"
        d="M3.4 8.8A2.2 2.2 0 0 1 5.6 6.6h12.8A2.2 2.2 0 0 1 20.6 8.8v8.6a2.2 2.2 0 0 1-2.2 2.2H5.6a2.2 2.2 0 0 1-2.2-2.2V8.8Zm12.4 3.4a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4Z"
      />
    </RmIcon>
  );
}

/** Perfil — silueta sólida */
export function IconProfile(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="12" cy="8" r="4.2" />
      <path d="M4.1 20.4C5.3 16.2 8.1 14 12 14s6.7 2.2 7.9 6.4A1.6 1.6 0 0 1 18.4 22.2H5.6a1.6 1.6 0 0 1-1.5-1.8Z" />
    </RmIcon>
  );
}

/** Sedán filled con huecos de rueda */
export function IconCar(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path
        fillRule="evenodd"
        d="M7.6 6.6h8.8c.8 0 1.5.5 1.8 1.2L20.4 12h.4A1.8 1.8 0 0 1 22.6 13.8v2.4A1.4 1.4 0 0 1 21.2 17.6h-1.1a2.6 2.6 0 0 1-5 0h-6.2a2.6 2.6 0 0 1-5 0H2.8A1.4 1.4 0 0 1 1.4 16.2v-2.4A1.8 1.8 0 0 1 3.2 12h.4l2.2-4.2A1.9 1.9 0 0 1 7.6 6.6ZM7.4 16.2a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Zm9.2 0a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8ZM8.2 8.6h7.6l1.5 3H6.7l1.5-3Z"
      />
    </RmIcon>
  );
}

export function IconLightning(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M13.6 1.8 5.4 13.2a.9.9 0 0 0 .7 1.4h5.1l-1.4 7.4a.9.9 0 0 0 1.6.7l8.4-11.6a.9.9 0 0 0-.7-1.4h-5.3l1.6-7.2a.9.9 0 0 0-1.8-.7Z" />
    </RmIcon>
  );
}

export function IconCalendar(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path
        fillRule="evenodd"
        d="M8.2 2.4a1 1 0 0 1 1 1V4.6h5.6V3.4a1 1 0 1 1 2 0V4.6h1.4A2.6 2.6 0 0 1 20.8 7.2v11.6A2.6 2.6 0 0 1 18.2 21.4H5.8A2.6 2.6 0 0 1 3.2 18.8V7.2A2.6 2.6 0 0 1 5.8 4.6H7.2V3.4a1 1 0 0 1 1-1ZM5.2 10.2h13.6v8.6a.6.6 0 0 1-.6.6H5.8a.6.6 0 0 1-.6-.6v-8.6Zm3.4 3.2h2.2v2.2H8.6v-2.2Zm4.4 0h2.4v2.2h-2.4v-2.2Z"
      />
    </RmIcon>
  );
}

export function IconAlert(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path
        fillRule="evenodd"
        d="M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6Zm0 5.2a1.1 1.1 0 0 1 1.1 1.1v4.2a1.1 1.1 0 1 1-2.2 0V8.5A1.1 1.1 0 0 1 12 7.4Zm0 8.4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Z"
      />
    </RmIcon>
  );
}

/** Estrella 5 puntas ancha — no path Lucide */
export function IconStar(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M12 2.4 14.4 8l6.1.6-4.6 3.9 1.4 6-5.3-3.1-5.3 3.1 1.4-6L3.5 8.6 9.6 8 12 2.4Z" />
    </RmIcon>
  );
}

export function IconShield(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path
        fillRule="evenodd"
        d="M11.4 2.3 4.4 5v6.6c0 4.3 3 7.3 7.6 9.1 4.6-1.8 7.6-4.8 7.6-9.1V5l-7-2.7a1.6 1.6 0 0 0-1.2 0ZM10.2 12.6 8.6 11a1 1 0 1 1 1.4-1.4l1.4 1.4 3.2-3.2a1 1 0 0 1 1.4 1.4l-3.9 3.9a1 1 0 0 1-1.4 0Z"
      />
    </RmIcon>
  );
}

export function IconEye(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path
        fillRule="evenodd"
        d="M12 5.2c5.4 0 9.4 5.2 10.2 6.4a1.2 1.2 0 0 1 0 1.4C21.4 14.2 17.4 19.4 12 19.4S2.6 14.2 1.8 13a1.2 1.2 0 0 1 0-1.4C2.6 10.4 6.6 5.2 12 5.2Zm0 3.2a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z"
      />
    </RmIcon>
  );
}

export function IconEyeOff(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M3.1 4.4 4.5 3 21 19.5 19.6 21l-3.3-3.3C14.8 18.6 13.5 19.2 12 19.2c-5.4 0-9.4-5.2-10.2-6.4a1.2 1.2 0 0 1 0-1.4c.5-.8 1.8-2.5 3.6-3.9L3.1 4.4Zm6.6 6.6a3.4 3.4 0 0 0 4.3 4.3L9.7 11Z" />
      <path d="M12 4.8c5.4 0 9.4 5.2 10.2 6.4a1.2 1.2 0 0 1 0 1.4c-.3.4-.8 1.2-1.6 2.1L12.8 7a3.6 3.6 0 0 0-3.3-.2L7.2 4.6C8.7 4.9 10.3 4.8 12 4.8Z" opacity="0.55" />
    </RmIcon>
  );
}

export function IconUpload(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M11.1 3.4a1.3 1.3 0 0 1 1.8 0l4.4 4.4a1.3 1.3 0 0 1-1.8 1.8L13.3 7.4V16a1.3 1.3 0 1 1-2.6 0V7.4L8.5 9.6a1.3 1.3 0 0 1-1.8-1.8l4.4-4.4Z" />
      <path d="M4.4 15.6A1.4 1.4 0 0 1 5.8 14.2h2.2a1.2 1.2 0 1 1 0 2.4H6.6v2.2h10.8v-2.2h-1.4a1.2 1.2 0 1 1 0-2.4h2.4A1.4 1.4 0 0 1 19.8 15.6v4.4A1.8 1.8 0 0 1 18 21.8H6.2A1.8 1.8 0 0 1 4.4 20V15.6Z" />
    </RmIcon>
  );
}

export function IconChevronLeft(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M14.8 4.2a1.2 1.2 0 0 1 0 1.7L9.7 12l5.1 6.1a1.2 1.2 0 1 1-1.8 1.6l-5.8-7a1.2 1.2 0 0 1 0-1.6l5.8-7a1.2 1.2 0 0 1 1.8 0Z" />
    </RmIcon>
  );
}

export function IconChevronRight(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M9.2 4.2a1.2 1.2 0 0 1 1.8 0l5.8 7a1.2 1.2 0 0 1 0 1.6l-5.8 7a1.2 1.2 0 1 1-1.8-1.6L14.3 12 9.2 5.9a1.2 1.2 0 0 1 0-1.7Z" />
    </RmIcon>
  );
}

export function IconSun(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M11.1 2.2h1.8v2.6h-1.8V2.2Zm0 17h1.8v2.6h-1.8V19.2ZM2.2 11.1h2.6v1.8H2.2v-1.8Zm17 0h2.6v1.8H19.2v-1.8ZM4.6 4.6l1.8-1.8 1.8 1.8-1.8 1.8-1.8-1.8Zm11.2 11.2 1.8-1.8 1.8 1.8-1.8 1.8-1.8-1.8ZM17.6 2.8l1.8 1.8-1.8 1.8-1.8-1.8 1.8-1.8ZM4.6 17.6l1.8-1.8 1.8 1.8-1.8 1.8-1.8-1.8Z" />
    </RmIcon>
  );
}

export function IconMoon(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M13.2 2.6A9.2 9.2 0 1 0 21.2 14.4 7.2 7.2 0 0 1 13.2 2.6Z" />
    </RmIcon>
  );
}

export function IconCash(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path
        fillRule="evenodd"
        d="M3.2 7.2A2.2 2.2 0 0 1 5.4 5h13.2A2.2 2.2 0 0 1 20.8 7.2v9.6A2.2 2.2 0 0 1 18.6 19H5.4A2.2 2.2 0 0 1 3.2 16.8V7.2Zm8.8 1.6a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4ZM6.2 8.2h1.8v1.6H6.2V8.2Zm9.8 6h1.8v1.6h-1.8v-1.6Z"
      />
    </RmIcon>
  );
}

export const RideMeIcons = {
  pin: IconPin,
  dot: IconDot,
  search: IconSearch,
  call: IconCall,
  chat: IconChat,
  home: IconHome,
  trips: IconTrips,
  wallet: IconWallet,
  profile: IconProfile,
  car: IconCar,
  lightning: IconLightning,
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
