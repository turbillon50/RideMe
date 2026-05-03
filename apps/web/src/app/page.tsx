'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, CreditCard, Star, Calendar, Headphones, Car,
  CheckCircle2, ArrowRight, MapPin, Phone, MessageCircle,
} from 'lucide-react';
import { RideMeLogo } from '@/components/brand/Logo';
import { LocaleToggle } from '@/components/ui/LocaleToggle';
import { useT } from '@/lib/i18n/LocaleProvider';

export default function LandingPage() {
  const t = useT();

  const features = [
    { icon: Car,         title: t.customRides,       desc: t.customRidesSub },
    { icon: Shield,      title: t.safetyFirst,       desc: t.safetyFirstSub },
    { icon: CreditCard,  title: t.flexiblePayments,  desc: t.flexiblePaymentsSub },
    { icon: Calendar,    title: t.scheduleRides,     desc: t.scheduleRidesSub },
    { icon: Star,        title: t.rateAndImprove,    desc: t.rateAndImproveSub },
    { icon: Headphones,  title: t.support247,        desc: t.support247Sub },
  ];

  const driverSteps = [
    { title: t.driverSetupEasyRegister,  desc: t.driverSetupEasyRegisterSub },
    { title: t.driverSetupSecureDocs,    desc: t.driverSetupSecureDocsSub },
    { title: t.driverSetupQuickApproval, desc: t.driverSetupQuickApprovalSub },
    { title: t.driverSetupStartEarning,  desc: t.driverSetupStartEarningSub },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {/* ─── Nav ─── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{
          background: 'rgba(255,255,255,0.85)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <RideMeLogo variant="lockup" size={32} />
          <div className="flex items-center gap-3">
            <LocaleToggle/>
            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 rounded-full transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t.signIn}
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold px-5 py-2 rounded-full text-white shadow-brand"
              style={{ background: 'var(--brand)' }}
            >
              {t.signUp}
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 60%)', filter: 'blur(80px)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,180,255,0.20) 0%, transparent 60%)', filter: 'blur(80px)' }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
          {/* Left: brand + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex justify-center lg:justify-start mb-6">
              <RideMeLogo variant="stack" size={120} showTagline glow/>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-5" style={{ color: 'var(--brand-deep)' }}>
              {t.customRides}
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0" style={{ color: 'var(--text-secondary)' }}>
              {t.customRidesSub} {t.negotiateHint}.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-white text-base font-semibold shadow-brand"
                style={{ background: 'var(--gradient-cta)' }}
              >
                {t.signUp} <ArrowRight size={18} />
              </Link>
              <Link
                href="/register?role=driver"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-semibold"
                style={{
                  color: 'var(--brand-deep)',
                  background: 'var(--surface)',
                  border: '1.5px solid var(--border-strong)',
                }}
              >
                <Car size={18} /> {t.becomeDriverCta}
              </Link>
            </div>
          </motion.div>

          {/* Right: phone mockup decorativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div
              className="relative w-[320px] h-[640px] rounded-[44px] p-3 shadow-modal"
              style={{ background: '#000' }}
            >
              <div
                className="w-full h-full rounded-[36px] overflow-hidden flex flex-col"
                style={{ background: 'var(--surface)' }}
              >
                {/* Notch */}
                <div className="h-7 flex items-center justify-center" style={{ background: '#000' }}>
                  <div className="w-24 h-5 bg-black rounded-full" />
                </div>
                {/* Header app */}
                <div className="px-5 pt-5 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-full grid place-items-center" style={{ background: 'var(--surface-2)' }}>
                      <span style={{ color: 'var(--text-primary)' }}>≡</span>
                    </div>
                    <RideMeLogo variant="lockup" size={22} />
                    <div className="w-9 h-9 rounded-full grid place-items-center" style={{ background: 'var(--surface-2)' }}>
                      <span>🔔</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black" style={{ color: 'var(--brand-deep)' }}>
                    {t.whereTo}
                  </h3>
                </div>
                <div className="flex-1 px-4 py-3 space-y-3" style={{ background: 'var(--bg)' }}>
                  <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <MapPin size={16} style={{ color: 'var(--brand)' }}/>
                    <div className="text-sm">
                      <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{t.origin}</div>
                      <div className="font-semibold">{t.myLocation}</div>
                    </div>
                  </div>
                  <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <MapPin size={16} style={{ color: 'var(--brand-deep)' }}/>
                    <div className="text-sm flex-1">
                      <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{t.destination}</div>
                      <div className="font-semibold" style={{ color: 'var(--text-muted)' }}>{t.whereTo}</div>
                    </div>
                  </div>
                  <div
                    className="rounded-2xl p-4"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                      {t.priceSuggestion}
                    </div>
                    <div className="font-mono text-2xl font-black" style={{ color: 'var(--brand-deep)' }}>
                      $120 – $145 <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>MXN</span>
                    </div>
                    <button
                      className="mt-3 w-full py-3 rounded-full text-sm font-semibold text-white"
                      style={{ background: 'var(--brand)', boxShadow: 'var(--shadow-brand)' }}
                    >
                      {t.searchDrivers}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-20" style={{ background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black text-center mb-3"
            style={{ color: 'var(--brand-deep)' }}
          >
            {t.whatYouGet}
          </motion.h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>
            {t.tagline}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-card-hover"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(37,99,235,0.10)', color: 'var(--brand)' }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--brand-deep)' }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Driver subscription CTA ─── */}
      <section className="py-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-sm uppercase tracking-widest font-bold mb-3" style={{ color: 'var(--brand)' }}>
              {t.driverSetup}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-6" style={{ color: 'var(--brand-deep)' }}>
              {t.becomeDriverCta}
            </h2>
            <ul className="space-y-4">
              {driverSteps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm flex-shrink-0"
                    style={{ background: 'var(--brand)', color: '#fff' }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold" style={{ color: 'var(--brand-deep)' }}>{s.title}</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 text-white"
            style={{ background: 'var(--gradient-brand-deep)', boxShadow: 'var(--shadow-modal)' }}
          >
            <div className="text-sm uppercase tracking-widest opacity-80 mb-2">{t.subscriptionTitle}</div>
            <div className="text-3xl font-black mb-1">{t.subscriptionSub}</div>
            <div className="text-sm opacity-80 mb-6">{t.tagline}</div>

            <ul className="space-y-3 mb-7">
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={18}/> {t.trial15}</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={18}/> {t.monthly400}</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={18}/> {t.benefitMoreRides}</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={18}/> {t.benefitVisibility}</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 size={18}/> {t.benefitPrioritySupport}</li>
            </ul>

            <Link
              href="/register?role=driver"
              className="block w-full py-4 rounded-full text-center font-bold transition-transform hover:scale-[1.02]"
              style={{ background: '#fff', color: '#0D1B3D' }}
            >
              {t.registerNow}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-10" style={{ background: 'var(--brand-deep)', color: 'rgba(255,255,255,0.85)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <RideMeLogo variant="lockup" size={28} textColor="#fff" />
          <div className="text-xs opacity-70">
            © 2026 RideMe · {t.tagline}
          </div>
          <div className="flex items-center gap-4 text-xs opacity-80">
            <Link href="/privacy" className="hover:opacity-100">{t.privacyPolicy}</Link>
            <Link href="/terms"   className="hover:opacity-100">{t.termsConditions}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
