'use client';

import './globals.css';
import { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { LocaleProvider } from '@/lib/i18n/LocaleProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppProviders({ children }: { children: ReactNode }) {
  const { tokens, isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken) {
      connectSocket(tokens.accessToken);
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, tokens?.accessToken]);

  return <>{children}</>;
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#2563EB" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0D1B3D" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RideMe" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#2563EB" />
        <title>RideMe — Tu ride, tu destino</title>
        <meta
          name="description"
          content="Plataforma de traslados con tarifa negociable. Tú propones el precio, el conductor decide."
        />
        <meta property="og:title" content="RideMe — Tu ride, tu destino" />
        <meta property="og:description" content="Plataforma de traslados con tarifa negociable. Tú propones el precio." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/icons/icon-512x512.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body>
        <LocaleProvider>
          <QueryClientProvider client={queryClient}>
            <AppProviders>
              <AnimatePresence mode="wait">{children}</AnimatePresence>
            </AppProviders>
          </QueryClientProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
