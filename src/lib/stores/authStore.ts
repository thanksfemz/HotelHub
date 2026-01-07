'use client';

import { create } from 'zustand';
import { useEffect, useMemo } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Receptionist';
  phone?: string;
  avatar?: string;
  createdAt: string;
};


type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
};

const getInitialState = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                return { token, user };
            } catch (e) {
                return { token: null, user: null };
            }
        }
    }
    return { token: null, user: null };
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
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
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      try {
        useAuthStore.getState().setAuth(JSON.parse(user), token);
      } catch (error) {
        useAuthStore.getState().clearAuth();
      }
    }
    useAuthStore.getState().setHasHydrated(true);
  }, []);
};

export const useIsAuthenticated = () => {
  const { token, _hasHydrated } = useAuthStore();
  
  return useMemo(() => {
    if (!_hasHydrated) {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('token');
        }
        return false;
    };
    return !!token;
  }, [token, _hasHydrated]);
};