'use client';

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { 
  Home, Search, User, Calendar, Heart, Star, Settings, LogOut,
  Menu, X, Bell, MessageCircle
} from 'lucide-react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, setRole } = useAuthStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { icon: Home, label: 'Beranda', href: '/dashboard' },
    { icon: Search, label: 'Cari Kost', href: '/search' },
    { icon: Calendar, label: 'Booking Saya', href: '/bookings' },
    { icon: Heart, label: 'Favorit', href: '/favorites' },
    { icon: User, label: 'Profil', href: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#011E55] to-[#0a2d6e] rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#011E55]">KOSE</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-2">
              {menuItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>
                
                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500">Switch Role (Dev)</p>
                    </div>
                    <button onClick={() => { setRole('user'); setShowRoleMenu(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                      User
                    </button>
                    <button onClick={() => { setRole('admin'); setShowRoleMenu(false); router.push('/admin'); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                      Admin
                    </button>
                    <button onClick={() => { setRole('owner'); setShowRoleMenu(false); router.push('/owner'); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                      Owner
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                      <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2 mt-4">
                {menuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-[#011E55] hover:text-white transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors col-span-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
