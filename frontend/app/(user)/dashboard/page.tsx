'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
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

  const menuItems = [
    { icon: "📋", label: "Booking Saya", href: "/bookings", color: "bg-purple-50 hover:bg-purple-100" },
    { icon: "❤️", label: "Favorit Saya", href: "/favorites", color: "bg-red-50 hover:bg-red-100" },
    { icon: "🔍", label: "Cari Kost", href: "/search", color: "bg-blue-50 hover:bg-blue-100" },
    { icon: "⭐", label: "Ulasan Saya", href: "#", color: "bg-yellow-50 hover:bg-yellow-100", coming: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#011E55] to-[#0a2d6e] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Halo, {user?.name}! 👋</h1>
              <p className="text-white/80">Selamat datang di dashboard KOSE</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Akun</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-green-600">Aktif</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Menu Utama</h2>
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className={`${item.color} p-4 rounded-xl flex items-center gap-3 transition-all hover:shadow-md ${item.coming ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.label}</p>
                      {item.coming && <p className="text-xs text-gray-500">Coming soon</p>}
                    </div>
                    {!item.coming && (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#011E55] to-[#0a2d6e] rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">Butuh Bantuan?</h3>
                  <p className="text-white/80 text-sm">Tim support kami siap membantu kamu</p>
                </div>
                <Link
                  href="/contact"
                  className="bg-white text-[#011E55] px-5 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
