'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { UserPlus, Home, Heart, FileText, Bell, ShieldCheck, AlertCircle, User, Mail, Phone, Lock, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const registerSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    // resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');
    try {
      const mockUser = { id: 1, email: data.email, name: data.name, role: 'user' as const };
      const mockToken = 'dummy-access-token';
      const mockRefreshToken = 'dummy-refresh-token';
      
      setAuth(mockUser, mockToken, mockRefreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#011E55] via-[#0a2d6e] to-[#1a3a7a]">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#011E55]/30 blur-3xl" />
          
          <svg className="absolute top-32 right-10 w-32 h-32 text-white/10 animate-float" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <svg className="absolute bottom-24 left-16 w-24 h-24 text-white/10 animate-float-delayed" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
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
              <UserPlus className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Bergabung dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">KOSE</span>
          </h1>
          <p className="text-lg text-white/80 text-center max-w-md mb-10 leading-relaxed">
            Daftar sekarang dan temukan kost impianmu. Gratis tanpa biaya tambahan!
          </p>

          <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
            {[
              { icon: Home, title: 'Akses ke 1000+ Kost', desc: 'Pilihan terlengkap di kotamu' },
              { icon: Heart, title: 'Simpan Favorit', desc: 'Tandai kos yang kamu suka' },
              { icon: FileText, title: 'Tulis Ulasan', desc: 'Bantu orang lain memilih' },
              { icon: Bell, title: 'Notifikasi Promo', desc: 'Dapat info diskon terbaru' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300 flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-8">
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-white/60 text-sm">Gratis</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <Bell className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-white/60 text-sm">Support</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <ShieldCheck className="w-6 h-6 text-white/80 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-white/60 text-sm">Aman</div>
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
            <h2 className="text-2xl font-bold text-gray-900 mt-6">Buat Akun Baru</h2>
            <p className="text-gray-600 mt-2">Isi data dirimu untuk mendaftar</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Nama lengkap"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] focus:border-transparent transition-all"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">No. HP (opsional)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="0812xxxxxxx"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] focus:border-transparent transition-all"
                />
              </div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] focus:border-transparent transition-all"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#011E55] text-white py-3 rounded-xl font-semibold hover:bg-[#0a2d6e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-gray-600">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#011E55] font-semibold hover:underline">
              Masuk sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
