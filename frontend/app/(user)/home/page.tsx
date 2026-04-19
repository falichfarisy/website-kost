"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { ChevronRight, Star, MapPin, Building2, Users, Heart, Shield, User, LogOut, Search, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";

function useHydration() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

const featuredKos = [
  { id: 1, name: "Kost Mahkota Regency", location: "Malang - Signature", price: 1200000, rating: 4.8, reviews: 124, type: "Putra", badge: "Terpopuler" },
  { id: 2, name: "Kost Alam Hijau", location: "Surabaya - Wonokromo", price: 950000, rating: 4.6, reviews: 89, type: "Putri", badge: "Promo" },
  { id: 3, name: "Kost Melati Square", location: "Jakarta - Tebet", price: 1800000, rating: 4.9, reviews: 256, type: "Campuran", badge: "Best Rated" },
  { id: 4, name: "Kost Platinum Residence", location: "Bandung - Dago", price: 1500000, rating: 4.7, reviews: 167, type: "Putra" },
];

const categories = [
  { id: "putra", name: "Putra", icon: <Users className="w-8 h-8" />, count: 450, color: "bg-blue-100 text-blue-600" },
  { id: "putri", name: "Putri", icon: <Heart className="w-8 h-8" />, count: 380, color: "bg-pink-100 text-pink-600" },
  { id: "campuran", name: "Campuran", icon: <Users className="w-8 h-8" />, count: 170, color: "bg-purple-100 text-purple-600" },
  { id: "premium", name: "Premium", icon: <Shield className="w-8 h-8" />, count: 85, color: "bg-amber-100 text-amber-600" },
  { id: "motor", name: "Parkir Motor", icon: <Building2 className="w-8 h-8" />, count: 620, color: "bg-green-100 text-green-600" },
  { id: "mobil", name: "Parkir Mobil", icon: <Building2 className="w-8 h-8" />, count: 290, color: "bg-indigo-100 text-indigo-600" },
];

function formatPrice(price: number): string {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}jt`;
  return `${(price / 1000).toFixed(0)}rb`;
}

export default function UserHomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [kosType, setKosType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuthStore();
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (kosType !== "all") params.set("type", kosType);
    if (priceRange !== "all") params.set("price", priceRange);
    router.push(`/search?${params.toString()}`);
  };

  const featuredScroll = (direction: "left" | "right") => {
    if (featuredScrollRef.current) {
      featuredScrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  const menuItems = [
    { icon: BookOpen, label: 'Booking', href: '/bookings', color: 'from-purple-500 to-purple-600' },
    { icon: Heart, label: 'Favorit', href: '/favorites', color: 'from-red-500 to-red-600' },
    { icon: Search, label: 'Cari Kost', href: '/search', color: 'from-blue-500 to-blue-600' },
    { icon: Calendar, label: 'Jadwal', href: '#', color: 'from-yellow-500 to-yellow-600', disabled: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#011E55]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/home" className="text-2xl font-bold text-white">KOSE</Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/search" className="text-white/80 hover:text-white font-medium">Cari Kost</Link>
              <Link href="/bookings" className="text-white/80 hover:text-white font-medium">Booking</Link>
              <Link href="/favorites" className="text-white/80 hover:text-white font-medium">Favorit</Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
                <User className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-br from-[#011E55] via-[#0a2d6e] to-[#1a4a8a] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Hai, {user?.name}! 👋
          </h1>
          <p className="text-white/80 mb-6">Temukan kost terbaik untukmu</p>

          <div className="bg-white rounded-2xl p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kost, lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#011E55]/30"
                />
              </div>
              <div className="md:col-span-3">
                <select
                  value={kosType}
                  onChange={(e) => setKosType(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#011E55]/30"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="putra">Putra</option>
                  <option value="putri">Putri</option>
                  <option value="campuran">Campuran</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#011E55]/30"
                >
                  <option value="all">Semua Harga</option>
                  <option value="500k">&lt; 500rb</option>
                  <option value="500k-1jt">500rb - 1jt</option>
                  <option value="1jt-2jt">1jt - 2jt</option>
                  <option value="2jt">&gt; 2jt</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <button
                  onClick={handleSearch}
                  className="w-full h-12 bg-[#011E55] text-white rounded-xl font-bold flex items-center justify-center hover:bg-[#0a2d6e] transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all text-center ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-bold text-gray-900 text-sm">{item.label}</p>
            </Link>
          ))}
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Rekomendasi Untukmu</h2>
              <p className="text-gray-600 text-sm">Kost pilihan yang mungkin kamu suka</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => featuredScroll("left")} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#011E55] hover:text-[#011E55] transition-colors bg-white">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button onClick={() => featuredScroll("right")} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#011E55] hover:text-[#011E55] transition-colors bg-white">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={featuredScrollRef} className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {featuredKos.map((kos) => (
              <Link key={kos.id} href={`/kos/${kos.id}`} className="flex-shrink-0 w-[260px] group">
                <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="h-36 bg-gradient-to-br from-[#011E55] to-[#0a2d6e] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white/20" />
                    </div>
                    {kos.badge && <span className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-[#011E55] text-xs font-bold rounded-full">{kos.badge}</span>}
                    <span className="absolute top-3 right-3 px-3 py-1 bg-white/95 text-[#011E55] text-xs font-bold rounded-full">{kos.type}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#011E55] transition-colors">{kos.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{kos.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-[#011E55]">{formatPrice(kos.price)}</span>
                        <span className="text-gray-500 text-sm">/bln</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-bold">{kos.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?type=${cat.id}`}
              className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-yellow-400 hover:shadow-md transition-all text-center"
            >
              <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                {cat.icon}
              </div>
              <p className="font-bold text-gray-900 text-sm">{cat.name}</p>
              <p className="text-xs text-[#011E55]">{cat.count} kost</p>
            </Link>
          ))}
        </div>
      </div>

      <footer className="bg-[#011E55] text-white py-8 px-4 mt-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/80 text-sm">&copy; {new Date().getFullYear()} KOSE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
