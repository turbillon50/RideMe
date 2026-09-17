/**
 * RideMe icon set v1 — craft premium
 * Ref: /workspace/rideme-mock-*.png (Luis OK cromática; v0 rechazado)
 * stroke 1.25 · geometry dura · currentColor · NO Lucide-DNA
 */
import type { ReactNode, SVGProps } from "react";

export type RmIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  title?: string;
};

const SW = 1.25;

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
      fill="none"
      stroke="currentColor"
      strokeWidth={SW}
      strokeLinecap="round"
      strokeLinejoin="round"
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

/** Pin destino — gota afilada + núcleo (marca RideMe) */
export function IconPin(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M12 21.25C12 21.25 4.75 15.1 4.75 9.6a7.25 7.25 0 1 1 14.5 0c0 5.5-7.25 11.65-7.25 11.65Z" />
      <circle cx="12" cy="9.5" r="2" />
    </RmIcon>
  );
}

/** Buscar */
export function IconSearch(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="10.75" cy="10.75" r="6.5" />
      <path d="M15.6 15.6 20.25 20.25" />
    </RmIcon>
  );
}

/** Llamar — auricular geométrico */
export function IconCall(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M7.2 3.85h2.1c.55 0 1 .4 1.1.94l.35 1.9a1.1 1.1 0 0 1-.55 1.15l-1.15.6a11.2 11.2 0 0 0 5.35 5.35l.6-1.15a1.1 1.1 0 0 1 1.15-.55l1.9.35c.54.1.94.55.94 1.1v2.1c0 .66-.54 1.18-1.2 1.1A15.4 15.4 0 0 1 3.75 5.05c-.08-.66.44-1.2 1.1-1.2Z" />
    </RmIcon>
  );
}

/** Chat — burbuja cápsula + cola */
export function IconChat(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M6.5 18.4 4.25 20.5V7.75A3.5 3.5 0 0 1 7.75 4.25h8.5a3.5 3.5 0 0 1 3.5 3.5v6.4a3.5 3.5 0 0 1-3.5 3.5H8.1Z" />
      <path d="M8.75 9.75h6.5M8.75 13h4" />
    </RmIcon>
  );
}

/** Home — techo pico + cuerpo abierto abajo (mock) */
export function IconHome(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M4.5 11 12 4.25 19.5 11" />
      <path d="M6.75 9.85V19.5h10.5V9.85" />
      <path d="M10.25 19.5v-5h3.5v5" />
    </RmIcon>
  );
}

/** Viajes / historial — reloj + arco */
export function IconTrips(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="12" cy="12.25" r="7.5" />
      <path d="M12 8.25v4.2l2.85 1.65" />
      <path d="M5.35 6.4A9.4 9.4 0 0 1 12 3.6" opacity={0.55} />
    </RmIcon>
  );
}

/** Wallet — tarjeta + solapa */
export function IconWallet(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <rect x="3.5" y="7.25" width="17" height="12" rx="2" />
      <path d="M3.5 10.5h17" />
      <path d="M5.25 7.25 6.6 4.9a1.4 1.4 0 0 1 1.2-.65h8.4" />
      <circle cx="16.25" cy="14.25" r="1" fill="currentColor" stroke="none" />
    </RmIcon>
  );
}

/** Perfil — cabeza + hombros desconectados */
export function IconProfile(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="12" cy="8" r="3.15" />
      <path d="M5.25 19.5c1.25-3.35 3.55-5 6.75-5s5.5 1.65 6.75 5" />
    </RmIcon>
  );
}

/** Auto — silueta lateral craft */
export function IconCar(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M3.75 14.35h16.5l-.7-2.85a1.75 1.75 0 0 0-1.35-1.25L15.2 9.4H8.8L6.3 10.25a1.75 1.75 0 0 0-1.35 1.25l-.7 2.85Z" />
      <path d="M5.1 14.35v2.4h1.85" />
      <path d="M17.05 16.75h1.85v-2.4" />
      <circle cx="7.35" cy="17" r="1.45" />
      <circle cx="16.65" cy="17" r="1.45" />
      <path d="M8.85 9.55 9.85 7.4h4.3l1 2.15" />
    </RmIcon>
  );
}

/** Lightning — rayo angular outline (name-your-price) */
export function IconLightning(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M12.85 2.75 6.4 13.1h5.05L10.6 21.25l6.95-11.1h-5.05L12.85 2.75Z" />
    </RmIcon>
  );
}

export const RideMeIconsV1 = {
  pin: IconPin,
  search: IconSearch,
  call: IconCall,
  chat: IconChat,
  home: IconHome,
  trips: IconTrips,
  wallet: IconWallet,
  profile: IconProfile,
  car: IconCar,
  lightning: IconLightning,
} as const;

export type RideMeIconNameV1 = keyof typeof RideMeIconsV1;

/** Alias de migración: sustituye icons.tsx v0 */
export const RideMeIcons = RideMeIconsV1;
