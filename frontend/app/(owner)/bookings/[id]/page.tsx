'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Booking, BookingStatus } from '@/lib/types';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle, CheckCheck, X, User, Phone, Mail, ArrowLeft, Building2 } from 'lucide-react';

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Menunggu', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Clock },
  approved: { label: 'Disetujui', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  rejected: { label: 'Ditolak', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  cancelled: { label: 'Dibatalkan', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-700', icon: X },
  expired: { label: 'Kadaluarsa', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: AlertCircle },
  completed: { label: 'Selesai', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: CheckCheck },
};

export default function OwnerBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  const action = searchParams.get('action');

  const { data: booking, isLoading } = useQuery<{ data: Booking }>({
    queryKey: ['owner', 'booking', params.id],
    queryFn: () => api.get(`/owner/bookings/${params.id}`).then(res => res.data),
    enabled: !!params.id,
  });

  const approveMutation = useMutation({
    mutationFn: () => api.put(`/owner/bookings/${params.id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'booking', params.id] });
      setShowApproveConfirm(false);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => api.put(`/owner/bookings/${params.id}/reject`, { reason: rejectReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'booking', params.id] });
      setShowRejectModal(false);
    },
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!booking?.data) {
    return <div className="min-h-screen flex items-center justify-center">Booking tidak ditemukan</div>;
  }

  const b = booking.data;
  const config = statusConfig[b.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-[#011E55] text-white py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <h1 className="text-xl font-bold">Detail Booking</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#011E55] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {b.tenant_name[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{b.tenant_name}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{b.tenant_email}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                <StatusIcon className="w-4 h-4" />
                {config.label}
              </span>
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Kos</p>
                <p className="font-semibold text-gray-900 dark:text-white">{b.kos?.name || `#${b.kos_id}`}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Check-in</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(b.check_in_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Informasi Penyewa</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{b.tenant_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{b.tenant_email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a href={`https://wa.me/${b.tenant_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[#011E55] dark:text-blue-400 hover:underline">
                    {b.tenant_phone}
                  </a>
                </div>
              </div>
              {b.tenant_notes && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-1">Catatan dari penyewa:</p>
                  <p className="text-blue-600 dark:text-blue-300">{b.tenant_notes}</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Rincian Biaya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Harga per bulan</span>
                  <span className="text-gray-900 dark:text-white">Rp {b.monthly_price.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Durasi</span>
                  <span className="text-gray-900 dark:text-white">{b.duration_months} bulan</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-[#011E55] dark:text-blue-400">Rp {b.total_price.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {b.status === 'rejected' && b.rejection_reason && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <p className="font-medium text-red-700 dark:text-red-400 mb-1">Alasan Penolakan:</p>
                <p className="text-red-600 dark:text-red-300">{b.rejection_reason}</p>
              </div>
            )}

            {b.status === 'pending' && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowApproveConfirm(true)}
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                >
                  Setujui Booking
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Tolak Booking
                </button>
              </div>
            )}

            {b.status === 'approved' && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-green-700 dark:text-green-400 text-center">
                  Booking telah disetujui. Kamar akan dikurangi dari total kamar tersedia.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showApproveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowApproveConfirm(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Setujui Booking?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Kamar tersedia akan dikurangi 1. Pastikan kos kamu memang tersedia.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveConfirm(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {approveMutation.isPending ? 'Memproses...' : 'Ya, Setujui'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Tolak Booking?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Berikan alasan penolakan agar penyewa mengerti.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Kamar sudah terisi, Silakan coba kost lain, dll"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] dark:text-white mb-4"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => rejectMutation.mutate()}
                disabled={rejectMutation.isPending || !rejectReason.trim()}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {rejectMutation.isPending ? 'Memproses...' : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
