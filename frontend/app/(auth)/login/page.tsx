'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Home, Search, MapPin, Star, Building2, AlertCircle, Mail, Lock } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email: data.email, password: data.password });
      const { access_token, refresh_token, user } = res.data;
      setAuth(user, access_token, refresh_token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#011E55] via-[#0a2d6e] to-[#1a3a7a]">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#011E55]/30 blur-3xl" />
          
          <svg className="absolute top-20 left-10 w-32 h-32 text-white/10 animate-float" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <svg className="absolute bottom-32 right-16 w-24 h-24 text-white/10 animate-float-delayed" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5L18 10v9H6v-9l6-4.5z"/>
          </svg>
          
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto border border-white/20">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">KOSE</span>
          </h1>
          <p className="text-lg text-white/80 text-center max-w-md mb-10 leading-relaxed">
            Temukan kost impianmu dengan mudah. Platform pencarian kost terpercaya untuk mahasiswa dan pekerja.
          </p>

          <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
            {[
              { icon: Search, title: 'Pencarian Cerdas', desc: 'Filter sesuai kebutuhan' },
              { icon: MapPin, title: 'Lokasi Akurat', desc: 'Peta interaktif' },
              { icon: Star, title: 'Ulasan Asli', desc: 'Dari penghuni nyata' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                <p className="text-white/60 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-white/60 text-sm">Kost Tersedia</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">5000+</div>
              <div className="text-white/60 text-sm">Pengguna Aktif</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">4.8</div>
              <div className="text-white/60 text-sm">Rating Rata-rata</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="white" fillOpacity="0.05"/>
          </svg>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold text-[#011E55]">KOSE</Link>
            <h2 className="text-2xl font-bold text-gray-900 mt-6">Masuk ke Akun</h2>
            <p className="text-gray-600 mt-2">Masukkan email dan password untuk melanjutkan</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="email@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] focus:border-transparent transition-all"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] focus:border-transparent transition-all"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#011E55] text-white py-3 rounded-xl font-semibold hover:bg-[#0a2d6e] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-gray-600">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#011E55] font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
