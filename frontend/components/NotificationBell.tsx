'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Notification } from '@/lib/types';
import { Bell, Check, CheckCheck, X, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  booking_request: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  booking_approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  booking_rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
  booking_cancelled: { icon: X, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-700' },
  booking_expired: { icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  reminder: { icon: Bell, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
};

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { isAuthenticated } = useAuthStore();

  const { data: countData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api.get('/notifications/unread/count').then(res => res.data),
    refetchInterval: 30000,
    enabled: isAuthenticated,
  });

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => api.get('/notifications', { params: { limit: 10 } }).then(res => res.data),
    enabled: isOpen && isAuthenticated,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => api.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.put('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = countData?.count || 0;
  const notifications: Notification[] = notificationsData?.data || [];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifikasi</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-sm text-[#011E55] dark:text-blue-400 hover:underline"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Tidak ada notifikasi</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const config = typeConfig[notification.type] || typeConfig.reminder;
                  const Icon = config.icon;

                  return (
                    <Link
                      key={notification.id}
                      href={notification.booking_id ? `/bookings/${notification.booking_id}` : '#'}
                      onClick={() => {
                        if (!notification.is_read) {
                          markReadMutation.mutate(notification.id);
                        }
                        setIsOpen(false);
                      }}
                      className={`block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0 ${
                        !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {notification.title}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                            {new Date(notification.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-center text-sm text-[#011E55] dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700"
              >
                Lihat semua notifikasi
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
