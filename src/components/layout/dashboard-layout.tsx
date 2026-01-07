'use client';

import React from 'react';
import { SidebarProvider } from './sidebar-provider';
import { SidebarNav, HeaderNav } from './sidebar-nav';
import { useIsAuthenticated } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]">
        <SidebarNav />
        <div className="flex flex-col">
          <HeaderNav />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
