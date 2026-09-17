"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  IconCar,
  IconLightning,
  IconPin,
  IconProfile,
  IconTrips,
} from "@/components/rm-icons";
import { Splash } from "@/components/Splash";
import { useI18n } from "@/lib/i18n";

const T = {
  es: {
    badge: "Tú propones el precio",
    coverage: "Toda la República Mexicana",
    cities: "CDMX · Guadalajara · Monterrey · Puebla · Mérida · Tijuana y más",
    hero_sub:
      "Propón tu tarifa. Los choferes compiten por ti. Sin cobros extra. Sin sorpresas. El viaje que quieres, al precio que decides — en todo México.",
    cta_ride: "Solicitar viaje",
    cta_driver: "Quiero ser chofer",
    signin: "Iniciar sesión",
    get_started: "Comenzar",
    arriving: "Llega en 3 min",
    accepted: "Aceptado",
    origin: "Centro, Guadalajara",
    dest: "Aeropuerto GDL",
    stats: [
      { v: "2M+", l: "Usuarios felices" },
      { v: "50K+", l: "Choferes activos" },
      { v: "98%", l: "Satisfacción" },
      { v: "30s", l: "Tiempo de match" },
    ],
    why_label: "Por qué RideMe",
    why_title: "Viajes en tus términos",
    why_sub:
      "La plataforma de transporte que de verdad funciona para pasajeros y choferes en toda la República.",
    features: [
      {
        title: "Tú decides el precio",
        desc: "Propón tu tarifa y los choferes deciden si aceptan. Sin cobros dinámicos ni sorpresas.",
      },
      {
        title: "Tu seguridad primero",
        desc: "Todos los choferes verificados, con antecedentes revisados y calificados por la comunidad.",
      },
      {
        title: "Rapidísimo",
        desc: "Match en menos de 30 segundos. Seguimiento en tiempo real desde el recojo hasta tu destino.",
      },
      {
        title: "Programa tu viaje",
        desc: "Planea con anticipación. Reserva viajes hasta 7 días antes al precio que tú elijas.",
      },
    ],
    how_label: "Proceso sencillo",
    how_title: "¿Cómo funciona?",
    steps: [
      {
        n: "01",
        title: "Ingresa tu ruta",
        desc: "Pon tu punto de recogida y destino. Ve la distancia y duración estimada.",
      },
      {
        n: "02",
        title: "Propón tu precio",
        desc: "Desliza para sugerir tu tarifa y ve qué tan competitiva es en tiempo real.",
      },
      {
        n: "03",
        title: "Recibe ofertas",
        desc: "Los choferes cercanos ven tu viaje y mandan ofertas. Acepta la mejor.",
      },
    ],
    passenger_title: "Control total para el pasajero",
    passenger_sub:
      "Ingresa origen, destino, método de pago y tu precio desde una pantalla enfocada y sin ruido.",
    driver_title: "Choferes que eligen el trabajo que les conviene",
    driver_sub:
      "Control total con solicitudes en vivo, contraofertas, suscripción y panel de ganancias.",
    test_label: "Testimonios",
    test_title: "Lo que dicen de nosotros",
    testimonials: [
      {
        name: "Valentina M.",
        role: "Usuaria frecuente · GDL",
        text: "Ahorro 30% comparado con otras apps porque yo propongo el precio. ¡Cambió mis viajes por completo!",
        av: "VM",
      },
      {
        name: "Carlos H.",
        role: "Chofer socio · MTY",
        text: "Yo elijo qué viajes acepto. Sin cobros dinámicos obligatorios, solo pago justo cada vez.",
        av: "CH",
      },
      {
        name: "Mariana L.",
        role: "Usuaria de fin de semana · CUN",
        text: "La app está increíble y la experiencia es súper fluida. ¡No cambiaría a nada más!",
        av: "ML",
      },
    ],
    cta_title: "¿Listo para viajar inteligente?",
    cta_sub: "Únete a quienes ya eligen su precio en cada viaje, en todo México.",
    cta_btn: "Empieza gratis",
    nav_feat: "Características",
    nav_how: "¿Cómo funciona?",
    nav_driver: "Para choferes",
    footer_copy: "© 2026 RideMe. Todos los derechos reservados.",
    privacy: "Privacidad",
    terms: "Términos",
    support: "Soporte",
  },
  en: {
    badge: "You name the price",
    coverage: "All of Mexico",
    cities: "Mexico City · Guadalajara · Monterrey · Puebla · Mérida · Tijuana and more",
    hero_sub:
      "Propose your fare. Drivers compete for your ride. No surge. No surprises. The ride you want, at the price you choose — across Mexico.",
    cta_ride: "Request a ride",
    cta_driver: "I want to drive",
    signin: "Sign in",
    get_started: "Get started",
    arriving: "Arrives in 3 min",
    accepted: "Accepted",
    origin: "Centro, Guadalajara",
    dest: "GDL Airport",
    stats: [
      { v: "2M+", l: "Happy riders" },
      { v: "50K+", l: "Active drivers" },
      { v: "98%", l: "Satisfaction" },
      { v: "30s", l: "Match time" },
    ],
    why_label: "Why RideMe",
    why_title: "Rides on your terms",
    why_sub: "A rideshare that actually works for passengers and drivers across Mexico.",
    features: [
      {
        title: "You set the price",
        desc: "Propose your fare and drivers decide. No surge pricing, no surprises.",
      },
      {
        title: "Safety first",
        desc: "Every driver is verified, background-checked, and rated by the community.",
      },
      {
        title: "Lightning fast",
        desc: "Match in under 30 seconds. Live tracking from pickup to drop-off.",
      },
      {
        title: "Schedule your ride",
        desc: "Plan ahead. Book up to 7 days in advance at the price you choose.",
      },
    ],
    how_label: "Simple process",
    how_title: "How it works",
    steps: [
      {
        n: "01",
        title: "Enter your route",
        desc: "Set pickup and drop-off. See estimated distance and duration.",
      },
      {
        n: "02",
        title: "Name your price",
        desc: "Slide to propose your fare and see how competitive it is in real time.",
      },
      {
        n: "03",
        title: "Get offers",
        desc: "Nearby drivers see your trip and send offers. Accept the best one.",
      },
    ],
    passenger_title: "Full control for the passenger",
    passenger_sub:
      "Set pickup, destination, payment method and your price from a focused screen.",
    driver_title: "Drivers choose the work that pays",
    driver_sub: "Live requests, counter-offers, subscription and earnings — in one place.",
    test_label: "Testimonials",
    test_title: "What people say",
    testimonials: [
      {
        name: "Valentina M.",
        role: "Frequent rider · GDL",
        text: "I save 30% versus other apps because I set my own price. Total game changer.",
        av: "VM",
      },
      {
        name: "Carlos H.",
        role: "Driver partner · MTY",
        text: "I choose which rides to accept. No mandatory surge, just fair pay.",
        av: "CH",
      },
      {
        name: "Mariana L.",
        role: "Weekend rider · CUN",
        text: "The app feels great and the flow is smooth. I would not switch.",
        av: "ML",
      },
    ],
    cta_title: "Ready to ride smarter?",
    cta_sub: "Join riders who already set their own price, across Mexico.",
    cta_btn: "Start free",
    nav_feat: "Features",
    nav_how: "How it works",
    nav_driver: "For drivers",
    footer_copy: "© 2026 RideMe. All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    support: "Support",
  },
} as const;

const featureIcons = [IconLightning, IconProfile, IconCar, IconTrips];

const cV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const iV = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function BrandMark({ size = 16, box = 32 }: { size?: number; box?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl bg-[var(--rm-accent)] text-[var(--rm-cta-fg)]"
      style={{ width: box, height: box }}
    >
      <IconCar size={size} />
    </div>
  );
}

export default function LandingPage() {
  const { lang, setLang } = useI18n();
  const t = T[lang] as typeof T["es"];
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -80]);

  return (
    <div className="rm-landing min-h-screen overflow-x-hidden bg-[var(--rm-bg)] text-[var(--rm-text)]">
      <Splash />
      {/* NAV — Iniciar sesión visible a 390 (antes hidden sm:flex) */}
      <nav className="safe-top sticky top-0 z-50 border-b border-[var(--rm-border)] bg-[color-mix(in_srgb,var(--rm-bg)_88%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <BrandMark />
            <span className="truncate text-lg font-bold tracking-tight sm:text-xl">RideMe</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-[var(--rm-text-3)] md:flex">
            <a href="#features" className="transition-colors hover:text-[var(--rm-text)]">
              {t.nav_feat}
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-[var(--rm-text)]">
              {t.nav_how}
            </a>
            <a href="#drivers" className="transition-colors hover:text-[var(--rm-text)]">
              {t.nav_driver}
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <div className="hidden gap-1 sm:flex" aria-label="Idioma">
              {(["es", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`rounded-md px-2 py-1 text-xs font-bold transition-all ${
                    lang === l
                      ? "bg-[var(--rm-accent-muted)] text-[var(--rm-accent)]"
                      : "text-[var(--rm-text-3)] hover:text-[var(--rm-text-2)]"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link
              href="/sign-in"
              className="rm-pressable min-h-11 min-w-[44px] whitespace-nowrap px-2 text-sm font-semibold text-[var(--rm-text-2)] sm:px-4"
            >
              {t.signin}
            </Link>
            <Link href="/sign-up" className="rm-btn rm-btn--primary !min-h-11 px-4 text-sm">
              {t.get_started}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex min-h-[92svh] items-end justify-center overflow-hidden sm:items-center"
      >
        <img src="/brand/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--rm-scrim-hero)" }} />
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-10 pt-20 text-center sm:px-6 sm:pb-20 rm-enter"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--rm-accent)]/35 bg-[var(--rm-accent-muted)] px-4 py-1.5 text-sm font-medium text-[var(--rm-accent)]">
            <IconLightning size={14} />
            {t.badge}
          </div>

          <h1 className="mb-3 text-[length:var(--rm-text-3xl)] font-bold leading-[var(--rm-leading-tight)] tracking-[var(--rm-tracking-tight)] text-[var(--rm-text)] sm:text-7xl lg:text-8xl">
            RideMe
          </h1>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rm-accent)]">
            {t.coverage}
          </p>

          <p className="mx-auto mb-3 max-w-2xl text-[length:var(--rm-text-md)] leading-[var(--rm-leading)] text-[var(--rm-text-2)] sm:text-2xl">
            {t.hero_sub}
          </p>
          <p className="mb-8 text-xs text-[var(--rm-text-3)] sm:text-sm">{t.cities}</p>

          {/* CTAs 390: stack ≥48px · Comenzar → Solicitar viaje → Chofer · login en thumb */}
          <div className="mx-auto flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Link href="/sign-up" className="rm-btn rm-btn--primary rm-btn--block rm-btn--lg sm:w-auto sm:min-w-[220px]">
              {t.get_started}
            </Link>
            <Link href="/sign-up" className="rm-btn rm-btn--secondary rm-btn--block rm-btn--lg sm:w-auto sm:min-w-[220px]">
              {t.cta_ride}
            </Link>
            <Link
              href="/driver/onboarding"
              className="rm-btn rm-btn--secondary rm-btn--block rm-btn--lg sm:w-auto sm:min-w-[220px]"
            >
              {t.cta_driver}
            </Link>
            <Link href="/sign-in" className="rm-btn rm-btn--ghost rm-btn--block rm-btn--lg sm:hidden">
              {t.signin}
            </Link>
          </div>

          <div className="mx-auto mt-12 max-w-sm sm:mt-16">
            <div className="rm-card rm-card--glass p-5 text-left">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--rm-accent-muted)] text-sm font-bold text-[var(--rm-accent)]">
                  JD
                </div>
                <div>
                  <div className="text-sm font-semibold">Juan D.</div>
                  <div className="flex items-center gap-1 text-xs text-[var(--rm-text-3)]">
                    <span className="text-[var(--rm-accent)]">★ 4.97</span>
                    <span>· Toyota Corolla</span>
                  </div>
                </div>
                <div className="rm-price ml-auto">$95</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <IconPin size={14} className="rm-map__pin mt-0.5 shrink-0" />
                  <span className="text-[var(--rm-text-2)]">{t.origin}</span>
                </div>
                <div className="ml-[7px] h-4 w-px border-l border-dashed border-[var(--rm-border-strong)]" />
                <div className="flex items-start gap-2">
                  <IconPin size={14} className="mt-0.5 shrink-0 text-[var(--rm-text-3)]" />
                  <span className="text-[var(--rm-text-2)]">{t.dest}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-[var(--rm-text-3)]">
                <IconTrips size={12} />
                <span>{t.arriving}</span>
                <span className="ml-auto font-medium text-[var(--rm-success)]">● {t.accepted}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="border-y border-[var(--rm-border)] bg-[var(--rm-surface)] py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {t.stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-mono text-4xl font-black text-[var(--rm-accent)] sm:text-5xl">{s.v}</div>
              <div className="mt-1 text-sm text-[var(--rm-text-3)]">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cV}
          className="mb-16 text-center"
        >
          <motion.div
            variants={iV}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--rm-accent)]"
          >
            {t.why_label}
          </motion.div>
          <motion.h2 variants={iV} className="rm-h2 mb-4 sm:text-5xl">
            {t.why_title}
          </motion.h2>
          <motion.p variants={iV} className="rm-body mx-auto max-w-xl text-[var(--rm-text-3)]">
            {t.why_sub}
          </motion.p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={cV}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {t.features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div key={f.title} variants={iV} whileHover={{ y: -4, scale: 1.01 }} className="rm-card rm-card--interactive">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--rm-accent-muted)]">
                  <Icon size={24} className="text-[var(--rm-accent)]" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--rm-text-3)]">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-[var(--rm-surface)] py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cV}
            className="mb-16 text-center"
          >
            <motion.div
              variants={iV}
              className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--rm-accent)]"
            >
              {t.how_label}
            </motion.div>
            <motion.h2 variants={iV} className="rm-h2 sm:text-5xl">
              {t.how_title}
            </motion.h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {t.steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="mb-4 font-mono text-7xl font-black text-[var(--rm-accent)] opacity-25">{s.n}</div>
                <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
                <p className="leading-relaxed text-[var(--rm-text-3)]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APP & DRIVER PREVIEW — desktop afiliados, sin booking */}
      <section id="drivers" className="bg-[var(--rm-bg)] py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[var(--rm-radius-xl)] border border-[var(--rm-border)] bg-[var(--rm-surface)]"
          >
            <img src="/brand/app.jpg" alt="App de pasajero RideMe" className="h-72 w-full object-cover sm:h-96" />
            <div className="p-6">
              <h2 className="text-2xl font-black">{t.passenger_title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--rm-text-3)]">{t.passenger_sub}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-[var(--rm-radius-xl)] border border-[var(--rm-border)] bg-[var(--rm-surface)]"
          >
            <img src="/brand/driver.jpg" alt="App de chofer RideMe" className="h-72 w-full object-cover sm:h-96" />
            <div className="p-6">
              <h2 className="text-2xl font-black">{t.driver_title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--rm-text-3)]">{t.driver_sub}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cV}
          className="mb-16 text-center"
        >
          <motion.div
            variants={iV}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--rm-accent)]"
          >
            {t.test_label}
          </motion.div>
          <motion.h2 variants={iV} className="rm-h2 sm:text-5xl">
            {t.test_title}
          </motion.h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cV}
          className="grid gap-6 md:grid-cols-3"
        >
          {t.testimonials.map((t2) => (
            <motion.div key={t2.name} variants={iV} whileHover={{ y: -4 }} className="rm-card">
              <div className="mb-4 text-[var(--rm-accent)]">★★★★★</div>
              <p className="mb-6 text-sm leading-relaxed text-[var(--rm-text-2)]">“{t2.text}”</p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--rm-accent-muted)] text-xs font-bold text-[var(--rm-accent)]">
                  {t2.av}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t2.name}</div>
                  <div className="text-xs text-[var(--rm-text-3)]">{t2.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[var(--rm-radius-xl)] border border-[var(--rm-border-strong)] p-12"
            style={{ background: "var(--rm-accent-muted)" }}
          >
            <div className="relative z-10">
              <h2 className="mb-4 text-4xl font-black sm:text-5xl">{t.cta_title}</h2>
              <p className="mb-8 text-lg text-[var(--rm-text-2)]">{t.cta_sub}</p>
              <Link href="/sign-up" className="rm-btn rm-btn--primary rm-btn--lg px-8">
                {t.cta_btn}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--rm-border)] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <BrandMark size={13} box={28} />
            <span className="text-lg font-black">RideMe</span>
          </div>
          <div className="text-sm text-[var(--rm-text-3)]">{t.footer_copy}</div>
          <div className="flex items-center gap-6 text-sm text-[var(--rm-text-3)]">
            <a href="#" className="transition-colors hover:text-[var(--rm-text)]">
              {t.privacy}
            </a>
            <a href="#" className="transition-colors hover:text-[var(--rm-text)]">
              {t.terms}
            </a>
            <a href="#" className="transition-colors hover:text-[var(--rm-text)]">
              {t.support}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
