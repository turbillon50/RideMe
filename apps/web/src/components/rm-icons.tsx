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

/** Tab home — techo geométrico filled */
export function IconHome(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M3.8 11.2 12 4.2l8.2 7V20a1.6 1.6 0 0 1-1.6 1.6h-4.4v-6.4H9.8V21.6H5.4A1.6 1.6 0 0 1 3.8 20v-8.8Z" fill="currentColor" stroke="none" />
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

/** Perfil — filled */
export function IconProfile(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="12" cy="8" r="3.4" fill="currentColor" stroke="none" />
      <path d="M4.2 20.2c1.5-3.6 4.1-5.4 7.8-5.4s6.3 1.8 7.8 5.4" strokeWidth={2.2} />
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

/** Fecha / vencimiento — no Lucide calendar */
export function IconCalendar(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <rect x="3.5" y="6" width="17" height="14.5" rx="3" />
      <path d="M8 3.5v4M16 3.5v4M3.5 11h17" />
      <circle cx="8.5" cy="15.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.2" r="1" fill="currentColor" stroke="none" />
    </RmIcon>
  );
}

export function IconAlert(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.5" />
      <circle cx="12" cy="16.25" r="0.85" fill="currentColor" stroke="none" />
    </RmIcon>
  );
}

/** Calificación — estrella llena, no Lucide */
export function IconStar(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path
        d="M12 3.4 14.2 8l5 .7-3.6 3.6.9 5.2L12 15.2 7.5 17.5l.9-5.2L4.8 8.7l5-.7L12 3.4Z"
        fill="currentColor"
        stroke="none"
      />
    </RmIcon>
  );
}

/** Seguridad / verificado */
export function IconShield(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M12 3.2 5.5 5.6v6.2c0 3.8 2.6 6.4 6.5 8 3.9-1.6 6.5-4.2 6.5-8V5.6L12 3.2Z" />
      <path d="m9.2 12 1.9 1.9 3.7-3.8" />
    </RmIcon>
  );
}

export function IconEye(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M3.5 12s3.2-6 8.5-6 8.5 6 8.5 6-3.2 6-8.5 6-8.5-6-8.5-6Z" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    </RmIcon>
  );
}

export function IconEyeOff(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M3.5 12s3.2-6 8.5-6c1.4 0 2.7.4 3.8 1" />
      <path d="M20.5 12s-1.2 2.2-3.2 3.8" />
      <path d="M9.2 9.3a3 3 0 0 0 5.4 3.5" />
      <path d="m4 4 16 16" />
    </RmIcon>
  );
}

export function IconUpload(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M5 16.5v2a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 18.5v-2" />
      <path d="M12 15.5V6.5" />
      <path d="m8.5 9.5 3.5-3.5 3.5 3.5" />
    </RmIcon>
  );
}

export function IconChevronLeft(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="m14.5 5.5-6 6.5 6 6.5" />
    </RmIcon>
  );
}

export function IconChevronRight(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="m9.5 5.5 6 6.5-6 6.5" />
    </RmIcon>
  );
}

export function IconSun(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3.5v1.8M12 18.7v1.8M4.8 4.8l1.3 1.3M17.9 17.9l1.3 1.3M3.5 12H5.3M18.7 12h1.8M4.8 19.2l1.3-1.3M17.9 6.1l1.3-1.3" />
    </RmIcon>
  );
}

export function IconMoon(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M16.8 14.6A6.6 6.6 0 0 1 9.2 5.4 6.8 6.8 0 1 0 16.8 14.6Z" />
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
} as const;

export type RideMeIconName = keyof typeof RideMeIcons;
