'use client';

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Building, Calendar, DollarSign, BarChart3, MessageSquare, LogOut
} from 'lucide-react';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/owner' },
    { icon: Building, label: 'Kost Saya', href: '/owner/kos' },
    { icon: Calendar, label: 'Booking', href: '/owner/bookings' },
    { icon: DollarSign, label: 'Pendapatan', href: '/owner/revenue' },
    { icon: MessageSquare, label: 'Pesan', href: '/owner/messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">KOSE Owner</h1>
                <p className="text-xs text-white/70">Panel Pemilik Kost</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-white/70 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-sm p-4 space-y-1">
              {menuItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-600 hover:text-white transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
