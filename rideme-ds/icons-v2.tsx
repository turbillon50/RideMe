/**
 * RideMe icons v2 — filled / geometric craft
 * Ley: /workspace/rideme-ley-visual.png
 * Luis: cero Lucide DNA, cero stroke genérico mint-paint.
 * Uso shells 390: mapa / pedir / ofertas / viaje. Landing HOLD.
 */
import type { ReactNode, SVGProps } from "react";

export type RmIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  title?: string;
  /** outline = inactive nav; filled = active / accent */
  variant?: "filled" | "outline";
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

/** Pin — gota sólida + núcleo recortado (marca mapa) */
export function IconPin({ variant = "filled", ...props }: RmIconProps) {
  if (variant === "outline") {
    return (
      <RmIcon {...props} fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path d="M12 21.5S5 14.8 5 9.4a7 7 0 1 1 14 0c0 5.4-7 12.1-7 12.1Z" />
        <circle cx="12" cy="9.4" r="2.2" fill="currentColor" stroke="none" />
      </RmIcon>
    );
  }
  return (
    <RmIcon {...props}>
      <path
        fillRule="evenodd"
        d="M12 22c0 0-8-7.2-8-12.6a8 8 0 1 1 16 0C20 14.8 12 22 12 22Zm0-10.2a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z"
      />
    </RmIcon>
  );
}

/** Search — lente sólida + mango */
export function IconSearch(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M10.6 2.8a7.8 7.8 0 1 0 4.9 13.85l4.35 4.35a1.15 1.15 0 0 0 1.63-1.63l-4.35-4.35A7.8 7.8 0 0 0 10.6 2.8Zm0 2.3a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z" />
    </RmIcon>
  );
}

/** Call — auricular filled */
export function IconCall(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M7.4 2.9h2.35c.85 0 1.55.62 1.7 1.45l.4 2.2a1.7 1.7 0 0 1-.85 1.8l-1.35.7a12.4 12.4 0 0 0 5.85 5.85l.7-1.35a1.7 1.7 0 0 1 1.8-.85l2.2.4c.83.15 1.45.85 1.45 1.7v2.35c0 1-.82 1.8-1.82 1.68A17.1 17.1 0 0 1 3.22 4.72C3.1 3.72 3.9 2.9 4.9 2.9H7.4Z" />
    </RmIcon>
  );
}

/** Chat — burbuja filled */
export function IconChat(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M5.2 19.8 3 21.6V7.2A4.2 4.2 0 0 1 7.2 3h9.6A4.2 4.2 0 0 1 21 7.2v6.6A4.2 4.2 0 0 1 16.8 18H8.1l-2.9 1.8ZM8.4 9h7.2v1.8H8.4V9Zm0 3.6h5.1V14.4H8.4v-1.8Z" />
    </RmIcon>
  );
}

/** Home — casa filled (activo nav) */
export function IconHome({ variant = "filled", ...props }: RmIconProps) {
  if (variant === "outline") {
    return (
      <RmIcon {...props} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round">
        <path d="M4 11.2 12 4l8 7.2" />
        <path d="M6.4 9.8V20h11.2V9.8" />
        <path d="M10 20v-5.2h4V20" />
      </RmIcon>
    );
  }
  return (
    <RmIcon {...props}>
      <path d="M12 2.6 2.8 10.8a1 1 0 0 0 .65 1.75H5.2V20a1.2 1.2 0 0 0 1.2 1.2h3.6V14.6h4V21.2h3.6A1.2 1.2 0 0 0 18.8 20v-7.45h1.75a1 1 0 0 0 .65-1.75L12 2.6Z" />
    </RmIcon>
  );
}

/** Trips — reloj filled */
export function IconTrips({ variant = "filled", ...props }: RmIconProps) {
  if (variant === "outline") {
    return (
      <RmIcon {...props} fill="none" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="12" cy="12.2" r="7.6" />
        <path d="M12 7.8v4.5l3.1 1.8" strokeLinecap="round" />
      </RmIcon>
    );
  }
  return (
    <RmIcon {...props}>
      <path d="M12 2.2a10 10 0 1 0 10 10A10 10 0 0 0 12 2.2Zm.9 5.4v4.35l3.35 1.95-.9 1.55L11.1 12.9V7.6h1.8Z" />
    </RmIcon>
  );
}

/** Wallet — tarjeta filled */
export function IconWallet({ variant = "filled", ...props }: RmIconProps) {
  if (variant === "outline") {
    return (
      <RmIcon {...props} fill="none" stroke="currentColor" strokeWidth={1.75}>
        <rect x="3.2" y="7" width="17.6" height="12.2" rx="2.2" />
        <path d="M3.2 10.4h17.6" />
        <circle cx="16.4" cy="14.4" r="1.15" fill="currentColor" stroke="none" />
      </RmIcon>
    );
  }
  return (
    <RmIcon {...props}>
      <path d="M4.4 6.2h13.4a1 1 0 0 1 .85 1.55L17.4 10H20a1.6 1.6 0 0 1 1.6 1.6v7.2A1.6 1.6 0 0 1 20 20.4H4.4A1.6 1.6 0 0 1 2.8 18.8V7.8A1.6 1.6 0 0 1 4.4 6.2Zm12.2 8.6a1.35 1.35 0 1 0 1.35 1.35A1.35 1.35 0 0 0 16.6 14.8Z" />
    </RmIcon>
  );
}

/** Profile — filled */
export function IconProfile({ variant = "filled", ...props }: RmIconProps) {
  if (variant === "outline") {
    return (
      <RmIcon {...props} fill="none" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="12" cy="8" r="3.3" />
        <path d="M4.8 19.6c1.4-3.5 3.9-5.2 7.2-5.2s5.8 1.7 7.2 5.2" strokeLinecap="round" />
      </RmIcon>
    );
  }
  return (
    <RmIcon {...props}>
      <circle cx="12" cy="7.6" r="4" />
      <path d="M4 20.2c1.55-4.1 4.2-6.1 8-6.1s6.45 2 8 6.1a1 1 0 0 1-.95 1.35H4.95A1 1 0 0 1 4 20.2Z" />
    </RmIcon>
  );
}

/** Car — silueta filled lateral */
export function IconCar(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M6.6 9.1 8.2 6.4A1.6 1.6 0 0 1 9.55 5.6h4.9a1.6 1.6 0 0 1 1.35.8L17.4 9.1l2.35.7a1.5 1.5 0 0 1 1.05 1.55L20.4 15.2H3.6l-.4-3.85A1.5 1.5 0 0 1 4.25 9.8L6.6 9.1ZM7.2 16.4a1.7 1.7 0 1 0 1.7 1.7 1.7 1.7 0 0 0-1.7-1.7Zm9.6 0a1.7 1.7 0 1 0 1.7 1.7 1.7 1.7 0 0 0-1.7-1.7Z" />
    </RmIcon>
  );
}

/** Lightning — rayo sólido mint (precio / boost) */
export function IconLightning(props: RmIconProps) {
  return (
    <RmIcon {...props}>
      <path d="M13.1 1.8 5.4 13.4h5.4l-1.1 8.8 8.4-12.4h-5.5L13.1 1.8Z" />
    </RmIcon>
  );
}

export const RideMeIconsV2 = {
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

export type RideMeIconNameV2 = keyof typeof RideMeIconsV2;

/** Default export path for Obra — v2 replaces v1 */
export const RideMeIcons = RideMeIconsV2;
