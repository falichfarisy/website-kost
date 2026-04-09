"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Headers() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Tentang Kami", href: "/about" },
    { label: "Pusat Bantuan", href: "/help" },
    { label: "Hubungi Kami", href: "/contact" },
    { label: "Artikel", href: "/articles" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchQuery)}`);
    }
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
              className="font-medium text-sm hover:text-gray-200 transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/register"
            className="px-6 py-2.5 bg-white text-[#011E55] rounded-full font-semibold text-sm hover:bg-gray-100 transition-all hover:scale-105"
          >
            Daftar
          </Link>
          <Link
            href="/login"
            className="px-6 py-2.5 border-2 border-white rounded-full font-semibold text-sm hover:bg-white hover:text-[#011E55] transition-all"
          >
            Masuk
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="p-2"
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
        <div className="md:hidden bg-[#0a2d6e] px-6 py-4 space-y-4">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} className="block font-medium text-sm">
              {item.label}
            </Link>
          ))}
          <div className="flex gap-4 pt-4">
            <Link href="/register" className="flex-1 text-center py-2.5 bg-white text-[#011E55] rounded-full font-semibold text-sm">
              Daftar
            </Link>
            <Link href="/login" className="flex-1 text-center py-2.5 border-2 border-white rounded-full font-semibold text-sm">
              Masuk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}