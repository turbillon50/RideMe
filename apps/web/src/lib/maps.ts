import { Coordinates } from '@/types';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const calculateDistance = (a: Coordinates, b: Coordinates): number => {
  const R = 6371; // Earth radius in km
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;

  const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * y;
};

export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const getDirections = async (
  origin: Coordinates,
  destination: Coordinates,
): Promise<any | null> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
    );
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0];
    }
    return null;
  } catch (error) {
    console.error('Directions error:', error);
    return null;
  }
};

export const formatDistance = (km: number): string => {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
};

export const formatDuration = (seconds: number): string => {
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
