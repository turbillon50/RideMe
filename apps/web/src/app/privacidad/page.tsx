import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 text-[var(--ink)]">
      <Link href="/" className="text-sm text-[var(--muted)]">← RideMe</Link>
      <h1 className="mt-6 text-4xl">Privacidad</h1>
      <p className="mt-4 text-[var(--muted)] leading-relaxed">
        RideMe guarda lo mínimo para operar un viaje: cuenta, ruta, tarifa propuesta, ofertas y calificación.
        No vendemos listas de pasajeros. Los datos de pago los procesa el proveedor (Stripe / Mercado Pago) cuando el cobro esté activo.
      </p>
      <p className="mt-4 text-[var(--muted)] leading-relaxed">
        Puedes pedir baja de cuenta escribiendo a soporte desde la app. Este aviso se actualizará cuando el cobro real quede encendido.
      </p>
    </main>
  );
}
