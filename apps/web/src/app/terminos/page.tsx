import Link from "next/link";

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 text-[var(--ink)]">
      <Link href="/" className="text-sm text-[var(--muted)]">← RideMe</Link>
      <h1 className="mt-6 text-4xl">Términos</h1>
      <p className="mt-4 text-[var(--muted)] leading-relaxed">
        RideMe es una plataforma de encuentro. El pasajero propone una tarifa. El chofer acepta o contraoferta.
        El viaje es un acuerdo entre ambos. RideMe no es una flotilla propia.
      </p>
      <p className="mt-4 text-[var(--muted)] leading-relaxed">
        Quien conduce debe tener licencia vigente y vehículo en regla. Quien viaja paga la tarifa acordada.
        La comisión de la casa se informa antes de confirmar. Hoy la plataforma está en apertura; los cobros reales se activan cuando existan las llaves de Connect y Mercado Pago.
      </p>
    </main>
  );
}
