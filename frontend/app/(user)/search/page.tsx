'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Kos, KosFilters } from '@/lib/types';
import ResultCard from '@/app/components/ResultCard';
import Link from 'next/link';
import { Search, MapPin, Home, Filter, Star, AlertCircle } from 'lucide-react';

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
    queryFn: () => api.get('/kos', { params: { ...filters, search: filters.search || undefined } }).then(res => res.data),
    retry: 2,
  });

  const kosData = data?.data || [];
  const totalCount = data?.meta?.total || 0;

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-[#011E55] to-[#0a2d6e] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cari Kos</h1>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="Cari nama kos atau lokasi…"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full h-12 pl-12 pr-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#011E55]/30"
                aria-label="Cari berdasarkan nama kos atau lokasi"
              />
            </div>
            
            <select
              id="type"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-4 py-2 h-12 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#011E55]/30"
              aria-label="Filter berdasarkan tipe kost"
            >
              <option value="">Semua Tipe</option>
              <option value="putra">Putra</option>
              <option value="putri">Putri</option>
              <option value="campur">Campur</option>
            </select>

            <input
              id="min_price"
              type="number"
              placeholder="Min Harga"
              value={filters.min_price || ''}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              className="w-32 px-4 py-2 h-12 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#011E55]/30"
              aria-label="Filter harga minimum"
            />

            <input
              id="max_price"
              type="number"
              placeholder="Max Harga"
              value={filters.max_price || ''}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              className="w-32 px-4 py-2 h-12 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#011E55]/30"
              aria-label="Filter harga maksimum"
            />

            <select
              id="min_rating"
              value={filters.min_rating ? String(filters.min_rating) : ''}
              onChange={(e) => handleFilterChange('min_rating', e.target.value)}
              className="px-4 py-2 h-12 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#011E55]/30"
              aria-label="Filter berdasarkan rating minimum"
            >
              <option value="">Semua Rating</option>
              <option value="4">4+ Bintang</option>
              <option value="3">3+ Bintang</option>
              <option value="2">2+ Bintang</option>
            </select>

            <button
              onClick={handleSearch}
              className="h-12 bg-[#ECECEC] text-[#011E55] px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cari
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Gagal Memuat Data</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Terjadi kesalahan saat memuat data kost. Silakan coba lagi.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-[#011E55] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0a2d6e] transition-all hover:shadow-lg"
            >
              Coba Lagi
            </button>
          </div>
        ) : kosData.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Search className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Kost Tidak Ditemukan</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Tidak ada kost yang sesuai dengan filter pencarianmu. Coba ubah kata kunci atau filter.
            </p>
            <button
              onClick={() => setFilters({ page: 1, limit: 12, search: '', type: '', min_price: undefined, max_price: undefined, min_rating: undefined })}
              className="inline-block bg-[#011E55] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0a2d6e] transition-all hover:shadow-lg"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Ditemukan {totalCount} kos
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {kosData.map((kos: Kos) => (
                <Link key={kos.id} href={`/kos/${kos.id}`} className="group">
                  <ResultCard
                    id={kos.id}
                    category={kos.kos_type}
                    location={kos.location?.district || kos.address}
                    nameKos={kos.name}
                    facility={kos.facilities?.map(f => f.name) || []}
                    price={kos.price}
                    slotRoom={kos.available_rooms}
                    rating={kos.rating}
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
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${
                      filters.page === i + 1
                        ? 'bg-[#011E55] text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
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
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#011E55]"></div></div>}>
      <SearchContent />
    </Suspense>
  );
}
