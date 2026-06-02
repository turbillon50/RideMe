import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthTokens } from '@/types';
import { api } from '@/lib/api';

interface AuthStore {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  syncWithClerk: (isSignedIn: boolean, getToken: () => Promise<string | null>) => Promise<void>;
}

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'passenger' | 'driver';
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,

      syncWithClerk: async (isSignedIn, getToken) => {
        if (!isSignedIn) {
          set({ user: null, tokens: null, isAuthenticated: false });
          return;
        }

        try {
          const user = await api.get<User>('/users/me');
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error('Failed to sync user with clerk:', error);
        }
      },

      login: async (email: string, password: string) => {
        // Redundant with Clerk, but kept for compatibility
      },

      register: async (payload: RegisterPayload) => {
        // Redundant with Clerk, but kept for compatibility
      },

      logout: () => {
        set({ user: null, tokens: null, isAuthenticated: false });
      },

      setUser: (user: User) => set({ user }),

      setTokens: (tokens: AuthTokens) => {
        set({ tokens });
      },

      updateProfile: async (data: Partial<User>) => {
        const updated = await api.patch<User>('/users/me', data);
        set({ user: updated });
      },

      refreshUser: async () => {
        try {
          const user = await api.get<User>('/users/me');
          set({ user });
        } catch {
          // Silently fail – auth interceptor handles 401
        }
      },
    }),
    {
      name: 'rideme-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
