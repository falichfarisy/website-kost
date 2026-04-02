import Headers from "@/app/components/Headers";
import Link from "next/link";

const articles = [
  {
    id: 1,
    title: "Tips Memilih Kost Dekat Kampus untuk Mahasiswa",
    excerpt: "Panduan lengkap memilih kost strategis dengan budget terjangkau...",
    category: "Tips",
    date: "28 Maret 2026",
    image: "🏫",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Fasilitas Wajib Kost Mahasiswa: Mana yang Penting?",
    excerpt: "WiFi, AC, atau kamar mandi dalam? Ini fasilitas yang wajib dipertimbangkan...",
    category: "Panduan",
    date: "25 Maret 2026",
    image: "🏠",
    readTime: "4 min",
  },
  {
    id: 3,
    title: "Cara Negosiasi Harga Kost dengan Pemilik",
    excerpt: "Tidak perlu malu! Ini strategi jitu mendapat harga terbaik...",
    category: "Tips",
    date: "22 Maret 2026",
    image: "💰",
    readTime: "3 min",
  },
  {
    id: 4,
    title: "Kelebihan dan Kekurangan Kost Putra vs Putri",
    excerpt: "Mana yang lebih cocok untukmu? Ini perbandingannya...",
    category: "Artikel",
    date: "20 Maret 2026",
    image: "👥",
    readTime: "6 min",
  },
  {
    id: 5,
    title: "Checklist Sebelum Menandatangani Kontrak Kost",
    excerpt: "Jangan sampai tertipu! Perhatikan hal-hal ini sebelum deal...",
    category: "Panduan",
    date: "18 Maret 2026",
    image: "📋",
    readTime: "7 min",
  },
  {
    id: 6,
    title: "5 Kesalahan Umum saat Mencari Kost Pertama Kali",
    excerpt: "Hindari kesalahan-kesalahan ini agar tidak menyesal nanti...",
    category: "Tips",
    date: "15 Maret 2026",
    image: "⚠️",
    readTime: "4 min",
  },
];

const categories = ["Semua", "Tips", "Panduan", "Artikel", "News"];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#011E55]">
        <div className="px-6 py-4">
          <Headers />
        </div>
      </div>

      <div className="bg-gray-50 flex-1">
        <div className="max-w-6xl mx-auto py-16 px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#011E55] mb-4">Artikel & Tips</h1>
            <p className="text-xl text-gray-600">Informasi terbaru tentang dunia kost dan hunians</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`px-5 py-2 rounded-full font-medium transition-colors ${
                  i === 0 
                    ? "bg-[#011E55] text-white" 
                    : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article key={article.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="h-48 bg-gradient-to-br from-[#011E55]/10 to-[#011E55]/5 flex items-center justify-center text-6xl">
                  {article.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="px-2 py-1 bg-[#011E55]/10 text-[#011E55] rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime} baca</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#011E55] transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <Link 
                    href={`/articles/${article.id}`}
                    className="text-[#011E55] font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Baca selengkapnya 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="px-8 py-3 border-2 border-[#011E55] text-[#011E55] rounded-xl font-semibold hover:bg-[#011E55] hover:text-white transition-colors">
              Muat Lebih Banyak
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-[#011E55] text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-white/60 text-sm">&copy; {new Date().getFullYear()} KOSE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
