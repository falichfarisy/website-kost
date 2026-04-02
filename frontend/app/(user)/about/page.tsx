import Headers from "@/app/components/Headers";
import Link from "next/link";

export default function AboutPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-[#011E55] mb-4">Tentang KOSE</h1>
            <p className="text-xl text-gray-600">Misi kami membantu jutaan orang menemukan rumah terbaik</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Siapa Kami?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              KOSE adalah platform pencarian kost terpercaya yang didirikan dengan tujuan membantu mahasiswa dan masyarakat umum 
              menemukan hunian yang sesuai dengan kebutuhan dan budget mereka. Kami percaya bahwa mencari kost tidak seharusnya 
              rumit dan memakan waktu lama.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Dengan teknologi pencarian cerdas dan database kost terverifikasi, kami berkomitmen memberikan pengalaman 
              pencarian kost yang mudah, cepat, dan terpercaya.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { number: "1000+", label: "Kost Terverifikasi", icon: "🏠" },
              { number: "50+", label: "Kota di Indonesia", icon: "📍" },
              { number: "98%", label: "Kepuasan Pengguna", icon: "⭐" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-[#011E55]">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h2>
            <p className="text-gray-600 leading-relaxed">
              Menjadi platform pencarian kost nomor satu di Indonesia yang menghubungkan jutaan pencari kost 
              dengan pemilik kost berkualitas, menciptakan ekosistem yang menguntungkan semua pihak.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h2>
            <ul className="space-y-3 text-gray-600">
              {[
                "Menyediakan database kost terverifikasi yang akurat dan terpercaya",
                "Membantu pencari kost menemukan hunian sesuai kebutuhan dengan mudah",
                "Memberikan informasi transparan tentang harga, fasilitas, dan lokasi",
                "Mendukung pemilik kost untuk menjangkau lebih banyak penyewa potensial",
                "Terus meningkatkan teknologi untuk pengalaman pengguna yang lebih baik",
              ].map((mission, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">✓</span>
                  {mission}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Terpercaya", desc: "Kami menyajikan informasi yang akurat dan terverifikasi" },
                { title: "Mudah", desc: "Pengalaman pencarian yang simpel dan intuitif" },
                { title: "Transparan", desc: "Tidak ada biaya tersembunyi, informasi jelas" },
                { title: "Inovasi", desc: "Terus berkembang dengan teknologi terbaru" },
              ].map((value, i) => (
                <div key={i} className="border rounded-xl p-4">
                  <h3 className="font-bold text-[#011E55] mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
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
