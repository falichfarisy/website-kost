"use client";

import { useState } from 'react';
import Headers from "@/app/components/Headers";
import Link from "next/link";
import { BookOpen, Search, ArrowRight, Clock, Calendar } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Tips Memilih Kost Dekat Kampus untuk Mahasiswa",
    excerpt: "Panduan lengkap memilih kost strategis dengan budget terjangkau...",
    category: "Tips",
    date: "28 Maret 2026",
    image: "🏫",
    readTime: "5 min",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    title: "Fasilitas Wajib Kost Mahasiswa: Mana yang Penting?",
    excerpt: "WiFi, AC, atau kamar mandi dalam? Ini fasilitas yang wajib dipertimbangkan...",
    category: "Panduan",
    date: "25 Maret 2026",
    image: "🏠",
    readTime: "4 min",
    color: "from-green-500 to-green-600",
  },
  {
    id: 3,
    title: "Cara Negosiasi Harga Kost dengan Pemilik",
    excerpt: "Tidak perlu malu! Ini strategi jitu mendapat harga terbaik...",
    category: "Tips",
    date: "22 Maret 2026",
    image: "💰",
    readTime: "3 min",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 4,
    title: "Kelebihan dan Kekurangan Kost Putra vs Putri",
    excerpt: "Mana yang lebih cocok untukmu? Ini perbandingannya...",
    category: "Artikel",
    date: "20 Maret 2026",
    image: "👥",
    readTime: "6 min",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 5,
    title: "Checklist Sebelum Menandatangani Kontrak Kost",
    excerpt: "Jangan sampai tertipu! Perhatikan hal-hal ini sebelum deal...",
    category: "Panduan",
    date: "18 Maret 2026",
    image: "📋",
    readTime: "7 min",
    color: "from-pink-500 to-pink-600",
  },
  {
    id: 6,
    title: "5 Kesalahan Umum saat Mencari Kost Pertama Kali",
    excerpt: "Hindari kesalahan-kesalahan ini agar tidak menyesal nanti...",
    category: "Tips",
    date: "15 Maret 2026",
    image: "⚠️",
    readTime: "4 min",
    color: "from-red-500 to-red-600",
  },
];

const categories = ["Semua", "Tips", "Panduan", "Artikel", "News"];

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === "Semua" || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div 
        className="min-h-[50vh] flex flex-col"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(1, 30, 85, 0.95) 0%, rgba(1, 30, 85, 0.8) 100%), url("/background.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="px-6 py-4">
          <Headers />
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/20">
              <BookOpen className="w-4 h-4" />
              Baca & Pelajari
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Artikel & <span className="text-yellow-400">Tips</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Informasi terbaru tentang dunia kost dan hunian untuk mahasiswa
            </p>

            <div className="max-w-xl mx-auto mt-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-[#011E55] text-white shadow-lg" 
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada artikel yang ditemukan.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <article key={article.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100">
                  <div className={`h-40 bg-gradient-to-br ${article.color} flex items-center justify-center relative`}>
                    <span className="text-6xl opacity-80">{article.image}</span>
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime} baca
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#011E55] transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <Link 
                      href={`/articles/${article.id}`}
                      className="inline-flex items-center gap-1 text-[#011E55] font-medium hover:gap-2 transition-all"
                    >
                      Baca selengkapnya 
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <button className="px-8 py-3 border-2 border-[#011E55] text-[#011E55] rounded-xl font-semibold hover:bg-[#011E55] hover:text-white transition-colors">
              Muat Lebih Banyak
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-[#011E55] text-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-4">KOSE</h3>
              <p className="text-white/80 max-w-md">
                Platform pencarian kost terpercaya untuk mahasiswa dan masyarakat umum.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5">Tautan</h4>
              <ul className="space-y-3">
                <li><Link href="/search" className="text-white/90 hover:text-white transition-colors">Cari Kost</Link></li>
                <li><Link href="/about" className="text-white/90 hover:text-white transition-colors">Tentang Kami</Link></li>
                <li><Link href="/articles" className="text-white/90 hover:text-white transition-colors">Artikel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5">Bantuan</h4>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-white/90 hover:text-white transition-colors">Pusat Bantuan</Link></li>
                <li><Link href="/contact" className="text-white/90 hover:text-white transition-colors">Hubungi Kami</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-sm font-medium">
              &copy; {new Date().getFullYear()} KOSE. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-white/80">
              <Link href="#" className="hover:text-white font-medium transition-colors">Kebijakan Privasi</Link>
              <Link href="#" className="hover:text-white font-medium transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
