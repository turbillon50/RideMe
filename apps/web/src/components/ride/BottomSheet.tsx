"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LocationInputs } from "./LocationInputs";
import { VehicleSelector } from "./VehicleSelector";
import { PriceSelector } from "./PriceSelector";
import { PaymentSelector } from "./PaymentSelector";
import { DriversNearby } from "./DriversNearby";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useTripStore } from "@/store/tripStore";
import { useI18n } from "@/lib/i18n";

type VehicleType = "standard" | "comfort" | "xl";
type PaymentMethod = "cash" | "card";

export function BottomSheet({ nearbyDriversCount = 0 }: { nearbyDriversCount?: number }) {
  const router = useRouter();
  const { location } = useGeolocation({ watch: true });
  const { t } = useI18n();
  const center = location
    ? { lat: location.latitude, lng: location.longitude }
    : { lat: 19.4326, lng: -99.1332 };

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("standard");
  const [price, setPrice] = useState(95);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSwap = () => { const tmp = pickup; setPickup(destination); setDestination(tmp); };

  const handleSearch = async () => {
    if (!pickup || !destination) return;
    setIsSearching(true);
    setError("");
    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          isScheduled: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear viaje");
      const ride = data.data?.ride;
      if (ride) {
        useTripStore.getState().setActiveRide(ride);
        router.push("/app/offers");
      }
    } catch (err: any) {
      setError(err.message || "Error al buscar chofer");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div
      className="flex-1 rounded-t-3xl bg-card px-5 pb-8 pt-6"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="mb-6 flex justify-center">
        <div className="h-1 w-12 rounded-full bg-muted" />
      </div>
      <div className="flex flex-col gap-5">
        <LocationInputs pickup={pickup} destination={destination}
          onPickupChange={setPickup} onDestinationChange={setDestination} onSwap={handleSwap} />
        <VehicleSelector selected={vehicleType} onSelect={setVehicleType} />
        <PriceSelector price={price} onPriceChange={setPrice} />
        <PaymentSelector selected={paymentMethod} onSelect={setPaymentMethod} />
        {error && <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</p>}
        <motion.button onClick={handleSearch}
          disabled={isSearching || !pickup || !destination}
          className="w-full rounded-xl py-4 text-base font-semibold text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #22d3ee)' }}
          whileTap={{ scale: 0.98 }}
        >
          {isSearching ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              {t('searching')}
            </span>
          ) : t('search_driver')}
        </motion.button>
        {nearbyDriversCount > 0 && <DriversNearby count={nearbyDriversCount} />}
      </div>
    </motion.div>
  );
}
