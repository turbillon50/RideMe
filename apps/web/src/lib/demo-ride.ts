import type { ActiveRide } from '@/types';

export const DEMO_RIDE: ActiveRide = {
  id: 'demo-ride',
  status: 'searching',
  origin_address: 'Centro, Guadalajara',
  destination_address: 'Aeropuerto GDL',
  proposed_price: 95,
  final_price: 95,
  payment_method: 'cash',
  passenger_name: 'Tú',
};

export const DEMO_OFFERS = [
  {
    id: 'o1',
    name: 'Juan D.',
    initials: 'JD',
    rating: 4.97,
    trips: 1240,
    car: 'Toyota Corolla',
    etaMin: 3,
    price: 95,
    plate: 'GDL-204-A',
  },
  {
    id: 'o2',
    name: 'María S.',
    initials: 'MS',
    rating: 4.99,
    trips: 880,
    car: 'Nissan Versa',
    etaMin: 5,
    price: 88,
    plate: 'JAL-918-B',
  },
  {
    id: 'o3',
    name: 'Carlos H.',
    initials: 'CH',
    rating: 4.91,
    trips: 2104,
    car: 'Kia Rio',
    etaMin: 7,
    price: 110,
    plate: 'MTY-441-C',
  },
];

export const DEMO_TRIP: ActiveRide = {
  ...DEMO_RIDE,
  id: 'demo-trip',
  status: 'driver_en_route',
  driver_name: 'Juan D.',
  driver_rating: 4.97,
  vehicle_make: 'Toyota',
  vehicle_model: 'Corolla',
  plate_number: 'GDL-204-A',
};
