import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';
import { useThemeStore } from '../../lib/theme-store';

describe('ThemeToggle Component', () => {
  it('renders theme toggle button', () => {
    useThemeStore.setState({ theme: 'light' });
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it('shows moon icon when in light mode', () => {
    useThemeStore.setState({ theme: 'light' });
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it('shows sun icon when in dark mode', () => {
    useThemeStore.setState({ theme: 'dark' });
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    useThemeStore.setState({ theme: 'light' });
    const { rerender } = render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    
    expect(useThemeStore.getState().theme).toBe('dark');
  });
});
