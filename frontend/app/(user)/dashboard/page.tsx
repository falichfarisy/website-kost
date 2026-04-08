'use client';

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Search, BookOpen, Heart, Star, User, MapPin, Clock,
  ArrowRight, Star as StarIcon
} from 'lucide-react';

export default function DashboardPage() {
  const { user, setRole } = useAuthStore();
  const router = useRouter();

  const menuItems = [
    { 
      icon: BookOpen, 
      label: 'Booking Saya', 
      href: '/bookings', 
      color: 'from-purple-500 to-purple-600',
      desc: 'Lihat riwayat booking'
    },
    { 
      icon: Heart, 
      label: 'Favorit Saya', 
      href: '/favorites', 
      color: 'from-red-500 to-red-600',
      desc: 'Kost yang disimpan'
    },
    { 
      icon: Search, 
      label: 'Cari Kost', 
      href: '/search', 
      color: 'from-blue-500 to-blue-600',
      desc: 'Temukan kost idaman'
    },
    { 
      icon: StarIcon, 
      label: 'Ulasan Saya', 
      href: '#', 
      color: 'from-yellow-500 to-yellow-600',
      desc: 'Beri rating kost',
      disabled: true
    },
  ];

  const recentKos = [
    { name: 'Kost Melati Premium', location: 'Kotabaru', price: 1500000, type: 'putra' },
    { name: 'Kost Orchid Indah', location: 'Banguntapan', price: 1200000, type: 'putri' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#011E55] to-[#0a2d6e] rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Halo, {user?.name}!</h1>
            <p className="text-white/80">Selamat datang di dashboard KOSE</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {menuItems.map((item, i) => (
          <Link
            key={i}
            href={item.disabled ? '#' : item.href}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all ${
              item.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{item.label}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Kost Terbaru</h2>
            <Link href="/search" className="text-[#011E55] text-sm font-medium flex items-center gap-1">
              Lihat semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentKos.map((kos, i) => (
              <Link
                key={i}
                href="/search"
                className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-[#011E55]/10 flex items-center justify-center">
                  <Home className="w-8 h-8 text-[#011E55]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{kos.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {kos.location}
                  </p>
                  <p className="text-sm font-medium text-[#011E55]">
                    Rp {kos.price.toLocaleString('id-ID')}/bulan
                  </p>
                </div>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-xs rounded-full capitalize">
                  {kos.type}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Informasi Akun</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Nama</p>
                <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium text-green-600">Aktif</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
