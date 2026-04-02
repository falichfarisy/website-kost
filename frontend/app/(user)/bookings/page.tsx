'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Booking, BookingStatus } from '@/lib/types';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, CheckCheck, X } from 'lucide-react';
import { useState } from 'react';

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Menunggu', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Clock },
  approved: { label: 'Disetujui', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  rejected: { label: 'Ditolak', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  cancelled: { label: 'Dibatalkan', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-700', icon: X },
  expired: { label: 'Kadaluarsa', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: AlertCircle },
  completed: { label: 'Selesai', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: CheckCheck },
};

export default function BookingsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', filter],
    queryFn: () => api.get('/bookings', { params: filter ? { status: filter } : {} }).then(res => res.data),
  });

  const bookings: Booking[] = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-[#011E55] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Booking Saya</h1>
          <p className="text-blue-200 mt-1">Kelola request booking kost kamu</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['', 'pending', 'approved', 'rejected', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-[#011E55] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {status === '' ? 'Semua' : statusConfig[status as BookingStatus]?.label || status}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Belum Ada Booking
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Kamu belum memiliki request booking kost
            </p>
            <button
              onClick={() => router.push('/search')}
              className="bg-[#011E55] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0a2d6e] transition-colors"
            >
              Cari Kost
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const config = statusConfig[booking.status] || statusConfig.pending;
              const StatusIcon = config.icon;

              return (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/bookings/${booking.id}`)}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {booking.kos?.name || `Kos #${booking.kos_id}`}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.kos?.address || 'Lokasi tidak tersedia'}</span>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {config.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Check-in</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(booking.check_in_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Durasi</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {booking.duration_months} bulan
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total</p>
                        <p className="font-medium text-[#011E55] dark:text-blue-400">
                          Rp {booking.total_price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Tanggal Booking</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(booking.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>
                    </div>

                    {booking.status === 'rejected' && booking.rejection_reason && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-400">
                          <span className="font-medium">Alasan penolakan:</span> {booking.rejection_reason}
                        </p>
                      </div>
                    )}

                    {booking.status === 'pending' && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          Request kamu sedang menunggu persetujuan dari pemilik kost
                        </p>
                      </div>
                    )}

                    {booking.status === 'approved' && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Booking kamu telah disetujui! Hubungi pemilik kost untuk detail lebih lanjut.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
