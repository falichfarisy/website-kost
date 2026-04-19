'use client';

import { useAuthStore } from '@/lib/store';
import { Users, ClipboardList, UserCog, Settings, Plus, Building2 } from 'lucide-react';

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
            <div className="space-y-3">
              <a href="/admin/kos" className="flex items-center gap-3 py-3 px-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300 hover:scale-105 hover:shadow-md group">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <ClipboardList className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium group-hover:text-[#011E55] transition-colors">Lihat Semua Kos</span>
              </a>
              <a href="/admin/kos/new" className="flex items-center gap-3 py-3 px-4 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-300 hover:scale-105 hover:shadow-md group">
                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium group-hover:text-green-600 transition-colors">Tambah Kos Baru</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Manajemen Sistem</h2>
            <div className="space-y-3">
              <a href="/admin/users" className="flex items-center gap-3 py-3 px-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all duration-300 hover:scale-105 hover:shadow-md group">
                <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium group-hover:text-purple-600 transition-colors">Kelola User</span>
              </a>
              <a href="/admin/facilities" className="flex items-center gap-3 py-3 px-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all duration-300 hover:scale-105 hover:shadow-md group">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium group-hover:text-orange-600 transition-colors">Kelola Fasilitas</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
