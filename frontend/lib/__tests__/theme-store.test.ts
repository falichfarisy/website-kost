import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '../theme-store';

describe('Theme Store', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' });
  });

  it('should have default theme as light', () => {
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('light');
  });

  it('should toggle theme from light to dark', () => {
    const store = useThemeStore.getState();
    store.toggleTheme();
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    useThemeStore.setState({ theme: 'dark' });
    const store = useThemeStore.getState();
    store.toggleTheme();
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('should setTheme to specific value', () => {
    const store = useThemeStore.getState();
    store.setTheme('dark');
    expect(useThemeStore.getState().theme).toBe('dark');
  });
});
