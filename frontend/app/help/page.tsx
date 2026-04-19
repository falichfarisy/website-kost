"use client";

import { useState, useCallback } from 'react';
import { useRouter } from "next/navigation";
import Headers from "@/app/components/Headers";
import { Search, MessageCircle, Mail, Phone, Search as SearchIcon, User, Heart, Star, ChevronDown } from "lucide-react";

export default function HelpPage() {
  const router = useRouter();
  const navigate = useCallback((path: string) => router.push(path), [router]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqCategories = [
    {
      title: "Pencarian Kost",
      icon: SearchIcon,
      faqs: [
        { q: "Bagaimana cara mencari kost di KOSE?", a: "Kamu bisa menggunakan fitur pencarian di halaman utama. Masukkan lokasi, pilih tipe kost (putra/putri/campur), tentukan range harga, dan pilih fasilitas yang diinginkan." },
        { q: "Apa saja filter yang tersedia?", a: "Kami menyediakan filter berdasarkan: tipe kost, harga (min-max), lokasi/kota, fasilitas (WiFi, AC, kamar mandi dalam, dll), dan rating." },
        { q: "Bagaimana cara melihat lokasi kost?", a: "Setiap halaman detail kost menampilkan peta lokasi. Kamu juga bisa menggunakan fitur-directions untuk melihat rute dari lokasi tertentu." },
      ]
    },
    {
      title: "Akun & Pendaftaran",
      icon: User,
      faqs: [
        { q: "Apakah saya harus daftar untuk mencari kost?", a: "Tidak, kamu bisa mencari kost tanpa akun. Namun, untuk menyimpan favorit dan menulis ulasan, kamu perlu membuat akun." },
        { q: "Bagaimana cara daftar akun?", a: "Klik tombol 'Daftar' di halaman utama. Isi nama lengkap, email, password, dan nomor HP. Verifikasi email kamu untuk aktivasi akun." },
        { q: "Apa yang bisa saya lakukan setelah login?", a: "Setelah login, kamu bisa: menyimpan kost favorit, menulis ulasan dan rating, melihat riwayat pencarian, dan mengelola profil." },
      ]
    },
    {
      title: "Favorit & Booking",
      icon: Heart,
      faqs: [
        { q: "Bagaimana cara menyimpan kost favorit?", a: "Klik tombol 'Favorit' di halaman detail kost. Kost akan tersimpan di menu 'Favorit Saya'." },
        { q: "Apakah ada biaya untuk menyimpan favorit?", a: "Tidak, menyimpan favorit sepenuhnya gratis dan tanpa batas jumlah." },
        { q: "Bagaimana cara menghubungi pemilik kost?", a: "Di halaman detail kost, ada tombol 'Hubungi Penyedia' yang akan menampilkan nomor WhatsApp atau formulir kontak." },
      ]
    },
    {
      title: "Ulasan & Rating",
      icon: Star,
      faqs: [
        { q: "Bagaimana cara menulis ulasan?", a: "Login ke akun kamu, buka halaman detail kost, lalu klik 'Tulis Ulasan'. Berikan rating 1-5 bintang dan tulis pengalamanmu." },
        { q: "Apakah ulasan bisa diedit atau dihapus?", a: "Ya, kamu bisa mengedit atau menghapus ulasanmu sendiri dari menu profil > Riwayat Ulasan." },
        { q: "Bagaimana rating kost dihitung?", a: "Rating adalah rata-rata dari semua ulasan yang diberikan pengguna. Kami sangat menekankan jujur dalam memberikan ulasan." },
      ]
    },
  ];

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
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Kami siap membantu
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              pusat <span className="text-yellow-400">Bantuan</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaanmu atau hubungi tim kami
            </p>

            <div className="max-w-xl mx-auto mt-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 px-6 bg-gray-50 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="space-y-8">
            {faqCategories.map((category, catIndex) => (
              <div key={catIndex}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    catIndex === 0 ? 'bg-blue-100' :
                    catIndex === 1 ? 'bg-purple-100' :
                    catIndex === 2 ? 'bg-pink-100' :
                    'bg-yellow-100'
                  }`}>
                    <category.icon className={`w-5 h-5 ${
                      catIndex === 0 ? 'text-blue-600' :
                      catIndex === 1 ? 'text-purple-600' :
                      catIndex === 2 ? 'text-pink-600' :
                      'text-yellow-600'
                    }`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{category.title}</h3>
                </div>
                <div className="space-y-2">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = catIndex * 10 + faqIndex;
                    return (
                      <div 
                        key={faqIndex} 
                        className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleFaq(globalIndex)}
                          className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{faq.q}</span>
                          <ChevronDown 
                            className={`w-5 h-5 text-gray-400 transition-all duration-300 flex-shrink-0 ml-4 ${openFaq === globalIndex ? 'rotate-180 text-[#011E55]' : ''}`} 
                          />
                        </button>
                        {openFaq === globalIndex && (
                          <div className="px-5 pb-4 pt-2 text-gray-600 bg-gray-50 border-t border-gray-100 animate-fade-in-up">
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
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#011E55] to-[#0a2d6e] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Masih Punya Pertanyaan?</h3>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Tim support kami siap membantu kamu 24/7. Hubungi kami melalui channel favoritmu.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-[#011E55] rounded-xl font-bold hover:bg-yellow-300 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Hubungi Kami
                </button>
                <a 
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#011E55] text-white">
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
                <li><button onClick={() => navigate("/search")} className="text-white/90 hover:text-white transition-colors text-left">Cari Kost</button></li>
                <li><button onClick={() => navigate("/about")} className="text-white/90 hover:text-white transition-colors text-left">Tentang Kami</button></li>
                <li><button onClick={() => navigate("/articles")} className="text-white/90 hover:text-white transition-colors text-left">Artikel</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5">Bantuan</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate("/help")} className="text-white/90 hover:text-white transition-colors text-left">Pusat Bantuan</button></li>
                <li><button onClick={() => navigate("/contact")} className="text-white/90 hover:text-white transition-colors text-left">Hubungi Kami</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-sm font-medium">
              &copy; {new Date().getFullYear()} KOSE. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-white/80">
              <span className="hover:text-white font-medium transition-colors cursor-default">Kebijakan Privasi</span>
              <span className="hover:text-white font-medium transition-colors cursor-default">Syarat & Ketentuan</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
