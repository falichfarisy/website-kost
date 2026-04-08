'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';
import { useRouter } from 'next/navigation';
import { LogOut, User, Menu, X, Building2, Calendar } from 'lucide-react';
import { useState } from 'react';
import NotificationBell from './NotificationBell';

export function Header() {
  const { user, isAuthenticated, logout, setRole } = useAuthStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const isOwner = user?.role === 'admin' || user?.role === 'owner';

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#011E55] to-[#0a2d6e] rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#011E55] to-[#0a2d6e] bg-clip-text text-transparent">
              KOSE
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/search" className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-[#011E55] dark:hover:text-white transition-colors font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              Cari Kost
            </Link>
            <Link href="/about" className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-[#011E55] dark:hover:text-white transition-colors font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              Tentang Kami
            </Link>
            <Link href="/articles" className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-[#011E55] dark:hover:text-white transition-colors font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              Artikel
            </Link>
            <Link href="/help" className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-[#011E55] dark:hover:text-white transition-colors font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              Bantuan
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {isOwner && (
                  <Link 
                    href="/owner"
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#011E55]/10 dark:bg-blue-900/30 text-[#011E55] dark:text-blue-400 hover:bg-[#011E55]/20 transition-all"
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Owner</span>
                  </Link>
                )}
                <Link 
                  href="/bookings"
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  title="Booking Saya"
                >
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <NotificationBell />
                <Link 
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  href="/login"
                  className="px-4 py-2 text-[#011E55] dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                >
                  Masuk
                </Link>
                <Link 
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-[#011E55] to-[#0a2d6e] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#011E55]/25 transition-all"
                >
                  Daftar
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-slide-up">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/search" 
                className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cari Kost
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tentang Kami
              </Link>
              <Link 
                href="/articles" 
                className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Artikel
              </Link>
              <Link 
                href="/help" 
                className="px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bantuan
              </Link>
              
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Link 
                    href="/login"
                    className="px-4 py-3 text-center rounded-xl border-2 border-[#011E55] text-[#011E55] dark:border-white dark:text-white font-medium transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link 
                    href="/register"
                    className="px-4 py-3 text-center bg-gradient-to-r from-[#011E55] to-[#0a2d6e] text-white font-medium rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
