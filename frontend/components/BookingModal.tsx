'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { X, Calendar, Clock, User, Mail, Phone, FileText, CheckCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  kosId: number;
  kosName: string;
  price: number;
}

export default function BookingModal({ isOpen, onClose, kosId, kosName, price }: BookingModalProps) {
  const [formData, setFormData] = useState({
    tenant_name: '',
    tenant_email: '',
    tenant_phone: '',
    tenant_notes: '',
    check_in_date: '',
    duration_months: 1,
  });
  const [success, setSuccess] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        tenant_name: '',
        tenant_email: '',
        tenant_phone: '',
        tenant_notes: '',
        check_in_date: '',
        duration_months: 1,
      });
      setSuccess(false);
    }
  }, [isOpen]);

  const createBooking = useMutation({
    mutationFn: (data: typeof formData) => 
      api.post('/bookings', {
        kos_id: kosId,
        ...data,
        monthly_price: price,
      }),
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking.mutate(formData);
  };

  const totalPrice = price * formData.duration_months;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div 
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 id="booking-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
            {success ? 'Booking Berhasil!' : 'Booking Kost'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Request Booking Dikirim!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Pemilik kost akan meninjau request kamu. Kamu akan mendapat notifikasi ketika booking diapprove atau ditolak.
              </p>
              <button
                onClick={onClose}
                className="bg-[#011E55] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0a2d6e] transition-colors"
              >
                Tutup
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                <p className="font-medium text-gray-900 dark:text-white">{kosName}</p>
                <p className="text-[#011E55] font-bold text-lg mt-1">
                  Rp {price.toLocaleString('id-ID')}/bulan
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4" />
                  Nama Lengkap
                </label>
                <input
                  id="tenant_name"
                  type="text"
                  required
                  value={formData.tenant_name}
                  onChange={(e) => setFormData({ ...formData, tenant_name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] dark:text-white"
                  placeholder="Masukkan nama lengkap"
                  aria-label="Nama lengkap penyewa"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  id="tenant_email"
                  type="email"
                  required
                  value={formData.tenant_email}
                  onChange={(e) => setFormData({ ...formData, tenant_email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] dark:text-white"
                  placeholder="email@contoh.com"
                  aria-label="Email penyewa"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4" />
                  Nomor WhatsApp
                </label>
                <input
                  id="tenant_phone"
                  type="tel"
                  required
                  value={formData.tenant_phone}
                  onChange={(e) => setFormData({ ...formData, tenant_phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] dark:text-white"
                  placeholder="08xxxxxxxxxx"
                  aria-label="Nomor WhatsApp"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4" />
                    Tanggal Masuk
                  </label>
                  <input
                    id="check_in_date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.check_in_date}
                    onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] dark:text-white"
                    aria-label="Tanggal masuk"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4" />
                    Durasi (Bulan)
                  </label>
                  <select
                    id="duration_months"
                    value={formData.duration_months}
                    onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] dark:text-white"
                    aria-label="Durasi penyewaan dalam bulan"
                  >
                    {[1, 2, 3, 6, 12].map((m) => (
                      <option key={m} value={m}>{m} bulan</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4" />
                  Catatan (Opsional)
                </label>
                <textarea
                  id="tenant_notes"
                  value={formData.tenant_notes}
                  onChange={(e) => setFormData({ ...formData, tenant_notes: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] dark:text-white"
                  rows={3}
                  placeholder="Ceritakan tentang dirimu, kapan mau survey, dll"
                  aria-label="Catatan tambahan"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Harga per bulan</span>
                  <span>Rp {price.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Durasi</span>
                  <span>{formData.duration_months} bulan</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 my-2 pt-2">
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={createBooking.isPending}
                className="w-full bg-[#011E55] text-white py-4 rounded-xl font-semibold hover:bg-[#0a2d6e] disabled:opacity-50 transition-colors"
              >
                {createBooking.isPending ? 'Mengirim...' : 'Kirim Request Booking'}
              </button>

              {createBooking.isError && (
                <p className="text-red-500 text-sm text-center" role="alert">
                  Terjadi kesalahan. Silakan coba lagi.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
