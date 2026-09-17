'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapView } from '@/components/maps/MapView';
import { BottomSheet } from '@/components/ride/BottomSheet';
import { BottomNav } from '@/components/layout/BottomNav';
import { RideShell, BrandChip } from '@/components/shell/RideShell';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useTripStore } from '@/store/tripStore';

export default function PassengerMapPage() {
  const router = useRouter();
  const { activeRide } = useTripStore();
  const { location } = useGeolocation({ watch: true, enableHighAccuracy: true });

  const [nearbyDrivers, setNearbyDrivers] = useState<Array<{ id: string; latitude: number; longitude: number }>>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const center = location
    ? { lat: location.latitude, lng: location.longitude }
    : { lat: 19.4326, lng: -99.1332 };

  useEffect(() => {
    if (activeRide?.status === 'accepted' || activeRide?.status === 'driver_en_route') {
      router.push('/app/trip');
    }
    if (activeRide?.status === 'searching' || activeRide?.status === 'negotiating') {
      router.push('/app/offers');
    }
  }, [activeRide?.status, router]);

  useEffect(() => {
    if (!location) return;
    fetch(`/api/drivers/nearby?lat=${location.latitude}&lng=${location.longitude}&radius=8000`)
      .then((r) => r.json())
      .then((d) => setNearbyDrivers(d.data ?? []))
      .catch(() => {});
  }, [location?.latitude, location?.longitude]);

  if (!mounted) return <div className="min-h-dvh bg-[var(--rm-bg)]" />;

  return (
    <RideShell
      map={
        <MapView
          center={center}
          userLocation={location ? { lat: location.latitude, lng: location.longitude } : undefined}
          drivers={nearbyDrivers}
          className="h-full w-full"
        />
      }
      topLeft={<BrandChip />}
      panel={<BottomSheet nearbyDriversCount={nearbyDrivers.length} />}
      nav={<BottomNav role="passenger" />}
    />
  );
}
