'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';

interface Driver {
  id: string;
  latitude: number;
  longitude: number;
  heading?: number;
}

interface MapViewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  drivers?: Driver[];
  userLocation?: { lat: number; lng: number };
  driverLocation?: { lat: number; lng: number };
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}

export function MapView({
  center = { lat: 19.4326, lng: -99.1332 },
  zoom = 14,
  drivers = [],
  userLocation,
  driverLocation,
  origin,
  destination,
  onMapClick,
  className = 'w-full h-full',
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const driverMarkers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const driverTrackMarker = useRef<mapboxgl.Marker | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [center.lng, center.lat],
      zoom: zoom,
      attributionControl: false,
    });

    map.on('load', () => {
      mapInstance.current = map;
      setLoaded(true);

      if (onMapClick) {
        map.on('click', (e) => {
          onMapClick(e.lngLat.lat, e.lngLat.lng);
        });
      }
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update center
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.flyTo({
        center: [center.lng, center.lat],
        essential: true,
      });
    }
  }, [center.lat, center.lng]);

  // User location marker
  useEffect(() => {
    if (!loaded || !mapInstance.current) return;
    const pos = userLocation || center;

    if (!userMarker.current) {
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-[#6C63FF] border-2 border-white rounded-full shadow-lg';
      userMarker.current = new mapboxgl.Marker(el)
        .setLngLat([pos.lng, pos.lat])
        .addTo(mapInstance.current);
    } else {
      userMarker.current.setLngLat([pos.lng, pos.lat]);
    }
  }, [loaded, userLocation?.lat, userLocation?.lng, center]);

  // Driver tracking marker
  useEffect(() => {
    if (!loaded || !mapInstance.current || !driverLocation) return;

    if (!driverTrackMarker.current) {
      const el = document.createElement('div');
      el.className = 'w-6 h-6 bg-[#00D4AA] border-2 border-white rounded-full shadow-lg flex items-center justify-center';
      el.innerHTML = '<div class="w-2 h-2 bg-white rounded-full"></div>';
      driverTrackMarker.current = new mapboxgl.Marker(el)
        .setLngLat([driverLocation.lng, driverLocation.lat])
        .addTo(mapInstance.current);
    } else {
      driverTrackMarker.current.setLngLat([driverLocation.lng, driverLocation.lat]);
    }
    mapInstance.current.panTo([driverLocation.lng, driverLocation.lat]);
  }, [loaded, driverLocation?.lat, driverLocation?.lng]);

  // Nearby driver markers
  useEffect(() => {
    if (!loaded || !mapInstance.current) return;

    const currentIds = new Set(drivers.map(d => d.id));

    // Remove stale markers
    driverMarkers.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        driverMarkers.current.delete(id);
      }
    });

    // Add/update markers
    drivers.forEach(d => {
      if (driverMarkers.current.has(d.id)) {
        driverMarkers.current.get(d.id)!.setLngLat([d.longitude, d.latitude]);
      } else {
        const el = document.createElement('div');
        el.className = 'w-4 h-4 bg-[#00D4AA]/80 border border-white/50 rounded-sm transform rotate-45';
        const marker = new mapboxgl.Marker(el)
          .setLngLat([d.longitude, d.latitude])
          .addTo(mapInstance.current!);
        driverMarkers.current.set(d.id, marker);
      }
    });
  }, [loaded, drivers]);

  // Route Rendering
  useEffect(() => {
    if (!loaded || !mapInstance.current || !origin || !destination) return;

    const map = mapInstance.current;

    const getRoute = async () => {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson: GeoJSON.Feature = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

      if (map.getSource('route')) {
        (map.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource('route', {
          type: 'geojson',
          data: geojson
        });
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#6C63FF',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }

      // Fit bounds
      const bounds = new mapboxgl.LngLatBounds();
      route.forEach((coord: [number, number]) => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50 });
    };

    getRoute();
  }, [loaded, origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

  return (
    <div className={className} ref={mapContainerRef}>
      {!loaded && (
        <div className="w-full h-full bg-[#0A0A0F] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[rgba(108,99,255,0.3)] border-t-[#6C63FF] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
