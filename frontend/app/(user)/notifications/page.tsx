'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Notification } from '@/lib/types';
import { Bell, CheckCircle, XCircle, Clock, Calendar, Check, Trash2 } from 'lucide-react';
import Link from 'next/link';

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  booking_request: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  booking_approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  booking_rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
  booking_cancelled: { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-700' },
  booking_expired: { icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  reminder: { icon: Bell, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', 'all'],
    queryFn: () => api.get('/notifications').then(res => res.data),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.put('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications: Notification[] = data?.data || [];
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-[#011E55] text-white py-8 px-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Notifikasi</h1>
            <p className="text-blue-200 mt-1">Pembaruan dan pengingat untuk kamu</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllReadMutation.mutate()}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              Tandai semua dibaca
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 py-8">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Belum Ada Notifikasi
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Kamu akan menerima notifikasi saat ada pembaruan tentang booking kamu
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const config = typeConfig[notification.type] || typeConfig.reminder;
              const Icon = config.icon;

              return (
                <div
                  key={notification.id}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden flex transition-colors ${
                    !notification.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="p-5 flex-1 flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                        <p className="text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap ml-4">
                          {new Date(notification.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      {notification.booking_id && (
                        <Link
                          href={`/bookings/${notification.booking_id}`}
                          className="inline-block mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Lihat Detail Booking &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(notification.id)}
                    className="px-4 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l border-gray-100 dark:border-gray-700"
                    aria-label="Hapus notifikasi"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
