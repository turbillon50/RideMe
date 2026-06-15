"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Car, DollarSign, Shield, Zap, Star, ChevronRight, MapPin, Clock, ArrowRight } from "@/components/icons";
import { SupportButton } from "@/components/SupportButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useI18n } from "@/lib/i18n";

const T = {
  es: {
    badge:         "Tú propones el precio",
    hero_sub:      "Propón tu tarifa. Los choferes compiten por ti. Sin cobros extra. Sin sorpresas. El viaje que quieres, al precio que decides.",
    cta_ride:      "Solicitar viaje",
    cta_driver:    "Quiero ser chofer",
    signin:        "Iniciar sesión",
    get_started:   "Comenzar",
    arriving:      "Llega en 3 min",
    accepted:      "Aceptado",
    origin:        "Av. Presidente Masaryk, Polanco",
    dest:          "AICM Terminal 2",
    stats:         [{ v:"2M+", l:"Usuarios felices" },{ v:"50K+", l:"Choferes activos" },{ v:"98%", l:"Satisfacción" },{ v:"30s", l:"Tiempo de match" }],
    why_label:     "Por qué RideMe",
    why_title:     "Viajes en tus términos",
    why_sub:       "Construimos la plataforma de transporte que de verdad funciona para pasajeros y choferes.",
    features: [
      { title:"Tú decides el precio",      desc:"Propón tu tarifa y los choferes deciden si aceptan. Sin cobros dinámicos ni sorpresas." },
      { title:"Tu seguridad primero",       desc:"Todos los choferes verificados, con antecedentes revisados y calificados por la comunidad." },
      { title:"Rapidísimo",                 desc:"Match en menos de 30 segundos. Seguimiento en tiempo real desde el recojo hasta tu destino." },
      { title:"Programa tu viaje",          desc:"Planea con anticipación. Reserva viajes hasta 7 días antes al precio que tú elijas." },
    ],
    how_label:     "Proceso sencillo",
    how_title:     "¿Cómo funciona?",
    steps: [
      { n:"01", title:"Ingresa tu ruta",     desc:"Pon tu punto de recogida y destino. Ve la distancia y duración estimada." },
      { n:"02", title:"Propón tu precio",    desc:"Desliza para sugerir tu tarifa y ve qué tan competitiva es en tiempo real." },
      { n:"03", title:"Recibe ofertas",      desc:"Los choferes cercanos ven tu viaje y mandan ofertas. Acepta la mejor." },
    ],
    passenger_title: "Control total para el pasajero",
    passenger_sub:   "Ingresa origen, destino, método de pago y tu precio desde una pantalla enfocada y sin ruido.",
    driver_title:    "Choferes que eligen el trabajo que les conviene",
    driver_sub:      "Control total con solicitudes en vivo, contraofertas, suscripción y panel de ganancias.",
    test_label:      "Testimonios",
    test_title:      "Lo que dicen de nosotros",
    testimonials: [
      { name:"Valentina M.", role:"Usuaria frecuente", text:"Ahorro 30% comparado con otras apps porque yo propongo el precio. ¡Cambió mis viajes por completo!", av:"VM" },
      { name:"Carlos H.",    role:"Chofer socio",      text:"Yo elijo qué viajes acepto. Sin cobros dinámicos obligatorios, solo pago justo cada vez.", av:"CH" },
      { name:"Mariana L.",   role:"Usuaria fin de semana", text:"La app está increíble y la experiencia es súper fluida. ¡No cambiaría a nada más!", av:"ML" },
    ],
    cta_title:  "¿Listo para viajar inteligente?",
    cta_sub:    "Únete a millones de usuarios que ya eligen su precio en cada viaje.",
    cta_btn:    "Empieza gratis",
    nav_feat:   "Características",
    nav_how:    "¿Cómo funciona?",
    nav_driver: "Para choferes",
    footer_copy:"© 2026 RideMe. Todos los derechos reservados.",
    privacy:    "Privacidad",
    terms:      "Términos",
    support:    "Soporte",
  },
  en: {
    badge:         "Name your price ride-hailing",
    hero_sub:      "Propose your own fare. Drivers compete for your ride. No surge. No surprises. The ride you want, at the price you choose.",
    cta_ride:      "Request a Ride",
    cta_driver:    "Become a Driver",
    signin:        "Sign In",
    get_started:   "Get Started",
    arriving:      "Arriving in 3 min",
    accepted:      "Accepted",
    origin:        "123 Main St, Downtown",
    dest:          "Airport Terminal B",
    stats:         [{ v:"2M+", l:"Happy Riders" },{ v:"50K+", l:"Active Drivers" },{ v:"98%", l:"Satisfaction Rate" },{ v:"30s", l:"Avg Match Time" }],
    why_label:     "Why RideMe",
    why_title:     "Rides on your terms",
    why_sub:       "We built a rideshare that actually works for passengers and drivers.",
    features: [
      { title:"Name Your Price",  desc:"Set your own fare. No surge pricing, no guessing. Drivers see your offer and decide." },
      { title:"Safety First",     desc:"All drivers verified, background-checked, and rated. Your safety is our priority." },
      { title:"Lightning Fast",   desc:"Matches in under 30 seconds. Real-time tracking from pickup to drop-off." },
      { title:"Schedule Rides",   desc:"Plan ahead. Schedule rides up to 7 days in advance at your preferred price." },
    ],
    how_label:     "Simple process",
    how_title:     "How it works",
    steps: [
      { n:"01", title:"Enter Your Route",   desc:"Set your pickup and drop-off location. See estimated distance and duration." },
      { n:"02", title:"Name Your Price",    desc:"Slide to propose your fare. See how competitive your price is in real-time." },
      { n:"03", title:"Get Offers",         desc:"Nearby drivers see your trip and send offers. Accept the best one." },
    ],
    passenger_title: "Passenger control, premium flow",
    passenger_sub:   "Set pickup, destination, payment method and your price from a focused ride request surface.",
    driver_title:    "Drivers choose the work that pays",
    driver_sub:      "Drivers stay in control with live requests, counter-offers, subscription status and earnings.",
    test_label:      "Testimonials",
    test_title:      "What people say",
    testimonials: [
      { name:"Valentina M.", role:"Frequent Rider",   text:"I save 30% compared to other apps because I set my own price. Total game changer!", av:"VM" },
      { name:"Carlos H.",    role:"Driver Partner",   text:"I choose which rides to accept. No mandatory surge, just fair pay every time.", av:"CH" },
      { name:"Mariana L.",   role:"Weekend Rider",    text:"The app looks amazing and the experience is incredibly smooth. Would not switch!", av:"ML" },
    ],
    cta_title:  "Ready to ride smarter?",
    cta_sub:    "Join millions of riders who set their own price.",
    cta_btn:    "Get Started Free",
    nav_feat:   "Features",
    nav_how:    "How It Works",
    nav_driver: "For Drivers",
    footer_copy:"© 2026 RideMe. All rights reserved.",
    privacy:    "Privacy",
    terms:      "Terms",
    support:    "Support",
  },
} as const;

const iColors = ["#6C63FF","#00D4AA","#F59E0B","#EF4444"];
const iIcons  = [DollarSign, Shield, Zap, Clock];

const cV = { hidden:{opacity:0}, visible:{opacity:1,transition:{staggerChildren:0.1}} };
const iV = { hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{duration:0.6,ease:"easeOut"}} };

export default function LandingPage() {
  const { lang, setLang } = useI18n();
  const t = T[lang] as typeof T["es"];
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start","end start"] });
  const heroOpacity = useTransform(scrollYProgress,[0,1],[1,0]);
  const heroY       = useTransform(scrollYProgress,[0,1],[0,-80]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* NAV */}
      <nav className="safe-top sticky top-0 z-50 border-b border-white/[0.06] bg-surface/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center">
              <Car size={16} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">RideMe</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features"    className="hover:text-white transition-colors">{t.nav_feat}</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">{t.nav_how}</a>
            <a href="#drivers"     className="hover:text-white transition-colors">{t.nav_driver}</a>
          </div>
          <div className="flex items-center gap-3">
            {/* ES/EN toggle */}
            <div className="hidden sm:flex gap-1">
              {(["es","en"] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${lang===l?"bg-[#6C63FF]/20 text-[#6C63FF]":"text-white/30 hover:text-white/60"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link href="/sign-in" className="hidden px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
              {t.signin}
            </Link>
            <Link href="/sign-up" className="btn-gradient text-sm px-5 py-2 rounded-xl font-semibold">
              {t.get_started}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative flex min-h-[92svh] items-center justify-center overflow-hidden">
        <img src="/brand/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,15,0.88),rgba(10,10,15,0.52),rgba(10,10,15,0.72))]" />
        <motion.div style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-20 text-center sm:px-6">

          <motion.div initial={{ opacity:0,scale:0.8 }} animate={{ opacity:1,scale:1 }} transition={{ duration:0.5 }}
            className="inline-flex items-center gap-2 bg-[#6C63FF]/10 border border-[#6C63FF]/30 rounded-full px-4 py-1.5 text-sm text-[#6C63FF] font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse" />
            {t.badge}
          </motion.div>

          <motion.h1 initial={{ opacity:0,y:40 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7,delay:0.1 }}
            className="mb-6 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
            RideMe
          </motion.h1>

          <motion.p initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7,delay:0.2 }}
            className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-white/70 sm:text-2xl">
            {t.hero_sub}
          </motion.p>

          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6,delay:0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up" className="btn-gradient flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold w-full sm:w-auto justify-center">
              {t.cta_ride}
            </Link>
            <Link href="/driver/onboarding" className="flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all w-full sm:w-auto justify-center text-white">
              {t.cta_driver}
            </Link>
          </motion.div>

          {/* Mock ride card */}
          <motion.div initial={{ opacity:0,y:60,scale:0.95 }} animate={{ opacity:1,y:0,scale:1 }} transition={{ duration:0.8,delay:0.5 }}
            className="mt-16 max-w-sm mx-auto">
            <div className="card glass p-5 text-left rounded-3xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center text-sm font-bold">JD</div>
                <div>
                  <div className="font-semibold text-sm">Juan D.</div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    <Star size={10} fill="currentColor" />
                    <span className="text-white/50">4.97 · Toyota Corolla</span>
                  </div>
                </div>
                <div className="ml-auto font-mono font-bold text-[#00D4AA] text-xl">$95</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#6C63FF] mt-0.5 flex-shrink-0" />
                  <span className="text-white/70">{t.origin}</span>
                </div>
                <div className="w-px h-4 ml-[7px] border-l border-dashed border-white/20" />
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#00D4AA] mt-0.5 flex-shrink-0" />
                  <span className="text-white/70">{t.dest}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                <Clock size={12} />
                <span>{t.arriving}</span>
                <span className="ml-auto text-[#22C55E] font-medium">● {t.accepted}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/[0.06] bg-surface py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {t.stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }} className="text-center">
              <div className="text-4xl sm:text-5xl font-black gradient-text font-mono">{s.v}</div>
              <div className="text-muted-foreground text-sm mt-1">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-100px" }} variants={cV} className="text-center mb-16">
          <motion.div variants={iV} className="text-[#6C63FF] text-sm font-semibold uppercase tracking-widest mb-4">{t.why_label}</motion.div>
          <motion.h2 variants={iV} className="text-4xl sm:text-5xl font-black mb-4">{t.why_title}</motion.h2>
          <motion.p variants={iV} className="text-white/50 text-lg max-w-xl mx-auto">{t.why_sub}</motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-50px" }} variants={cV} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.features.map((f, i) => {
            const Icon = iIcons[i];
            return (
              <motion.div key={i} variants={iV} whileHover={{ y:-4, scale:1.01 }} className="card card-interactive p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background:`${iColors[i]}20` }}>
                  <Icon size={24} style={{ color: iColors[i] }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-[#111118]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={cV} className="text-center mb-16">
            <motion.div variants={iV} className="text-[#00D4AA] text-sm font-semibold uppercase tracking-widest mb-4">{t.how_label}</motion.div>
            <motion.h2 variants={iV} className="text-4xl sm:text-5xl font-black">{t.how_title}</motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {t.steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.15 }} className="relative">
                <div className="text-7xl font-black gradient-text opacity-20 font-mono mb-4">{s.n}</div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-white/50 leading-relaxed">{s.desc}</p>
                {i < 2 && <ChevronRight size={24} className="hidden md:block absolute top-8 -right-4 text-white/20" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APP & DRIVER PREVIEW */}
      <section id="drivers" className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="overflow-hidden rounded-3xl border border-white/10 bg-surface">
            <img src="/brand/app.jpg" alt="App de pasajero RideMe" className="h-72 w-full object-cover sm:h-96" />
            <div className="p-6">
              <h2 className="text-2xl font-black">{t.passenger_title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.passenger_sub}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }} className="overflow-hidden rounded-3xl border border-white/10 bg-surface">
            <img src="/brand/driver.jpg" alt="App de chofer RideMe" className="h-72 w-full object-cover sm:h-96" />
            <div className="p-6">
              <h2 className="text-2xl font-black">{t.driver_title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.driver_sub}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={cV} className="text-center mb-16">
          <motion.div variants={iV} className="text-[#6C63FF] text-sm font-semibold uppercase tracking-widest mb-4">{t.test_label}</motion.div>
          <motion.h2 variants={iV} className="text-4xl sm:text-5xl font-black">{t.test_title}</motion.h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={cV} className="grid md:grid-cols-3 gap-6">
          {t.testimonials.map((t2) => (
            <motion.div key={t2.name} variants={iV} whileHover={{ y:-4 }} className="card p-6 rounded-2xl">
              <div className="flex items-center gap-1 mb-4">
                {[0,1,2,3,4].map(i => <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />)}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">"{t2.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center text-xs font-bold">{t2.av}</div>
                <div>
                  <div className="font-semibold text-sm">{t2.name}</div>
                  <div className="text-white/40 text-xs">{t2.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity:0,scale:0.95 }} whileInView={{ opacity:1,scale:1 }} viewport={{ once:true }}
            className="relative overflow-hidden rounded-3xl p-12"
            style={{ background:"linear-gradient(135deg,rgba(108,99,255,0.2),rgba(0,212,170,0.2))", border:"1px solid rgba(108,99,255,0.3)" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/10 to-[#00D4AA]/10" />
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-black mb-4">{t.cta_title}</h2>
              <p className="text-white/60 text-lg mb-8">{t.cta_sub}</p>
              <Link href="/sign-up" className="btn-gradient inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold justify-center">
                {t.cta_btn} <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center">
              <Car size={13} className="text-white" />
            </div>
            <span className="font-black text-lg">RideMe</span>
          </div>
          <div className="text-white/30 text-sm">{t.footer_copy}</div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">{t.privacy}</a>
            <a href="#" className="hover:text-white transition-colors">{t.terms}</a>
            <a href="#" className="hover:text-white transition-colors">{t.support}</a>
          </div>
        </div>
      </footer>

      <ThemeToggle className="fixed bottom-24 left-4 z-[70] sm:hidden" />
      <SupportButton />
    </div>
  );
}
