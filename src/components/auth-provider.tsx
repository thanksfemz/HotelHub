'use client';

import { useAuthInit } from '@/lib/stores/authStore';
import React from 'react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthInit();
  return <>{children}</>;
}
