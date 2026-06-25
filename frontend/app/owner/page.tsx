'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Booking } from '@/lib/types';
import { Calendar, Clock, CheckCircle, ArrowRight, LayoutDashboard, CalendarCheck } from 'lucide-react';

export default function OwnerDashboardPage() {
  const router = useRouter();

  const { data: pendingData } = useQuery({
    queryKey: ['owner', 'bookings', 'pending'],
    queryFn: () => api.get('/owner/bookings/pending').then(res => res.data),
  });

  const { data: allData } = useQuery({
    queryKey: ['owner', 'bookings', 'all'],
    queryFn: () => api.get('/owner/bookings').then(res => res.data),
  });

  const pendingBookings: Booking[] = pendingData?.data || [];
  const allBookings: Booking[] = allData?.data || [];

  const stats = {
    pending: pendingBookings.length,
    total: allBookings.length,
    approved: allBookings.filter(b => b.status === 'approved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-[#011E55] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Owner Dashboard</h1>
          <p className="text-blue-200 mt-1">Kelola booking kost kamu</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Menunggu Persetujuan</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Booking</p>
                <p className="text-3xl font-bold text-[#011E55] dark:text-blue-400 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Disetujui</p>
                <p className="text-3xl font-bold text-green-500 mt-1">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {stats.pending > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">Booking Menunggu</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stats.pending} request perlu ditinjau</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/owner/bookings?status=pending')}
                className="flex items-center gap-1 text-[#011E55] dark:text-blue-400 text-sm font-medium hover:underline"
              >
                Lihat semua
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {pendingBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/owner/bookings/${booking.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{booking.tenant_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.kos?.name} • {new Date(booking.check_in_date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#011E55] dark:text-blue-400">
                        Rp {booking.total_price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(booking.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/owner/bookings')}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#011E55]/10 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-7 h-7 text-[#011E55] dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Semua Booking</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lihat & kelola semua booking</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => router.push('/owner/bookings?status=pending')}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <CalendarCheck className="w-7 h-7 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Pending Approval</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Request yang menunggu persetujuan</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
