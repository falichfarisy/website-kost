import Headers from "@/app/components/Headers";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
            
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
              Kami membantu kamu menemukan berbagai pilihan kost dengan mudah dan cepat. 
              Pilih berdasarkan lokasi, harga, dan fasilitas yang sesuai dengan kebutuhanmu.
            </p>

            <div className="max-w-2xl mx-auto mt-10">
              <form className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari kos di area..."
                    className="w-full h-14 pl-12 pr-4 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55]/20"
                  />
                </div>
                <Link 
                  href="/search"
                  className="h-14 md:w-40 bg-[#011E55] text-white px-8 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#0a2d6e] transition-all hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Cari
                </Link>
              </form>
              
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

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#011E55]">Mengapa Memilih KOSE?</h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Platform pencarian kost terbaik dengan fitur lengkap untuk menemukan hunian yang sesuai kebutuhanmu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Pencarian Cerdas",
                description: "Filter berdasarkan lokasi, harga, fasilitas, dan tipe kos dengan mudah.",
              },
              {
                icon: "📍",
                title: "Lokasi Akurat",
                description: "Peta interaktif membantu kamu menemukan kos di lokasi strategis.",
              },
              {
                icon: "⭐",
                title: "Ulasan Terpercaya",
                description: "Baca pengalaman pengguna lain untuk membantu keputusanmu.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#011E55] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative w-full h-64">
        <Image
          src="/wave-footer.svg"
          alt="wave-footer"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#011E55]/90 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold mb-2">KOSE</h3>
            <p className="text-white/80">Temukan kost terbaikmu hari ini</p>
            <div className="flex gap-4 mt-4 justify-center">
              <a href="#" className="hover:text-yellow-400 transition-colors">Instagram</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
