"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Headers from "@/app/components/Headers";
import { Building2, Users, Star, Shield, Heart, Clock, Search, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();
  const navigate = useCallback((path: string) => router.push(path), [router]);

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
              Platform Pencarian Kost Terpercaya
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Tentang <span className="text-yellow-400">KOSE</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Misi kami membantu jutaan orang menemukan rumah terbaik untuk kebutuhan mereka dengan mudah dan terpercaya.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => navigate("/search")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-[#011E55] rounded-xl font-bold hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl"
              >
                <Search className="w-5 h-5" />
                Cari Kost
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
              >
                Hubungi Kami
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
            {[
              { number: "1000+", label: "Kost Terverifikasi" },
              { number: "500+", label: "Pemilik Kost" },
              { number: "50+", label: "Kota" },
              { number: "98%", label: "Kepuasan User" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.number}</div>
                <div className="text-white/80 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Siapa Kami?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                KOSE adalah platform pencarian kost terpercaya yang didirikan dengan tujuan membantu mahasiswa dan masyarakat umum menemukan hunian yang sesuai dengan kebutuhan dan budget mereka.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Dengan teknologi pencarian cerdas dan database kost terverifikasi, kami berkomitmen memberikan pengalaman pencarian kost yang mudah, cepat, dan terpercaya.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h2>
              <p className="text-gray-700 leading-relaxed">
                Menjadi platform pencarian kost nomor satu di Indonesia yang menghubungkan jutaan pencari kost dengan pemilik kost berkualitas, menciptakan ekosistem yang menguntungkan semua pihak.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-[#011E55]/10 text-[#011E55] rounded-full text-sm font-medium mb-4">
              MISI KAMI
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Mengapa Memilih <span className="text-[#011E55]">KOSE</span>?
            </h2>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
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
              <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-yellow-400 text-[#011E55] rounded-full text-sm font-bold mb-4">
              NILAI-NILAI KAMI
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Prinsip yang Kami <span className="text-[#011E55]">pegang</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "Terpercaya", 
                desc: "Kami menyajikan informasi yang akurat dan terverifikasi untuk setiap kost", 
                icon: Shield,
                color: "from-blue-500 to-blue-600",
              },
              { 
                title: "Mudah", 
                desc: "Pengalaman pencarian yang simpel dan intuitif untuk semua user", 
                icon: Heart,
                color: "from-pink-500 to-pink-600",
              },
              { 
                title: "Transparan", 
                desc: "Tidak ada biaya tersembunyi, informasi harga dan fasilitas jelas", 
                icon: CheckCircle2,
                color: "from-green-500 to-green-600",
              },
              { 
                title: "Inovasi", 
                desc: "Terus berkembang dengan teknologi terbaru untuk pengalaman terbaik", 
                icon: Clock,
                color: "from-purple-500 to-purple-600",
              },
            ].map((value, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-center">
                <div className={`w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Siap Menemukan Kost Impian?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Bergabung dengan ribuan pengguna yang telah menemukan kost terbaik mereka melalui KOSE.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/search")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#011E55] text-white rounded-xl font-bold hover:bg-[#0a2d6e] transition-all shadow-lg hover:shadow-xl"
            >
              <Search className="w-5 h-5" />
              Mulai Pencarian
            </button>
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-[#011E55] rounded-xl font-bold hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-[#011E55] text-white">
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
              <h4 className="text-white font-bold mb-5">Tautan Cepat</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate("/search")} className="text-white/90 hover:text-white transition-colors text-left">Cari Kost</button></li>
                <li><button onClick={() => navigate("/login")} className="text-white/90 hover:text-white transition-colors text-left">Masuk</button></li>
                <li><button onClick={() => navigate("/register")} className="text-white/90 hover:text-white transition-colors text-left">Daftar</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5">Hubungi Kami</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-white/90">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  hello@kose.id
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +62 812 3456 7890
                </li>
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
