'use client';

import { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/nextjs';
import { useAuthStore } from '@/store/authStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { setAuthTokenGetter } from '@/lib/api';

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
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { syncWithClerk } = useAuthStore();

  useEffect(() => {
    setAuthTokenGetter(() => getToken());
  }, [getToken]);

  useEffect(() => {
    if (isLoaded) {
      syncWithClerk(isSignedIn, getToken);
    }
  }, [isLoaded, isSignedIn, getToken, syncWithClerk]);

  useEffect(() => {
    if (isSignedIn) {
      getToken().then((token) => {
        if (token) connectSocket(token);
      });
    } else {
      disconnectSocket();
    }
  }, [isSignedIn, getToken]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </AppProviders>
    </QueryClientProvider>
  );
}
