"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface LocationCoords { latitude: number; longitude: number; }
interface GeolocationState {
  location: LocationCoords | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
  hasPermission: boolean | null;
}

export const useGeolocation = (options: {
  watch?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
} = {}) => {
  const { watch = false, enableHighAccuracy = true, timeout = 15000, maximumAge = 10000 } = options;
  const [state, setState] = useState<GeolocationState>({
    location: null, accuracy: null, error: null, isLoading: false, hasPermission: null,
  });
  const watchIdRef = useRef<number | null>(null);

  const geoOptions: PositionOptions = { enableHighAccuracy, timeout, maximumAge };

  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    setState(prev => ({
      ...prev,
      location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
      accuracy: pos.coords.accuracy,
      error: null,
      isLoading: false,
      hasPermission: true,
    }));
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    const msgs: Record<number, string> = {
      1: 'Permiso de ubicación denegado. Actívalo en Ajustes.',
      2: 'Ubicación no disponible.',
      3: 'Tiempo agotado obteniendo ubicación.',
    };
    setState(prev => ({
      ...prev,
      error: msgs[err.code] ?? 'Error de ubicación',
      isLoading: false,
      hasPermission: err.code === 1 ? false : prev.hasPermission,
    }));
  }, []);

  const requestPermission = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState(p => ({ ...p, error: 'Geolocalización no disponible en este dispositivo' }));
      return;
    }
    setState(p => ({ ...p, isLoading: true, error: null }));
    if (watch) {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, geoOptions);
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, geoOptions);
    }
  }, [watch, handleSuccess, handleError, geoOptions]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    // SIEMPRE pedir permiso al montar — fix del bug original
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then(result => {
          if (result.state === 'denied') {
            setState(p => ({ ...p, hasPermission: false, error: 'Permiso denegado. Actívalo en Ajustes > Privacidad.' }));
          } else {
            // 'granted' o 'prompt' → siempre intentar
            requestPermission();
          }
          result.onchange = () => {
            if (result.state === 'granted') requestPermission();
          };
        })
        .catch(() => requestPermission()); // iOS Safari fallback
    } else {
      requestPermission(); // Fallback directo
    }
    return () => stopWatching();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, requestPermission, requestLocation: requestPermission, stopWatching };
};
