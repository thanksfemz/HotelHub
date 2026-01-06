'use client';

import { create } from 'zustand';
import { useEffect, useMemo } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  _hasHydrated: false,
  setHasHydrated: (hydrated) => {
    set({ _hasHydrated: hydrated });
  },
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export const useAuthInit = () => {
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      useAuthStore.getState().setAuth(JSON.parse(user), token);
    }
    useAuthStore.getState().setHasHydrated(true);
  }, []);
};

export const useIsAuthenticated = () => {
  const { token, _hasHydrated } = useAuthStore();
  
  return useMemo(() => {
    if (!_hasHydrated) return false;
    return !!token;
  }, [token, _hasHydrated]);
};
