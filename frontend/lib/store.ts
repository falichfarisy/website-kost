'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'owner';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setRole: (role: 'user' | 'admin' | 'owner') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) => {
        const hasValidToken = Boolean(accessToken && accessToken.length > 0);
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        set({ user, isAuthenticated: hasValidToken });
      },
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Clear httpOnly cookies via API call
        fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
        set({ user: null, isAuthenticated: false });
      },
      setRole: (role: 'user' | 'admin' | 'owner') => {
        const roleNames = { user: 'Test User', admin: 'Admin User', owner: 'Owner User' };
        const roleEmails = { user: 'test@kose.com', admin: 'admin@kose.com', owner: 'owner@kose.com' };
        const newUser = { id: 1, email: roleEmails[role], name: roleNames[role], role };
        set({ user: newUser, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
