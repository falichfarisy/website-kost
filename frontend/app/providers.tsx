'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useThemeStore } from '@/lib/theme-store';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

function AuthValidator({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    api.get('/auth/me')
      .catch(() => {
        if (!cancelled) logout();
      });

    return () => { cancelled = true; };
  }, [isAuthenticated, logout]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthValidator>
        {children}
      </AuthValidator>
    </QueryClientProvider>
  );
}
