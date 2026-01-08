
'use client';

import { create } from 'zustand';
import { useEffect, useMemo } from 'react';
import type { User } from '@/lib/types/auth';

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  _hasHydrated: false,
  setHasHydrated: (hydrated) => {
    set({ _hasHydrated: hydrated });
  },
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    }
    set({ user, token });
  },
  clearAuth: () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
    set({ user: null, token: null });
  },
}));

export const useAuthInit = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (userStr && token) {
        try {
          useAuthStore.getState().setAuth(JSON.parse(userStr), token);
        } catch (error) {
          useAuthStore.getState().clearAuth();
        }
      }
      useAuthStore.getState().setHasHydrated(true);
    }
  }, []);
};

export const useIsAuthenticated = () => {
  const { token, _hasHydrated } = useAuthStore((state) => ({ token: state.token, _hasHydrated: state._hasHydrated }));
  
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    if (!_hasHydrated) {
      return !!localStorage.getItem('token');
    }
    return !!token;
  }, [token, _hasHydrated]);
};

export default useAuthStore;

    