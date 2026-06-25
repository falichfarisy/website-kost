'use client';

import { useEffect } from 'react';

export function PWAProvider() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('SW registered:', registration.scope);
            }
          },
          (error) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('SW registration failed:', error);
            }
          }
        );
      });
    }

    const nav = window.navigator as Navigator & { standalone?: boolean };
    if ('standalone' in nav && nav.standalone) {
      document.body.classList.add('standalone');
    }
  }, []);

  return null;
}
