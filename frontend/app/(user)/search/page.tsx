'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Kos, KosFilters } from '@/lib/types';
import ResultCard from '@/app/components/ResultCard';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [filters, setFilters] = useState<KosFilters>({
    page: 1,
    limit: 12,
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    min_rating: searchParams.get('min_rating') ? Number(searchParams.get('min_rating')) : undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['kos', filters],
    queryFn: () => api.get('/kos', { params: filters }).then(res => res.data),
  });

  const handleFilterChange = (key: keyof KosFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#011E55] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cari Kos</h1>
          
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Cari nama kos atau lokasi..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 text-gray-800 rounded-lg"
            />
            
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-4 py-2 text-gray-800 rounded-lg"
            >
              <option value="">Semua Tipe</option>
              <option value="putra">Putra</option>
              <option value="putri">Putri</option>
              <option value="campur">Campur</option>
            </select>

            <input
              type="number"
              placeholder="Min Harga"
              value={filters.min_price || ''}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              className="w-32 px-4 py-2 text-gray-800 rounded-lg"
            />

            <input
              type="number"
              placeholder="Max Harga"
              value={filters.max_price || ''}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              className="w-32 px-4 py-2 text-gray-800 rounded-lg"
            />

            <select
              value={filters.min_rating ? String(filters.min_rating) : ''}
              onChange={(e) => handleFilterChange('min_rating', e.target.value)}
              className="px-4 py-2 text-gray-800 rounded-lg"
            >
              <option value="">Semua Rating</option>
              <option value="4">4+ Bintang</option>
              <option value="3">3+ Bintang</option>
              <option value="2">2+ Bintang</option>
            </select>

            <button
              onClick={handleSearch}
              className="bg-[#ECECEC] text-[#011E55] px-6 py-2 rounded-lg font-medium hover:bg-gray-200"
            >
              Cari
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {isLoading ? (
          <div className="text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Terjadi kesalahan</div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">
              Ditemukan {data?.meta?.total || 0} kos
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data?.data?.map((kos: Kos) => (
                <Link key={kos.id} href={`/kos/${kos.id}`}>
                  <ResultCard
                    category={kos.kos_type}
                    location={kos.location?.district || kos.address}
                    nameKos={kos.name}
                    fasility={kos.facilities?.map(f => f.name) || []}
                    price={kos.price}
                    slotRoom={kos.available_rooms}
                  />
                </Link>
              ))}
            </div>

            {data?.meta?.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: data.meta.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleFilterChange('page', i + 1)}
                    className={`px-4 py-2 rounded ${
                      filters.page === i + 1
                        ? 'bg-[#011E55] text-white'
                        : 'bg-gray-200 text-gray-800'
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
