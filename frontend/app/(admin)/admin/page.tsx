'use client';

import { useAuthStore } from '@/lib/store';

export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#011E55] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="mt-2">Halo, {user?.name}!</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-600 text-sm">Total Kos</h3>
            <p className="text-3xl font-bold text-[#011E55]">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-600 text-sm">Total User</h3>
            <p className="text-3xl font-bold text-[#011E55]">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-600 text-sm">Total Ulasan</h3>
            <p className="text-3xl font-bold text-[#011E55]">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-600 text-sm">Kos Aktif</h3>
            <p className="text-3xl font-bold text-[#011E55]">0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Manajemen Kos</h2>
            <div className="space-y-2">
              <a href="/admin/kos" className="block py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                📋 Lihat Semua Kos
              </a>
              <a href="/admin/kos/new" className="block py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                ➕ Tambah Kos Baru
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Manajemen Sistem</h2>
            <div className="space-y-2">
              <a href="/admin/users" className="block py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                👥 Kelola User
              </a>
              <a href="/admin/facilities" className="block py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                🔧 Kelola Fasilitas
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
