'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role === 'admin') {
      router.push('/admin');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#011E55] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2">Halo, {user?.name}!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Profil</h2>
            <div className="space-y-2">
              <p><span className="text-gray-600">Nama:</span> {user?.name}</p>
              <p><span className="text-gray-600">Email:</span> {user?.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            <div className="space-y-2">
              <a href="/favorites" className="block py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                ❤️ Favorit Saya
              </a>
              <a href="/" className="block py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                🏠 Cari Kos
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Akun</h2>
            <button
              onClick={logout}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
