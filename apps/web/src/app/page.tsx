"use client";

import Link from "next/link";
import { Car, Shield, MapPin, Clock, Banknote, Calendar } from "@/components/icons";
import { SupportButton } from "@/components/SupportButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useI18n } from "@/lib/i18n";

const T = {
  es: {
    badge: "Tú pones la tarifa",
    hero: "El viaje que quieres, al precio que decides.",
    hero_sub: "Propón cuánto pagas. Los choferes cercanos aceptan o contraofertan. Sin tarifa dinámica. Sin letra chica.",
    cta_ride: "Pedir un viaje",
    cta_driver: "Conducir con RideMe",
    signin: "Entrar",
    get_started: "Comenzar",
    arriving: "En camino · 3 min",
    accepted: "Aceptado",
    origin: "Masaryk, Polanco",
    dest: "AICM T2",
    driver: "Juan D.",
    car: "Toyota Corolla · 4.97",
    fare: "$95",
    why_label: "La regla",
    why_title: "El pasajero propone. El chofer elige.",
    why_sub: "RideMe no inventa el precio del mercado. Lo pone quien se sube.",
    features: [
      { title: "Precio tuyo", desc: "Deslizas una tarifa. Ves si es competitiva. El chofer decide si le alcanza." },
      { title: "Chofer verificado", desc: "Licencia, fotos y calificación de la casa. Sin anónimos al volante." },
      { title: "Ruta a la vista", desc: "Seguimiento del recojo al destino. Compartir viaje y botón de emergencia." },
      { title: "Agenda", desc: "Reserva con hasta 7 días. Misma regla: tú pones el número." },
    ],
    how_label: "Tres pasos",
    how_title: "Así se pide.",
    steps: [
      { n: "01", title: "Ruta", desc: "Origen y destino. Distancia y tiempo estimados, sin teatro." },
      { n: "02", title: "Tarifa", desc: "Tú propones. El sistema te dice si vas bajo, justo o holgado." },
      { n: "03", title: "Ofertas", desc: "Choferes cercanos responden. Aceptas una y se cierra el trato." },
    ],
    passenger_title: "Pasajero",
    passenger_sub: "Una hoja. Origen, destino, pago y el número que tú escribes.",
    driver_title: "Chofer",
    driver_sub: "Ves la oferta antes de moverte. Aceptas, contraofertas o pasas.",
    cta_title: "Aún no hay millones.",
    cta_sub: "Hay una plataforma en apertura en México. Si te subes ahora, entras en las reglas de la casa: tú pones el precio.",
    cta_btn: "Crear cuenta",
    nav_feat: "Regla",
    nav_how: "Cómo",
    nav_driver: "Choferes",
    footer_copy: "© 2026 RideMe",
    privacy: "Privacidad",
    terms: "Términos",
    support: "Soporte",
    open: "Apertura",
    city: "CDMX primero",
  },
  en: {
    badge: "You name the fare",
    hero: "The ride you want, at the price you set.",
    hero_sub: "Propose what you pay. Nearby drivers accept or counter. No surge. No fine print.",
    cta_ride: "Request a ride",
    cta_driver: "Drive with RideMe",
    signin: "Sign in",
    get_started: "Start",
    arriving: "En route · 3 min",
    accepted: "Accepted",
    origin: "Masaryk, Polanco",
    dest: "AICM T2",
    driver: "Juan D.",
    car: "Toyota Corolla · 4.97",
    fare: "$95",
    why_label: "The rule",
    why_title: "The passenger proposes. The driver chooses.",
    why_sub: "RideMe does not invent the market price. The person who rides does.",
    features: [
      { title: "Your price", desc: "Slide a fare. See if it is competitive. The driver decides if it works." },
      { title: "Verified driver", desc: "License, photos and house rating. No anonymous wheel." },
      { title: "Live route", desc: "Tracking from pickup to drop-off. Share the trip and an emergency control." },
      { title: "Schedule", desc: "Book up to 7 days ahead. Same rule: you write the number." },
    ],
    how_label: "Three steps",
    how_title: "How you book.",
    steps: [
      { n: "01", title: "Route", desc: "Pickup and drop-off. Distance and time, no theater." },
      { n: "02", title: "Fare", desc: "You propose. The system tells you if you are low, fair or high." },
      { n: "03", title: "Offers", desc: "Nearby drivers answer. You accept one and the deal closes." },
    ],
    passenger_title: "Passenger",
    passenger_sub: "One sheet. Origin, destination, payment and the number you write.",
    driver_title: "Driver",
    driver_sub: "See the offer before you move. Accept, counter, or pass.",
    cta_title: "There are no millions yet.",
    cta_sub: "There is a platform opening in Mexico. If you join now, you enter the house rule: you set the price.",
    cta_btn: "Create account",
    nav_feat: "Rule",
    nav_how: "How",
    nav_driver: "Drivers",
    footer_copy: "© 2026 RideMe",
    privacy: "Privacy",
    terms: "Terms",
    support: "Support",
    open: "Opening",
    city: "Mexico City first",
  },
} as const;

const featIcons = [Banknote, Shield, MapPin, Calendar];

function Ticket({ t }: { t: (typeof T)["es"] }) {
  return (
    <article className="card glass p-5 text-left text-[var(--ink)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-3)] text-sm font-semibold text-[var(--steel)]">
          JD
        </div>
        <div>
          <div className="text-sm font-semibold">{t.driver}</div>
          <div className="text-xs text-[var(--muted)]">{t.car}</div>
        </div>
        <div className="ml-auto font-mono text-xl font-medium text-[var(--ink)]">{t.fare}</div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="mt-0.5 shrink-0 text-[var(--steel)]" />
          <span className="text-[var(--muted)]">{t.origin}</span>
        </div>
        <div className="ml-[7px] h-4 w-px border-l border-dashed border-white/15" />
        <div className="flex items-start gap-2">
          <MapPin size={14} className="mt-0.5 shrink-0 text-[var(--sand)]" />
          <span className="text-[var(--muted)]">{t.dest}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)]">
        <Clock size={12} />
        <span>{t.arriving}</span>
        <span className="ml-auto text-[var(--sage)]">{t.accepted}</span>
      </div>
    </article>
  );
}

export default function LandingPage() {
  const { lang, setLang } = useI18n();
  const t = T[lang] as typeof T["es"];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]">
      <nav className="safe-top sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--surface-2)] shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
              <Car size={15} className="text-[var(--gold)]" />
            </span>
            <span className="font-[family-name:var(--font-display)] text-[22px] leading-none">RideMe</span>
          </Link>
          <div className="hidden items-center gap-7 text-[13px] text-[var(--muted)] md:flex">
            <a href="#regla" className="hover:text-[var(--ink)]">{t.nav_feat}</a>
            <a href="#como" className="hover:text-[var(--ink)]">{t.nav_how}</a>
            <a href="#caras" className="hover:text-[var(--ink)]">{t.nav_driver}</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden gap-1 sm:flex">
              {(["es", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-md px-2 py-1 text-[11px] tracking-wide ${
                    lang === l ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link href="/sign-in" className="hidden px-3 py-2 text-[13px] text-[var(--muted)] hover:text-[var(--ink)] sm:inline-flex">
              {t.signin}
            </Link>
            <Link href="/sign-up" className="btn-porcelain rounded-xl px-4 py-2 text-[13px]">
              {t.get_started}
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative mx-auto grid min-h-[calc(100svh-3.5rem)] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 md:min-h-[calc(100svh-4rem)] md:grid-cols-[1.15fr_.85fr] md:py-8">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1 text-[12px] text-[var(--steel)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
            {t.badge}
          </p>
          <h1 className="max-w-[14ch] text-[42px] text-[var(--ink)] sm:text-6xl lg:text-[72px]">
            {t.hero}
          </h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[var(--muted)] sm:text-[18px]">
            {t.hero_sub}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up" className="btn-porcelain flex items-center justify-center rounded-2xl px-6 py-3.5 text-[15px]">
              {t.cta_ride}
            </Link>
            <Link href="/driver/onboarding" className="btn-steel flex items-center justify-center rounded-2xl px-6 py-3.5 text-[15px]">
              {t.cta_driver}
            </Link>
          </div>
          <p className="mt-6 text-[12px] tracking-wide text-[var(--muted)]">
            {t.open} · {t.city}
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm md:mx-0 md:justify-self-end">
          <Ticket t={t} />
        </div>
      </section>

      <section id="regla" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--steel)]">{t.why_label}</p>
        <h2 className="mt-3 max-w-[18ch] text-4xl sm:text-5xl">{t.why_title}</h2>
        <p className="mt-4 max-w-xl text-[var(--muted)]">{t.why_sub}</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.features.map((f, i) => {
            const Icon = featIcons[i];
            return (
              <article key={f.title} className="card p-5">
                <Icon size={18} className="text-[var(--steel)]" />
                <h3 className="mt-4 text-[22px]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="como" className="border-y border-[var(--line)] bg-[var(--surface)] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--steel)]">{t.how_label}</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">{t.how_title}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {t.steps.map((s) => (
              <article key={s.n}>
                <div className="font-mono text-sm text-[var(--steel)]">{s.n}</div>
                <h3 className="mt-3 text-[28px]">{s.title}</h3>
                <p className="mt-2 text-[var(--muted)] leading-relaxed">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="caras" className="mx-auto grid max-w-6xl gap-4 px-4 py-20 sm:px-6 md:grid-cols-2">
        <article className="card overflow-hidden">
          <img src="/brand/app.jpg" alt="" className="h-56 w-full object-cover sm:h-72" />
          <div className="p-6">
            <h2 className="text-3xl">{t.passenger_title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{t.passenger_sub}</p>
          </div>
        </article>
        <article className="card overflow-hidden">
          <img src="/brand/driver.jpg" alt="" className="h-56 w-full object-cover sm:h-72" />
          <div className="p-6">
            <h2 className="text-3xl">{t.driver_title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{t.driver_sub}</p>
          </div>
        </article>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="card mx-auto max-w-3xl px-6 py-12 text-center sm:px-12">
          <h2 className="text-4xl sm:text-5xl">{t.cta_title}</h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--muted)]">{t.cta_sub}</p>
          <Link href="/sign-up" className="btn-porcelain mt-8 inline-flex rounded-2xl px-7 py-3.5 text-[15px]">
            {t.cta_btn}
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Car size={14} className="text-[var(--gold)]" />
            <span className="font-[family-name:var(--font-display)] text-lg">RideMe</span>
          </div>
          <div className="text-sm text-[var(--muted)]">{t.footer_copy}</div>
          <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
            <Link href="/privacidad" className="hover:text-[var(--ink)]">{t.privacy}</Link>
            <Link href="/terminos" className="hover:text-[var(--ink)]">{t.terms}</Link>
            <Link href="/sign-in" className="hover:text-[var(--ink)]">{t.support}</Link>
          </div>
        </div>
      </footer>

      <ThemeToggle className="fixed bottom-24 left-4 z-[70] sm:hidden" />
      <SupportButton />
    </div>
  );
}
