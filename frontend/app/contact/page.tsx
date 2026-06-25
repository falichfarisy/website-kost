"use client";

import { useState, useCallback } from 'react';
import { useRouter } from "next/navigation";
import Headers from "@/app/components/Headers";
import api from '@/lib/api';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const navigate = useCallback((path: string) => router.push(path), [router]);
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
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Mail, title: "Email", value: "hello@kose.id", desc: "Kami akan membalas dalam 24 jam", color: "from-blue-500 to-blue-600" },
    { icon: Phone, title: "WhatsApp", value: "+62 812 3456 7890", desc: "Chat langsung dengan tim kami", color: "from-green-500 to-green-600" },
    { icon: MapPin, title: "Kantor", value: "Jakarta, Indonesia", desc: "Senin - Jumat, 09:00 - 18:00", color: "from-purple-500 to-purple-600" },
  ];

  const subjects = [
    "Pertanyaan Umum",
    "Masalah Teknis",
    "Kerja Sama",
    "Laporan Penyedia Kost",
    "Lainnya",
  ];

  const quickFaqs = [
    { q: "Berapa lama respons waktu?", a: "Kami merespons dalam 24 jam kerja." },
    { q: "Apakah layanan ini gratis?", a: "Ya, mencari kost di KOSE sepenuhnya gratis untuk pengguna." },
    { q: "Bagaimana jadi partner?", a: "Hubungi kami melalui email untuk diskusi partnership." },
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
              Hubungi <span className="text-yellow-400">Kami</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Punya pertanyaan atau butuh bantuan? Tim kami siap membantu kapan saja.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 px-6 bg-gray-50 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((info, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-md`}>
                  <info.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                <p className="text-[#011E55] font-semibold">{info.value}</p>
                <p className="text-gray-500 text-sm mt-2">{info.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">Pesan Terkirim!</h3>
                  <p className="text-gray-600 mb-4">Terima kasih telah menghubungi kami. Kami akan merespons dalam 24 jam.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-[#011E55] font-medium hover:underline"
                  >
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55]/30 focus:border-[#011E55] transition-all"
                      placeholder="Nama kamu"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55]/30 focus:border-[#011E55] transition-all"
                      placeholder="email@kamu.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subjek</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55]/30 focus:border-[#011E55] transition-all cursor-pointer"
                    >
                      <option value="">Pilih subjek...</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55]/30 focus:border-[#011E55] transition-all resize-none"
                      placeholder="Tulis pesanmu di sini..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#011E55] text-white py-3 rounded-xl font-semibold hover:bg-[#0a2d6e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Kirim Pesan
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ Cepat</h2>
                <div className="space-y-4">
                  {quickFaqs.map((faq, i) => (
                    <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium text-gray-900 mb-1">{faq.q}</h4>
                      <p className="text-gray-600 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#011E55] to-[#0a2d6e] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Butuh Bantuan Segera?</h3>
                  <p className="text-white/80 mb-6">Chat langsung dengan tim kami via WhatsApp</p>
                  <a 
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg"
                  >
                    <Phone className="w-5 h-5" />
                    Chat WhatsApp
                  </a>
                </div>
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
