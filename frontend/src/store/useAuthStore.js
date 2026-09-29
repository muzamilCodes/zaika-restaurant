import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      loading: false,
      hasHydrated: false,
      setAuth: ({ user, accessToken }) => set({ user, accessToken, loading: false }),
      setAccessToken: (accessToken) => set({ accessToken, loading: false }),
      clearAuth: () => set({ user: null, accessToken: null, loading: false }),
      markHydrated: () => set({ hasHydrated: true }),
      hydrate: async () => {
        const { accessToken } = get();
        if (!accessToken) return;
        try {
          set({ loading: true });
          const response = await authService.me();
          set({ user: response.data.user, loading: false });
        } catch {
          set({ user: null, accessToken: null, loading: false });
        }
      }
    }),
    {
      name: 'zaika-auth',
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          state?.markHydrated?.();
          return;
        }

        if (state?.accessToken) {
          Promise.resolve(state.hydrate?.()).finally(() => {
            state?.markHydrated?.();
          });
          return;
        }

        state?.markHydrated?.();
      }
    }
  )
);
