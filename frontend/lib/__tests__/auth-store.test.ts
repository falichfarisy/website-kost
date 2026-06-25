import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
    localStorage.clear();
  });

  it('should have default unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.accessToken).toBe(null);
  });

  it('should set auth data correctly', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
    };

    const store = useAuthStore.getState();
    store.setAuth(mockUser, 'access-token-123', 'refresh-token-456');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('test@example.com');
    expect(state.user?.name).toBe('Test User');
    expect(state.accessToken).toBe('access-token-123');
    expect(state.refreshToken).toBe('refresh-token-456');
    expect(localStorage.getItem('access_token')).toBe('access-token-123');
    expect(localStorage.getItem('refresh_token')).toBe('refresh-token-456');
  });

  it('should logout and clear auth data', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const,
    };

    const store = useAuthStore.getState();
    store.setAuth(mockUser, 'access-token', 'refresh-token');
    store.logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.accessToken).toBe(null);
  });

  it('should set admin user correctly', () => {
    const adminUser = {
      id: 1,
      email: 'admin@kose.id',
      name: 'Admin',
      role: 'admin' as const,
    };

    const store = useAuthStore.getState();
    store.setAuth(adminUser, 'admin-token', 'admin-refresh');

    const state = useAuthStore.getState();
    expect(state.user?.role).toBe('admin');
    expect(state.isAuthenticated).toBe(true);
  });
});
