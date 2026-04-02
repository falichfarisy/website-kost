'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      
      const loginResponse = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      
      const { access_token, refresh_token, user } = loginResponse.data;
      setAuth(user, access_token, refresh_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#011E55] to-[#0a2d6e] flex-col justify-center items-center p-12">
        <h1 className="text-5xl font-bold text-white mb-6">Bergabung dengan KOSE</h1>
        <p className="text-xl text-white/80 text-center max-w-md">
          Daftar sekarang dan temukan kost terbaikmu. Gratis tanpa biaya tambahan!
        </p>
        
        <div className="mt-12 space-y-4">
          {[
            { icon: '✓', text: 'Akses ke 1000+ kost' },
            { icon: '✓', text: 'Simpan favoritmu' },
            { icon: '✓', text: 'Tulis ulasan' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-white">
              <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
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
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
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
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
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
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
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
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
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
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
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
