/**
 * RideMe icon set v0 — custom SVG, NO Lucide.
 * Stroke 1.5, currentColor, viewBox 24.
 * Firmado dark+#00E5A8 (Luis 2026-09-17).
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
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
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

/** Destino / pickup — gota + punto interior */
export function IconPin(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M12 21s-7-5.4-7-11a7 7 0 1 1 14 0c0 5.6-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.25" fill="currentColor" stroke="none" />
    </RmIcon>
  );
}

/** Buscar dirección */
export function IconSearch(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </RmIcon>
  );
}

/** Llamar chofer */
export function IconCall(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M8.2 4.6 6.4 4.1a1.6 1.6 0 0 0-1.9 1.1l-.5 1.7a1.6 1.6 0 0 0 .7 1.7c1.6 1.1 3.4 2.6 5.1 4.3 1.7 1.7 3.2 3.5 4.3 5.1a1.6 1.6 0 0 0 1.7.7l1.7-.5a1.6 1.6 0 0 0 1.1-1.9l-.5-1.8a1.6 1.6 0 0 0-1.5-1.1l-1.9.2a1.2 1.2 0 0 0-.9.5l-.7.9a12.5 12.5 0 0 1-3.8-3.8l.9-.7a1.2 1.2 0 0 0 .5-.9l.2-1.9a1.6 1.6 0 0 0-1.1-1.5Z" />
    </RmIcon>
  );
}

/** Chat en viaje — burbuja con cola */
export function IconChat(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M5 17.5 3.5 20l3-1.2A8.5 8.5 0 1 0 5 17.5Z" />
      <path d="M8.5 11h7M8.5 14h4.5" />
    </RmIcon>
  );
}

/** Tab home — casa con techo limpio */
export function IconHome(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 9.5V19h11V9.5" />
      <path d="M10 19v-5h4v5" />
    </RmIcon>
  );
}

/** Historial / viajes — reloj + trazo ruta */
export function IconTrips(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
      <path d="M16.5 4.5 19 3.5" opacity={0.7} />
    </RmIcon>
  );
}

/** Pago / monedero */
export function IconWallet(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M4 8.5h14.5A1.5 1.5 0 0 1 20 10v8.5A1.5 1.5 0 0 1 18.5 20H5.5A1.5 1.5 0 0 1 4 18.5V8.5Z" />
      <path d="M4 8.5 5.8 5.2A1.5 1.5 0 0 1 7.1 4.5h9.2" />
      <circle cx="16" cy="14.25" r="1.1" fill="currentColor" stroke="none" />
    </RmIcon>
  );
}

/** Perfil */
export function IconProfile(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5 19.5c1.4-3.2 3.8-4.8 7-4.8s5.6 1.6 7 4.8" />
    </RmIcon>
  );
}

/** Vehículo — silueta lateral RideMe */
export function IconCar(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M4 14.5h16l-.8-3.2a2 2 0 0 0-1.5-1.4L15.5 9H8.5L6.3 9.9a2 2 0 0 0-1.5 1.4L4 14.5Z" />
      <path d="M4 14.5v2.2a1 1 0 0 0 1 1H6.5" />
      <path d="M17.5 17.7H19a1 1 0 0 0 1-1V14.5" />
      <circle cx="7.25" cy="17.5" r="1.5" />
      <circle cx="16.75" cy="17.5" r="1.5" />
      <path d="M9 9.2 10.2 6.8h3.6L15 9.2" />
    </RmIcon>
  );
}

/** Name-your-price / boost — rayo mint */
export function IconLightning(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M13 2.5 6.5 13h5l-1 8.5L18.5 11h-5L13 2.5Z" fill="currentColor" stroke="none" />
    </RmIcon>
  );
}

export const RideMeIcons = {
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

export type RideMeIconName = keyof typeof RideMeIcons;
