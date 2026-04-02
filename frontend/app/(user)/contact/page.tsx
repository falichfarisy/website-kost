'use client';

import { useState } from 'react';
import Headers from "@/app/components/Headers";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: "📧", title: "Email", value: "hello@kose.id", desc: "Kami akan membalas dalam 24 jam" },
    { icon: "📱", title: "WhatsApp", value: "+62 812 3456 7890", desc: "Chat langsung dengan tim kami" },
    { icon: "📍", title: "Kantor", value: "Jakarta, Indonesia", desc: "Senin - Jumat, 09:00 - 18:00" },
  ];

  const subjects = [
    "Pertanyaan Umum",
    "Masalah Teknis",
    "Kerja Sama",
    "Laporan Penyedia Kost",
    "Lainnya",
  ];

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
            <h1 className="text-4xl md:text-5xl font-bold text-[#011E55] mb-4">Hubungi Kami</h1>
            <p className="text-xl text-gray-600">Kami siap membantu kamu kapan saja</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((info, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <div className="text-4xl mb-4">{info.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                <p className="text-[#011E55] font-semibold">{info.value}</p>
                <p className="text-gray-500 text-sm mt-2">{info.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">Pesan Terkirim!</h3>
                  <p className="text-gray-600">Terima kasih telah menghubungi kami. Kami akan merespons dalam 24 jam.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-[#011E55] font-medium hover:underline"
                  >
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55]"
                      placeholder="Nama kamu"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55]"
                      placeholder="email@kamu.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55]"
                    >
                      <option value="">Pilih subjek...</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55]"
                      placeholder="Tulis pesanmu di sini..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#011E55] text-white py-3 rounded-xl font-semibold hover:bg-[#0a2d6e] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Mengirim...' : 'Kirim Pesan'}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ Cepat</h2>
                <div className="space-y-4">
                  {[
                    { q: "Berapa lama响应 waktu?", a: "Kami merespons dalam 24 jam kerja." },
                    { q: "Apakah layanan ini gratis?", a: "Ya, mencari kost di KOSE sepenuhnya gratis untuk pengguna." },
                    { q: "Bagaimana jadi partner?", a: "Hubungi kami melalui email untuk diskusi partnership." },
                  ].map((faq, i) => (
                    <div key={i} className="border-b pb-4 last:border-0">
                      <h4 className="font-medium text-gray-900 mb-1">{faq.q}</h4>
                      <p className="text-gray-600 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#011E55] to-[#0a2d6e] rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Butuh Bantuan Segera?</h3>
                <p className="text-white/80 mb-4">Chat langsung dengan tim kami via WhatsApp</p>
                <a 
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat WhatsApp
                </a>
              </div>
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
