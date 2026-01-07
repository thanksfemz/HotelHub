'use client';

import * as React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type SidebarContextType = {
  open: boolean;
  isMobile: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    if (!isMobile) {
      const storedState = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
        ?.split('=')[1];
      setIsSidebarOpen(storedState === 'true');
    } else {
        setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    if (!isMobile) {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${newState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    }
  };

  const contextValue = React.useMemo(
    () => ({
      open: isSidebarOpen,
      isMobile,
      isSidebarOpen,
      toggleSidebar,
    }),
    [isSidebarOpen, isMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
        {children}
    </SidebarContext.Provider>
  );
};
