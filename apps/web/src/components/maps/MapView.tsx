'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

function makeDot(color: string, size: number): HTMLDivElement {
  const el = document.createElement('div');
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = '50%';
  el.style.background = color;
  el.style.border = '3px solid #ffffff';
  el.style.boxShadow = `0 0 12px ${color}`;
  el.style.cursor = 'pointer';
  return el;
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const driverMarkers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const driverTrackMarker = useRef<mapboxgl.Marker | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Init map (once)
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: MAP_STYLE,
      center: [center.lng, center.lat],
      zoom,
      attributionControl: false,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    if (onMapClick) {
      map.on('click', (e) => onMapClick(e.lngLat.lat, e.lngLat.lng));
    }
    map.on('load', () => {
      setLoaded(true);
      map.resize();
    });
    mapInstance.current = map;
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(mapRef.current);
    return () => {
      ro.disconnect();
      map.remove();
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center
  useEffect(() => {
    if (mapInstance.current) mapInstance.current.setCenter([center.lng, center.lat]);
  }, [center.lat, center.lng]);

  // User location marker
  useEffect(() => {
    if (!loaded || !mapInstance.current) return;
    const pos = userLocation || center;
    if (!userMarker.current) {
      userMarker.current = new mapboxgl.Marker({ element: makeDot('#6C63FF', 18) })
        .setLngLat([pos.lng, pos.lat])
        .addTo(mapInstance.current);
    } else {
      userMarker.current.setLngLat([pos.lng, pos.lat]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, userLocation?.lat, userLocation?.lng]);

  // Driver tracking marker
  useEffect(() => {
    if (!loaded || !mapInstance.current || !driverLocation) return;
    if (!driverTrackMarker.current) {
      driverTrackMarker.current = new mapboxgl.Marker({ element: makeDot('#00D4AA', 22) })
        .setLngLat([driverLocation.lng, driverLocation.lat])
        .addTo(mapInstance.current);
    } else {
      driverTrackMarker.current.setLngLat([driverLocation.lng, driverLocation.lat]);
    }
    mapInstance.current.panTo([driverLocation.lng, driverLocation.lat]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, driverLocation?.lat, driverLocation?.lng]);

  // Nearby driver markers
  useEffect(() => {
    if (!loaded || !mapInstance.current) return;
    const currentIds = new Set(drivers.map((d) => d.id));

    driverMarkers.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        driverMarkers.current.delete(id);
      }
    });

    drivers.forEach((d) => {
      const existing = driverMarkers.current.get(d.id);
      if (existing) {
        existing.setLngLat([d.longitude, d.latitude]);
      } else {
        const marker = new mapboxgl.Marker({ element: makeDot('#00D4AA', 12) })
          .setLngLat([d.longitude, d.latitude])
          .addTo(mapInstance.current!);
        driverMarkers.current.set(d.id, marker);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, drivers]);

  // Route (origin -> destination) via Mapbox Directions
  useEffect(() => {
    if (!loaded || !mapInstance.current || !origin || !destination) return;
    const map = mapInstance.current;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const geometry = data?.routes?.[0]?.geometry;
        if (!geometry) return;
        const gj: any = { type: 'Feature', properties: {}, geometry };
        const src = map.getSource('route') as mapboxgl.GeoJSONSource | undefined;
        if (src) {
          src.setData(gj);
        } else {
          map.addSource('route', { type: 'geojson', data: gj });
          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#6C63FF', 'line-width': 4, 'line-opacity': 0.9 },
          });
        }
        const bounds = new mapboxgl.LngLatBounds(
          [origin.lng, origin.lat],
          [origin.lng, origin.lat],
        );
        bounds.extend([destination.lng, destination.lat]);
        map.fitBounds(bounds, { padding: 70, maxZoom: 15 });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="absolute inset-0" />
      {!loaded && (
        <div className="absolute inset-0 bg-[#0A0A0F] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[rgba(108,99,255,0.3)] border-t-[#6C63FF] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
