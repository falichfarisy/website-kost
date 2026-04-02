'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Booking, BookingStatus } from '@/lib/types';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, CheckCheck, X, User, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Menunggu', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Clock },
  approved: { label: 'Disetujui', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  rejected: { label: 'Ditolak', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  cancelled: { label: 'Dibatalkan', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-700', icon: X },
  expired: { label: 'Kadaluarsa', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: AlertCircle },
  completed: { label: 'Selesai', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: CheckCheck },
};

export default function OwnerBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['owner', 'bookings', statusFilter, page],
    queryFn: () => {
      const params: Record<string, any> = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      return api.get(statusFilter === 'pending' ? '/owner/bookings/pending' : '/owner/bookings', { params }).then(res => res.data);
    },
  });

  const bookings: Booking[] = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-[#011E55] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/owner')}
            className="text-blue-200 hover:text-white mb-4 transition-colors"
          >
            ← Kembali ke Dashboard
          </button>
          <h1 className="text-2xl font-bold">Manajemen Booking</h1>
          <p className="text-blue-200 mt-1">Kelola semua booking kost kamu</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['', 'pending', 'approved', 'rejected', 'cancelled', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => router.push(status ? `/owner/bookings?status=${status}` : '/owner/bookings')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
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
              Tidak Ada Booking
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {statusFilter ? `Tidak ada booking dengan status "${statusConfig[statusFilter as BookingStatus]?.label}"` : 'Belum ada booking untuk kost kamu'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {bookings.map((booking) => {
                const config = statusConfig[booking.status] || statusConfig.pending;
                const StatusIcon = config.icon;

                return (
                  <div
                    key={booking.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#011E55] rounded-full flex items-center justify-center text-white font-semibold">
                              {booking.tenant_name[0].toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{booking.tenant_name}</h3>
                              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                                <Phone className="w-3 h-3" />
                                <span>{booking.tenant_phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.kos?.name || `Kos #${booking.kos_id}`}</span>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {config.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
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
                          <p className="font-medium text-gray-900 dark:text-white">{booking.duration_months} bulan</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Total</p>
                          <p className="font-medium text-[#011E55] dark:text-blue-400">
                            Rp {booking.total_price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Request via</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(booking.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                        </div>
                      </div>

                      {booking.tenant_notes && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Catatan:</p>
                          <p className="text-gray-700 dark:text-gray-300">{booking.tenant_notes}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => router.push(`/owner/bookings/${booking.id}?action=approve`)}
                              className="flex-1 bg-green-500 text-white py-2.5 rounded-lg font-medium hover:bg-green-600 transition-colors"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => router.push(`/owner/bookings/${booking.id}?action=reject`)}
                              className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => router.push(`/owner/bookings/${booking.id}`)}
                          className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: meta.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      page === i + 1
                        ? 'bg-[#011E55] text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
