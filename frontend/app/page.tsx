"use client";

import { useState, useRef, useSyncExternalStore } from "react";
import Headers from "@/app/components/Headers";
import Link from "next/link";

import { ChevronRight, Star, MapPin, Building2, Home, Users, Heart, Shield } from "lucide-react";

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
  { id: 5, name: "Kost Senja Timur", location: "Yogyakarta - Sleman", price: 800000, rating: 4.5, reviews: 78, type: "Putri", badge: "Baru" },
  { id: 6, name: "Kost Nusantara", location: "Semarang - Candisari", price: 1100000, rating: 4.6, reviews: 134, type: "Campuran" },
];

const allKos = [
  { id: 1, name: "Kost Mahkota Regency", location: "Malang - Signature", price: 1200000, rating: 4.8, reviews: 124, type: "Putra", badge: "Terpopuler", image: null },
  { id: 2, name: "Kost Alam Hijau", location: "Surabaya - Wonokromo", price: 950000, rating: 4.6, reviews: 89, type: "Putri", badge: "Promo", image: null },
  { id: 3, name: "Kost Melati Square", location: "Jakarta - Tebet", price: 1800000, rating: 4.9, reviews: 256, type: "Campuran", badge: "Best Rated", image: null },
  { id: 4, name: "Kost Platinum Residence", location: "Bandung - Dago", price: 1500000, rating: 4.7, reviews: 167, type: "Putra", image: null },
  { id: 5, name: "Kost Senja Timur", location: "Yogyakarta - Sleman", price: 800000, rating: 4.5, reviews: 78, type: "Putri", badge: "Baru", image: null },
  { id: 6, name: "Kost Nusantara", location: "Semarang - Candisari", price: 1100000, rating: 4.6, reviews: 134, type: "Campuran", image: null },
  { id: 7, name: "Kost Indigo Residence", location: "Surabaya - Gubeng", price: 1350000, rating: 4.7, reviews: 98, type: "Putra", image: null },
  { id: 8, name: "Kost Permata Hijau", location: "Jakarta - Kemang", price: 2200000, rating: 4.9, reviews: 187, type: "Campuran", badge: "Premium", image: null },
];

const categories = [
  { id: "putra", name: "Putra", icon: <Users className="w-8 h-8" />, count: 450, color: "bg-blue-100 text-blue-600" },
  { id: "putri", name: "Putri", icon: <Heart className="w-8 h-8" />, count: 380, color: "bg-pink-100 text-pink-600" },
  { id: "campuran", name: "Campuran", icon: <Users className="w-8 h-8" />, count: 170, color: "bg-purple-100 text-purple-600" },
  { id: "premium", name: "Premium", icon: <Shield className="w-8 h-8" />, count: 85, color: "bg-amber-100 text-amber-600" },
  { id: "motor", name: "Parkir Motor", icon: <Building2 className="w-8 h-8" />, count: 620, color: "bg-green-100 text-green-600" },
  { id: "mobil", name: "Parkir Mobil", icon: <Home className="w-8 h-8" />, count: 290, color: "bg-indigo-100 text-indigo-600" },
];

function formatPrice(price: number): string {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}jt`;
  return `${(price / 1000).toFixed(0)}rb`;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kosType, setKosType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const featuredScrollRef = useRef<HTMLDivElement>(null);

  const featuredScroll = (direction: "left" | "right") => {
    if (featuredScrollRef.current) {
      featuredScrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (kosType !== "all") params.set("type", kosType);
    if (priceRange !== "all") params.set("price", priceRange);
    window.location.href = `/search?${params.toString()}`;
  };

  const isHydrated = useHydration();

  if (!isHydrated) {
    return null;
}

  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-50">
      <header className="bg-[#011E55]">
        <Headers />
      </header>

      <div className="relative h-[560px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#011E55] via-[#0a2d6e] to-[#1a4a8a]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="relative max-w-6xl mx-auto px-6 py-20 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Lebih dari 1.000+ kost tersedia
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Temukan Kost <span className="text-yellow-400">Impianmu</span> dengan Mudah
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
              Platform pencarian kost terpercaya untuk mahasiswa dan masyarakat umum. Temukan hunian terbaik di lokasi strategis.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/search"
                className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-400 text-[#011E55] rounded-2xl font-bold hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl"
              >
                Cari Kost Sekarang
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register?role=owner"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/20"
              >
                Pasang Kost Gratis
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <div className="relative -mt-8 z-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-[#011E55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari kost, lokasi, atau area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-14 pr-4 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#011E55]/30 text-base font-medium bg-gray-50 border border-gray-200"
                />
              </div>
              <div className="md:col-span-3 relative">
                <select
                  value={kosType}
                  onChange={(e) => setKosType(e.target.value)}
                  className="w-full h-14 px-5 pr-12 appearance-none bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#011E55]/30 cursor-pointer font-medium"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="putra">Kost Putra</option>
                  <option value="putri">Kost Putri</option>
                  <option value="campuran">Kost Campuran</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-[#011E55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="md:col-span-3 relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-14 px-5 pr-12 appearance-none bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#011E55]/30 cursor-pointer font-medium"
                >
                  <option value="all">Semua Harga</option>
                  <option value="500k">&lt; 500rb</option>
                  <option value="500k-1jt">500rb - 1jt</option>
                  <option value="1jt-2jt">1jt - 2jt</option>
                  <option value="2jt">&gt; 2jt</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-[#011E55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="md:col-span-1">
                <button
                  onClick={handleSearch}
                  className="w-full h-14 bg-[#011E55] text-white rounded-2xl font-bold flex items-center justify-center hover:bg-[#0a2d6e] transition-all shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-yellow-400 text-[#011E55] rounded-full text-sm font-bold mb-4">
              KATEGORI
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Temukan Kost sesuai <span className="text-[#011E55]">Kebutuhan</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?type=${cat.id}`}
                className="group bg-white p-6 rounded-3xl border-2 border-gray-100 hover:border-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  {cat.icon}
                </div>
                <h3 className="font-extrabold text-gray-900 text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-[#011E55] font-bold">{cat.count} kos</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-block px-4 py-1.5 bg-[#011E55] text-white rounded-full text-xs font-bold mb-4">
                REKOMENDASI TERBAIK
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Kost <span className="text-[#011E55]">Unggulan</span> untuk Kamu
              </h2>
              <p className="text-gray-600 mt-3 max-w-md">Pilih kost terbaik dengan fasilitas lengkap dan lokasi strategis</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => featuredScroll("left")} className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#011E55] hover:text-[#011E55] transition-all bg-white shadow-md">
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
              <button onClick={() => featuredScroll("right")} className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#011E55] hover:text-[#011E55] transition-all bg-white shadow-md">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div ref={featuredScrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {featuredKos.map((kos) => (
              <Link key={kos.id} href={`/kos/${kos.id}`} className="flex-shrink-0 w-[280px] group">
                <div className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                  <div className="h-48 bg-gradient-to-br from-[#011E55] to-[#0a2d6e] relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="w-20 h-20 text-white/20" />
                    </div>
                    {kos.badge && <span className="absolute top-4 left-4 px-4 py-1.5 bg-yellow-400 text-[#011E55] text-xs font-bold rounded-full">{kos.badge}</span>}
                    <span className="absolute top-4 right-4 px-4 py-1.5 bg-white/95 backdrop-blur text-[#011E55] text-xs font-bold rounded-full">{kos.type}</span>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-extrabold text-gray-900 mb-2 group-hover:text-[#011E55] transition-colors">{kos.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                      <MapPin className="w-4 h-4 text-[#011E55]" />
                      <span>{kos.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-2xl font-extrabold text-[#011E55]">{formatPrice(kos.price)}</span>
                        <span className="text-gray-500 text-sm">/bln</span>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-bold text-gray-900">{kos.rating}</span>
                        <span className="text-gray-400 text-xs">({kos.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/search" className="inline-flex items-center gap-3 px-8 py-4 bg-[#011E55] text-white rounded-2xl font-bold hover:bg-[#0a2d6e] transition-all shadow-lg hover:shadow-xl">
              Lihat Semua Kost
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Kost di Seluruh Indonesia</h2>
              <p className="text-gray-600 mt-3">Temukan kos pilihan sesuai kebutuhanmu</p>
            </div>
            <Link href="/search" className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-[#011E55] text-white rounded-xl font-bold hover:bg-[#0a2d6e] transition-all shadow-lg">
              Filter Lanjut
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allKos.map((kos) => (
              <Link key={kos.id} href={`/kos/${kos.id}`} className="group">
                <div className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 group-hover:-translate-y-2">
                  <div className="h-44 bg-gradient-to-br from-[#011E55] to-[#0a2d6e] relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="w-14 h-14 text-white/20" />
                    </div>
                    {kos.badge && <span className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-[#011E55] text-xs font-bold rounded-full">{kos.badge}</span>}
                    <span className="absolute top-3 right-3 px-3 py-1 bg-white/95 text-[#011E55] text-xs font-bold rounded-full">{kos.type}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-extrabold text-gray-900 mb-2 group-hover:text-[#011E55] transition-colors">{kos.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                      <MapPin className="w-4 h-4 text-[#011E55]" />
                      <span>{kos.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-xl font-extrabold text-[#011E55]">{formatPrice(kos.price)}</span>
                        <span className="text-gray-500 text-sm">/bln</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-bold text-gray-900">{kos.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/search" className="inline-flex items-center gap-3 px-10 py-4 border-2 border-[#011E55] text-[#011E55] rounded-2xl font-bold hover:bg-[#011E55] hover:text-white transition-all">
              Lihat Semua Kost Terdekat
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-[#011E55] text-white rounded-full text-xs font-bold tracking-wider mb-4">
              KEUNGGULAN KAMI
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Mengapa Memilih <span className="text-[#011E55]">KOSE</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Pencarian Cerdas",
                desc: "Filter lengkap berdasarkan lokasi, harga, fasilitas, tipe, dan rating.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                color: "bg-blue-500 text-white",
              },
              {
                title: "Data Terverifikasi",
                desc: "Setiap kost telah diverifikasi tim kami. Informasi akurat dan terpercaya.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                color: "bg-green-500 text-white",
              },
              {
                title: "Chat Langsung",
                desc: "Hubungi pemilik kost dengan mudah melalui fitur chat terintegrasi.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                color: "bg-purple-500 text-white",
              },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-200 hover:border-[#011E55] hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-amber-500 text-white rounded-full text-xs font-bold tracking-wider mb-4">
              TESTIMONI
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Apa Kata <span className="text-[#011E55]">User</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Ahmad Fauzi", location: "Malang", kos: "Kost Mahkota Regency", rating: 5, text: "Sangat membantu! Aku nemu kost dekat kampus dalam hitungan menit." },
              { name: "Siti Rahayu", location: "Surabaya", kos: "Kost Alam Hijau", rating: 5, text: "Proses booking mudah, pemilik responsif. Kostnya sesuai foto, bersih dan nyaman." },
              { name: "Budi Santoso", location: "Jakarta", kos: "Kost Melati Square", rating: 5, text: "Platform yang bagus. Filtering lengkap jadi mudah cari kost sesuai budget." },
            ].map((testi, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl border-2 border-gray-200 hover:border-[#011E55] transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < testi.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 text-base mb-6 leading-relaxed">{testi.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#011E55] to-[#0a2d6e] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testi.name}</p>
                    <p className="text-gray-700 text-sm">di {testi.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-[#011E55] via-[#0a2d6e] to-[#1a4a8a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Punya Kost? Daftar di KOSE!
          </h2>
          <p className="text-white/90 mb-10 text-lg max-w-2xl mx-auto">
            Tambah visibility kost kamu ke ribuan calon penghuni. Gratis daftar, biaya komisi transparan.
          </p>
          <Link 
            href="/register?role=owner" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#011E55] rounded-2xl font-extrabold hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl text-lg"
          >
            Daftar Kost Gratis
            <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <footer className="bg-[#011E55] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <h3 className="text-4xl font-extrabold mb-6">KOSE</h3>
              <p className="text-white/80 text-base max-w-md mb-8">
                Platform pencarian kost terpercaya untuk mahasiswa dan masyarakat umum. Temukan hunian terbaik dengan mudah dan cepat.
              </p>
              <div className="flex gap-4">
                {['X', 'Ig', 'Fb'].map((social) => (
                  <a key={social} href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors font-bold">
                    {social}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-5">Tautan</h4>
              <ul className="space-y-3 text-white/90">
                <li><Link href="/search" className="hover:text-white transition-colors">Cari Kost</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Masuk</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Daftar</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-5">Kontak</h4>
              <ul className="space-y-3 text-white/90">
                <li>hello@kose.id</li>
                <li>+62 812 3456 7890</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-sm font-medium">&copy; {new Date().getFullYear()} KOSE. All rights reserved.</p>
            <div className="flex gap-8 text-sm text-white/80 font-medium">
              <Link href="#" className="hover:text-white transition-colors">Privasi</Link>
              <Link href="#" className="hover:text-white transition-colors">Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}