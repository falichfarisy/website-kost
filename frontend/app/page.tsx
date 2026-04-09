"use client";

import { useState, useRef, useEffect } from "react";
import Headers from "@/app/components/Headers";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, MapPin, Building2 } from "lucide-react";

interface KosFeatured {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  type: string;
  badge?: string;
}

const featuredKos: KosFeatured[] = [
  { id: 1, name: "Kost Mahkota Regency", location: "Malang - Signature", price: 1200000, rating: 4.8, reviews: 124, type: "Putra", badge: "Terpopuler" },
  { id: 2, name: "Kost Alam Hijau", location: "Surabaya - Wonokromo", price: 950000, rating: 4.6, reviews: 89, type: "Putri", badge: "Promo" },
  { id: 3, name: "Kost Melati Square", location: "Jakarta - Tebet", price: 1800000, rating: 4.9, reviews: 256, type: "Campuran", badge: "Best Rated" },
  { id: 4, name: "Kost Platinum Residence", location: "Bandung - Dago", price: 1500000, rating: 4.7, reviews: 167, type: "Putra" },
  { id: 5, name: "Kost Senja Timur", location: "Yogyakarta - Sleman", price: 800000, rating: 4.5, reviews: 78, type: "Putri", badge: "Baru" },
  { id: 6, name: "Kost Nusantara", location: "Semarang - Candisari", price: 1100000, rating: 4.6, reviews: 134, type: "Campuran" },
];

const howItWorks = [
  { step: 1, title: "Cari", description: "Pilih lokasi, tipe, dan budget sesuai kebutuhanmu" },
  { step: 2, title: "Bandingkan", description: "Lihat fasilitas, harga, dan rating dari setiap kost" },
  { step: 3, title: "Hubungi", description: "Chat langsung dengan pemilik untuk booking" },
];

function formatPrice(price: number): string {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}jt`;
  return `${(price / 1000).toFixed(0)}rb`;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kosType, setKosType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
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

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div 
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(1, 30, 85, 0.95) 0%, rgba(1, 30, 85, 0.8) 100%), url("/background.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="px-6 py-4">
          <Headers />
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Lebih dari 1000+ kos tersedia
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Temukan Kost <span className="text-yellow-400">Terbaik</span> untuk Kebutuhanmu
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Kami membantu kamu menemukan berbagai pilihan kost dengan mudah dan cepat. 
              Pilih berdasarkan lokasi, harga, dan fasilitas yang sesuai dengan kebutuhanmu.
            </p>

            <div className="max-w-3xl mx-auto mt-10">
              <div className="bg-white rounded-2xl shadow-2xl p-3">
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex-1 relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Cari kos di area..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 lg:h-14 pl-12 pr-4 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55]/20 text-base"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={kosType}
                      onChange={(e) => setKosType(e.target.value)}
                      className="h-12 lg:h-14 px-4 pr-10 appearance-none bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#011E55]/20 cursor-pointer min-w-[140px]"
                    >
                      <option value="all">Semua Tipe</option>
                      <option value="putra">Kost Putra</option>
                      <option value="putri">Kost Putri</option>
                      <option value="campuran">Kost Campuran</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div className="relative">
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="h-12 lg:h-14 px-4 pr-10 appearance-none bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#011E55]/20 cursor-pointer min-w-[160px]"
                    >
                      <option value="all">Semua Harga</option>
                      <option value="500k">&lt; 500rb</option>
                      <option value="500k-1jt">500rb - 1jt</option>
                      <option value="1jt-2jt">1jt - 2jt</option>
                      <option value="2jt">&gt; 2jt</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="h-12 lg:h-14 px-8 bg-[#011E55] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#0a2d6e] transition-all hover:shadow-lg whitespace-nowrap"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="hidden sm:inline">Cari</span>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm text-white/60">
                <span>Popular:</span>
                <Link href="/search?type=putra" className="hover:text-white transition-colors">Kost Putra</Link>
                <Link href="/search?type=putri" className="hover:text-white transition-colors">Kost Putri</Link>
                <Link href="/search?search=malang" className="hover:text-white transition-colors">Malang</Link>
                <Link href="/search?search=surabaya" className="hover:text-white transition-colors">Surabaya</Link>
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
            {[
              { number: "1000+", label: "Kost Tersedia" },
              { number: "500+", label: "Pemilik Kos" },
              { number: "50+", label: "Kota" },
              { number: "98%", label: "Kepuasan User" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.number}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
                REKOMENDASI KAMI
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Kost <span className="text-[#011E55]">Unggulan</span>
              </h2>
              <p className="text-gray-600 mt-2">Pilihan kost terbaik yang paling banyak dikunjungi</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scroll("left")} className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#011E55] hover:text-[#011E55] transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scroll("right")} className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#011E55] hover:text-[#011E55] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {featuredKos.map((kos) => (
              <Link key={kos.id} href={`/kos/${kos.id}`} className="flex-shrink-0 w-[300px] group">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="h-48 bg-gradient-to-br from-[#011E55]/10 to-[#011E55]/5 relative overflow-hidden flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-[#011E55]/20" />
                    {kos.badge && <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">{kos.badge}</span>}
                    <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-[#011E55] text-xs font-medium rounded-full">{kos.type}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#011E55] transition-colors line-clamp-1">{kos.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{kos.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-[#011E55]">{formatPrice(kos.price)}</span>
                        <span className="text-gray-500 text-sm">/bln</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">{kos.rating}</span>
                        <span className="text-gray-400 text-sm">({kos.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-[#011E55] text-white rounded-xl font-medium hover:bg-[#0a2d6e] transition-colors">
              Lihat Semua Kost
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-[#011E55]/10 text-[#011E55] rounded-full text-sm font-medium mb-4">
              CARA KERJA
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Cari Kost dalam <span className="text-[#011E55]">3 Langkah</span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Proses pencarian kost yang mudah dan praktis</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#011E55] text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={index === 0 ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" : index === 1 ? "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" : "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"} />
                  </svg>
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-amber-500 text-white rounded-full text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-[#011E55]/10 text-[#011E55] rounded-full text-sm font-medium mb-4">
              KEUNGGULAN KAMI
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Mengapa Memilih <span className="text-[#011E55]">KOSE</span>?
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Kami memberikan pengalaman pencarian kost yang terbaik dengan fitur-fitur yang dirancang khusus untuk kebutuhanmu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Pencarian Cerdas",
                description: "Filter berdasarkan lokasi, harga, fasilitas, tipe, dan rating. Temukan kost ideal sesuai kriteria dalam hitungan detik.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Lokasi Strategis",
                description: "Peta interaktif menunjukkan lokasi kost dari berbagai pilihan. Pilih kos dengan akses mudah ke kampus atau tempat kerja.",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                title: "Ulasan Terpercaya",
                description: "Baca pengalaman nyata dari penghuni sebelumnya. Rating dan review membantu kamu membuat keputusan yang tepat.",
                color: "bg-yellow-100 text-yellow-600",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Data Terverifikasi",
                description: "Setiap kost telah diverifikasi oleh tim kami. Informasi harga, fasilitas, dan ketersediaan selalu akurat.",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Favorit & Bandingkan",
                description: "Simpan kos favorit untuk perbandingan. Buat keputusan terbaik tanpa perlu mengingat semua pilihan.",
                color: "bg-pink-100 text-pink-600",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.172l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: "Layanan 24/7",
                description: "Tim support siap membantu kapan saja. Ajukan pertanyaan dan dapat respons cepat untuk bantuan.",
                color: "bg-indigo-100 text-indigo-600",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-4">KOSE</h3>
              <p className="text-white/80 max-w-md mb-6">
                Platform pencarian kost terpercaya untuk mahasiswa dan masyarakat umum. 
                Temukan hunian terbaik dengan mudah dan cepat.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.284l-.467 3.622h-2.817v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Tautan Cepat</h4>
              <ul className="space-y-3">
                <li><Link href="/search" className="text-white/70 hover:text-white transition-colors">Cari Kost</Link></li>
                <li><Link href="/login" className="text-white/70 hover:text-white transition-colors">Masuk</Link></li>
                <li><Link href="/register" className="text-white/70 hover:text-white transition-colors">Daftar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hubungi Kami</h4>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  hello@kose.id
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +62 812 3456 7890
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Jakarta, Indonesia
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              &copy; {new Date().getFullYear()} KOSE. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-white/60">
              <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
              <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
