'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LocationInputs } from './LocationInputs';
import { VehicleSelector } from './VehicleSelector';
import { PriceSelector } from './PriceSelector';
import { PaymentSelector } from './PaymentSelector';
import { DriversNearby } from './DriversNearby';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useTripStore } from '@/store/tripStore';
import { useI18n } from '@/lib/i18n';

type VehicleType = 'standard' | 'comfort' | 'xl';
type PaymentMethod = 'cash' | 'card';

export function BottomSheet({ nearbyDriversCount = 0 }: { nearbyDriversCount?: number }) {
  const router = useRouter();
  const { location } = useGeolocation({ watch: true });
  const { t } = useI18n();
  const center = location
    ? { lat: location.latitude, lng: location.longitude }
    : { lat: 19.4326, lng: -99.1332 };

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('standard');
  const [rideType, setRideType] = useState<'standard' | 'airport' | 'shared'>('standard');
  const [invoiceRequested, setInvoiceRequested] = useState(false);
  const [price, setPrice] = useState(95);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSwap = () => {
    const tmp = pickup;
    setPickup(destination);
    setDestination(tmp);
  };

  const handleSearch = async () => {
    if (!pickup || !destination) return;
    setIsSearching(true);
    setError('');
    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originAddress: pickup,
          originLatitude: center.lat,
          originLongitude: center.lng,
          destinationAddress: destination,
          destinationLatitude: center.lat + 0.012,
          destinationLongitude: center.lng + 0.008,
          proposedPrice: price,
          paymentMethod,
          vehicleType,
          rideType,
          invoiceRequested,
          isScheduled: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear viaje');
      const ride = data.data?.ride;
      if (ride) {
        useTripStore.getState().setActiveRide(ride);
        router.push('/app/offers');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al buscar chofer');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <header>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--rm-subtle)]">
          Pasajero
        </p>
        <h1 className="text-xl font-semibold tracking-tight">¿A dónde vas?</h1>
      </header>

      <LocationInputs
        pickup={pickup}
        destination={destination}
        onPickupChange={setPickup}
        onDestinationChange={setDestination}
        onSwap={handleSwap}
      />

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--rm-subtle)]">
          Tipo de viaje
        </p>
        <div className="flex gap-2">
          {([['standard', 'Estándar'], ['airport', 'Aeropuerto'], ['shared', 'Compartido']] as const).map(
            ([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setRideType(key)}
                className={`h-11 flex-1 rounded-xl text-xs font-semibold ${
                  rideType === key
                    ? 'bg-[var(--rm-accent)] text-[var(--rm-accent-fg)]'
                    : 'bg-[var(--rm-raised)] text-[var(--rm-muted)] ring-1 ring-[var(--rm-line)]'
                }`}
              >
                {label}
              </button>
            ),
          )}
        </div>
        {rideType === 'airport' && (
          <p className="mt-2 text-[11px] text-[var(--rm-warn)]">Aeropuerto: mínimo $800 MXN · reservación</p>
        )}
      </div>

      <VehicleSelector selected={vehicleType} onSelect={setVehicleType} />
      <PriceSelector price={price} onPriceChange={setPrice} />
      <PaymentSelector selected={paymentMethod} onSelect={setPaymentMethod} />

      <label className="flex min-h-11 items-center gap-2 text-sm text-[var(--rm-muted)]">
        <input
          type="checkbox"
          checked={invoiceRequested}
          onChange={(e) => setInvoiceRequested(e.target.checked)}
        />
        Necesito factura (CFDI)
      </label>

      {error && <p className="text-center text-sm text-[var(--rm-danger)]">{error}</p>}

      <motion.button
        onClick={handleSearch}
        disabled={isSearching || !pickup || !destination}
        whileTap={{ scale: 0.96 }}
        className="h-12 w-full rounded-2xl bg-[var(--rm-accent)] text-base font-semibold text-[var(--rm-accent-fg)] disabled:opacity-40"
      >
        {isSearching ? t('searching') : 'Pedir viaje'}
      </motion.button>
      {nearbyDriversCount > 0 && <DriversNearby count={nearbyDriversCount} />}
    </div>
  );
}
