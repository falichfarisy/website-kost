'use client';

import { useState } from 'react';
import Headers from "@/app/components/Headers";
import Link from "next/link";

const faqCategories = [
  {
    title: "Pencarian Kost",
    icon: "🔍",
    faqs: [
      { q: "Bagaimana cara mencari kost di KOSE?", a: "Kamu bisa menggunakan fitur pencarian di halaman utama. Masukkan lokasi, pilih tipe kost (putra/putri/campur), tentukan range harga, dan pilih fasilitas yang diinginkan." },
      { q: "Apa saja filter yang tersedia?", a: "Kami menyediakan filter berdasarkan: tipe kost, harga (min-max), lokasi/kota, fasilitas (WiFi, AC, kamar mandi dalam, dll), dan rating." },
      { q: "Bagaimana cara melihat lokasi kost?", a: "Setiap halaman detail kost menampilkan peta lokasi. Kamu juga bisa menggunakan fitur-directions untuk melihat rute dari lokasi tertentu." },
    ]
  },
  {
    title: "Akun & Pendaftaran",
    icon: "👤",
    faqs: [
      { q: "Apakah saya harus daftar untuk mencari kost?", a: "Tidak, kamu bisa mencari kost tanpa akun. Namun, untuk menyimpan favorit dan menulis ulasan, kamu perlu membuat akun." },
      { q: "Bagaimana cara daftar akun?", a: "Klik tombol 'Daftar' di halaman utama. Isi nama lengkap, email, password, dan nomor HP. Verifikasi email kamu untuk aktivasi akun." },
      { q: "Apa yang bisa saya lakukan setelah login?", a: "Setelah login, kamu bisa: menyimpan kost favorit, menulis ulasan dan rating, melihat riwayat pencarian, dan mengelola profil." },
    ]
  },
  {
    title: "Favorit & Booking",
    icon: "❤️",
    faqs: [
      { q: "Bagaimana cara menyimpan kost favorit?", a: "Klik tombol '❤️ Favorit' di halaman detail kost. Kost akan tersimpan di menu 'Favorit Saya'." },
      { q: "Apakah ada biaya untuk menyimpan favorit?", a: "Tidak, menyimpan favorit sepenuhnya gratis dan tanpa batas jumlah." },
      { q: "Bagaimana cara menghubungi pemilik kost?", a: "Di halaman detail kost, ada tombol 'Hubungi Penyedia' yang akan menampilkan nomor WhatsApp atau formulir kontak." },
    ]
  },
  {
    title: "Ulasan & Rating",
    icon: "⭐",
    faqs: [
      { q: "Bagaimana cara menulis ulasan?", a: "Login ke akun kamu, buka halaman detail kost, lalu klik 'Tulis Ulasan'. Berikan rating 1-5 bintang dan tulis pengalamanmu." },
      { q: "Apakah ulasan bisa diedit atau dihapus?", a: "Ya, kamu bisa mengedit atau menghapus ulasanmu sendiri dari menu profil > Riwayat Ulasan." },
      { q: "Bagaimana rating kost dihitung?", a: "Rating adalah rata-rata dari semua ulasan yang diberikan pengguna. Kami sangat menekankan jujur dalam memberikan ulasan." },
    ]
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#011E55]">
        <div className="px-6 py-4">
          <Headers />
        </div>
      </div>

      <div className="bg-gray-50 flex-1">
        <div className="max-w-4xl mx-auto py-16 px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#011E55] mb-4">Pusat Bantuan</h1>
            <p className="text-xl text-gray-600">Temukan jawaban untuk pertanyaanmu</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55]"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan yang Sering Diajukan</h2>
            {faqCategories.map((category, catIndex) => (
              <div key={catIndex} className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-lg font-bold text-[#011E55]">{category.title}</h3>
                </div>
                <div className="space-y-2">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = catIndex * 10 + faqIndex;
                    return (
                      <div key={faqIndex} className="border rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleFaq(globalIndex)}
                          className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{faq.q}</span>
                          <svg 
                            className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === globalIndex ? 'rotate-180' : ''}`} 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openFaq === globalIndex && (
                          <div className="px-4 pb-4 pt-2 text-gray-600 bg-gray-50">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#011E55] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Masih Punya Pertanyaan?</h3>
            <p className="text-white/80 mb-6">Tim support kami siap membantu kamu</p>
            <Link 
              href="/contact"
              className="inline-block bg-white text-[#011E55] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Hubungi Kami
            </Link>
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
