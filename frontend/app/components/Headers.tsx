"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { User, LogOut } from "lucide-react";

export default function Headers() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const navItems = [
    { label: "Tentang Kami", href: "/about" },
    { label: "Pusat Bantuan", href: "/help" },
    { label: "Hubungi Kami", href: "/contact" },
    { label: "Artikel", href: "/articles" },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="w-full text-white relative z-50">
      <nav className="w-full px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold tracking-tight hover:opacity-90 transition-opacity">
          KOSE
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="font-bold text-sm text-white hover:text-yellow-400 transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
                <User className="w-5 h-5 text-white" />
                <span className="font-bold text-sm text-white">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-white rounded-full font-bold text-sm text-white hover:bg-white hover:text-[#011E55] transition-all"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-white text-[#011E55] rounded-full font-bold text-sm hover:bg-yellow-400 hover:text-[#011E55] transition-all hover:scale-105"
              >
                Daftar
              </Link>
              <Link
                href="/login"
                className="px-6 py-2.5 border-2 border-white rounded-full font-bold text-sm text-white hover:bg-white hover:text-[#011E55] transition-all"
              >
                Masuk
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            className="p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a2d6e] px-6 py-5 space-y-4 border-t border-white/20">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} className="block font-bold text-sm text-white">
              {item.label}
            </Link>
          ))}
          <div className="flex gap-4 pt-4 border-t border-white/20">
            {isAuthenticated ? (
              <>
                <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/20 rounded-full font-bold text-sm text-white">
                  <User className="w-4 h-4" />
                  {user?.name}
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-white rounded-full font-bold text-sm text-white hover:bg-white hover:text-[#011E55] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="flex-1 text-center py-3 bg-white text-[#011E55] rounded-full font-bold text-sm">
                  Daftar
                </Link>
                <Link href="/login" className="flex-1 text-center py-3 border-2 border-white rounded-full font-bold text-sm text-white hover:bg-white hover:text-[#011E55] transition-all">
                  Masuk
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}