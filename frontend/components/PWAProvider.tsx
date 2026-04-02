'use client';

import { useEffect } from 'react';

export function PWAProvider() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('SW registered:', registration.scope);
          },
          (error) => {
            console.log('SW registration failed:', error);
          }
        );
      });
    }

    if ('standalone' in window.navigator && (window.navigator as any).standalone) {
      document.body.classList.add('standalone');
    }
  }, []);

  return null;
}
