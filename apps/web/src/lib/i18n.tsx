"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const T = {
  es: {
    where_pickup:     '¿Dónde te recogemos?',
    where_drop:       '¿A dónde vas?',
    search_driver:    'Buscar chofer',
    searching:        'Buscando chofer...',
    estimated_price:  'Precio sugerido',
    payment:          'Pago',
    cash:             'Efectivo',
    card:             'Tarjeta',
    standard:         'Estándar',
    comfort:          'Confort',
    schedule:         'Programar',
    map_tab:          'Mapa',
    history_tab:      'Historial',
    profile_tab:      'Perfil',
    driver_accepted:  'Chofer confirmado — en camino',
    driver_en_route:  'Tu chofer está en camino',
    driver_arrived:   'Tu chofer llegó',
    in_progress:      'En camino a tu destino',
    completed:        '¡Llegaste!',
    cancel_ride:      'Cancelar viaje',
    rate_driver:      'Califica tu viaje',
    send_rating:      'Enviar calificación',
    driver_online:    'En línea',
    driver_offline:   'Desconectado',
    new_ride:         'Nuevo viaje',
    accept:           'Aceptar',
    reject:           'Rechazar',
    my_profile:       'Mi Perfil',
    save_changes:     'Guardar cambios',
    sign_out:         'Cerrar sesión',
    appearance:       'Apariencia',
    theme_light_dark: 'Tema claro u oscuro',
    payment_methods:  'Métodos de pago',
    no_cards:         'Sin tarjetas guardadas',
    add_card:         'Agregar',
    name:             'Nombre completo',
    no_phone:         'Sin teléfono',
    driver_home:      'Panel del conductor',
    today_earnings:   'Ganancias de hoy',
    total_rides:      'Viajes realizados',
    rating:           'Calificación',
    pickup_at:        'Recoger en',
    dropoff_at:       'Dejar en',
    go_to_passenger:  'Ir al pasajero',
    passenger_aboard: 'Pasajero a bordo',
    finish_ride:      'Finalizar viaje',
    language:         'Idioma',
  },
  en: {
    where_pickup:     'Where should we pick you up?',
    where_drop:       'Where are you going?',
    search_driver:    'Find driver',
    searching:        'Looking for driver...',
    estimated_price:  'Suggested price',
    payment:          'Payment',
    cash:             'Cash',
    card:             'Card',
    standard:         'Standard',
    comfort:          'Comfort',
    schedule:         'Schedule',
    map_tab:          'Map',
    history_tab:      'History',
    profile_tab:      'Profile',
    driver_accepted:  'Driver confirmed — heading your way',
    driver_en_route:  'Your driver is on the way',
    driver_arrived:   'Your driver has arrived',
    in_progress:      'On the way to your destination',
    completed:        'You\'ve arrived!',
    cancel_ride:      'Cancel ride',
    rate_driver:      'Rate your trip',
    send_rating:      'Submit rating',
    driver_online:    'Online',
    driver_offline:   'Offline',
    new_ride:         'New ride',
    accept:           'Accept',
    reject:           'Reject',
    my_profile:       'My Profile',
    save_changes:     'Save changes',
    sign_out:         'Sign out',
    appearance:       'Appearance',
    theme_light_dark: 'Light or dark theme',
    payment_methods:  'Payment methods',
    no_cards:         'No saved cards',
    add_card:         'Add',
    name:             'Full name',
    no_phone:         'No phone',
    driver_home:      'Driver dashboard',
    today_earnings:   'Today\'s earnings',
    total_rides:      'Rides completed',
    rating:           'Rating',
    pickup_at:        'Pick up at',
    dropoff_at:       'Drop off at',
    go_to_passenger:  'Go to passenger',
    passenger_aboard: 'Passenger on board',
    finish_ride:      'Finish ride',
    language:         'Language',
  },
} as const;

type Lang = 'es' | 'en';
type TKey = keyof typeof T.es;

interface I18nCtx { t: (k: TKey) => string; lang: Lang; setLang: (l: Lang) => void; }
const Ctx = createContext<I18nCtx>({ t: (k) => k, lang: 'es', setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es');
  useEffect(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('rideme-lang') : null;
    if (stored === 'en' || stored === 'es') setLangState(stored);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('rideme-lang', l); } catch {}
  };
  const t = (k: TKey) => T[lang][k] ?? T.es[k] ?? String(k);
  return <Ctx.Provider value={{ t, lang, setLang }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
