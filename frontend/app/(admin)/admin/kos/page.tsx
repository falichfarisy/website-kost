'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Kos, Facility } from '@/lib/types';

export default function AdminKosPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editingKos, setEditingKos] = useState<Kos | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    kos_type: 'putra',
    price: '',
    price_type: 'bulan',
    area: '',
    capacity: '1',
    available_rooms: '',
    facility_ids: [] as number[],
  });

  const { data: kosList } = useQuery({
    queryKey: ['admin-kos'],
    queryFn: () => api.get('/admin/kos').then(res => res.data.data || res.data),
  });

  const { data: facilities } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => api.get('/admin/facilities').then(res => res.data.data || res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/admin/kos', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-kos'] });
      setShowForm(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/admin/kos/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-kos'] });
      setShowForm(false);
      setEditingKos(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/kos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-kos'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      latitude: '',
      longitude: '',
      kos_type: 'putra',
      price: '',
      price_type: 'bulan',
      area: '',
      capacity: '1',
      available_rooms: '',
      facility_ids: [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: Number(formData.price),
      area: formData.area ? Number(formData.area) : undefined,
      capacity: Number(formData.capacity),
      available_rooms: Number(formData.available_rooms),
      latitude: formData.latitude ? Number(formData.latitude) : undefined,
      longitude: formData.longitude ? Number(formData.longitude) : undefined,
    };

    if (editingKos) {
      updateMutation.mutate({ id: editingKos.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (kos: Kos) => {
    setEditingKos(kos);
    setFormData({
      name: kos.name,
      description: kos.description || '',
      address: kos.address,
      latitude: kos.latitude?.toString() || '',
      longitude: kos.longitude?.toString() || '',
      kos_type: kos.kos_type,
      price: kos.price.toString(),
      price_type: kos.price_type,
      area: kos.area?.toString() || '',
      capacity: kos.capacity.toString(),
      available_rooms: kos.available_rooms.toString(),
      facility_ids: kos.facilities?.map(f => f.id) || [],
    });
    setShowForm(true);
  };

  if (user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#011E55] text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manajemen Kos</h1>
          <button
            onClick={() => { setShowForm(true); setEditingKos(null); resetForm(); }}
            className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
          >
            + Tambah Kos
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingKos ? 'Edit Kos' : 'Tambah Kos Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Kos</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipe Kos</label>
                <select
                  value={formData.kos_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, kos_type: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="putra">Putra</option>
                  <option value="putri">Putri</option>
                  <option value="campur">Campur</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga (per bulan)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kamar Tersedia</label>
                <input
                  type="number"
                  value={formData.available_rooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, available_rooms: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Luas (m²)</label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kapasitas</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Fasilitas</label>
                <div className="flex flex-wrap gap-2">
                  {facilities?.map((facility: Facility) => (
                    <label key={facility.id} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={formData.facility_ids.includes(facility.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, facility_ids: [...prev.facility_ids, facility.id] }));
                          } else {
                            setFormData(prev => ({ ...prev, facility_ids: prev.facility_ids.filter(id => id !== facility.id) }));
                          }
                        }}
                      />
                      {facility.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-[#011E55] text-white px-6 py-2 rounded-lg"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingKos(null); }}
                  className="px-6 py-2 border rounded-lg"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Tipe</th>
                <th className="px-4 py-3 text-left">Harga</th>
                <th className="px-4 py-3 text-left">Kamar</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kosList?.map((kos: Kos) => (
                <tr key={kos.id} className="border-t">
                  <td className="px-4 py-3">{kos.name}</td>
                  <td className="px-4 py-3">{kos.kos_type}</td>
                  <td className="px-4 py-3">Rp {kos.price.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3">{kos.available_rooms}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(kos)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(kos.id)}
                      className="text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
