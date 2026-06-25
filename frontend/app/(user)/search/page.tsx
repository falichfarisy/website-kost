'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Kos, KosFilters } from '@/lib/types';
import ResultCard from '@/app/components/ResultCard';
import Link from 'next/link';
import { Search, AlertCircle, ChevronLeft, ChevronRight, SlidersHorizontal, MapPin, Building2, Star } from 'lucide-react';
import { categories } from '@/lib/data';

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
  const totalPages = data?.meta?.totalPages || 1;

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

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12, search: '', type: '', min_price: undefined, max_price: undefined, min_rating: undefined });
    router.push('/search');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#011E55] via-[#0a2d6e] to-[#1a4a8a] text-white pt-12 pb-24 px-4">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Eksplorasi Kos</h1>
          <p className="text-white/80 text-lg max-w-2xl mb-10">Temukan hunian yang pas dengan kebutuhan dan budgetmu dari ribuan pilihan kos terverifikasi.</p>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 max-w-4xl shadow-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="Lokasi, nama kos, atau kampus..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-14 pl-12 pr-4 bg-white rounded-xl md:rounded-l-full md:rounded-r-none text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full h-14 px-4 bg-white rounded-xl md:rounded-none text-gray-900 border-l border-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none font-medium cursor-pointer"
              >
                <option value="">Semua Tipe</option>
                <option value="putra">Putra</option>
                <option value="putri">Putri</option>
                <option value="campuran">Campuran</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="h-14 bg-yellow-400 hover:bg-yellow-300 text-[#011E55] px-8 rounded-xl md:rounded-r-full font-bold transition-colors shadow-md"
            >
              Cari Kost
            </button>
          </div>
          
          <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-white/60 text-sm font-medium whitespace-nowrap mr-2">Quick Filter:</span>
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  handleFilterChange('type', cat.id === filters.type ? '' : cat.id);
                  handleSearch();
                }}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  filters.type === cat.id 
                    ? 'bg-yellow-400 text-[#011E55] shadow-lg scale-105' 
                    : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-extrabold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                  <SlidersHorizontal className="w-5 h-5 text-[#011E55] dark:text-blue-400" />
                  Filter Detail
                </h2>
                {(filters.min_price || filters.max_price || filters.min_rating) && (
                  <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-600">
                    Reset
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-gray-200 mb-3">Range Harga</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp</span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.min_price || ''}
                          onChange={(e) => handleFilterChange('min_price', e.target.value)}
                          className="w-full h-12 pl-8 pr-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-[#011E55]/30 focus:border-transparent transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.max_price || ''}
                          onChange={(e) => handleFilterChange('max_price', e.target.value)}
                          className="w-full h-12 pl-8 pr-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-[#011E55]/30 focus:border-transparent transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-gray-200 mb-3">Rating Minimum</label>
                  <div className="space-y-2">
                    {[4, 3, 2].map(rating => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          filters.min_rating === rating 
                            ? 'bg-[#011E55] border-[#011E55]' 
                            : 'border-gray-300 dark:border-gray-600 group-hover:border-[#011E55]'
                        }`}>
                          {filters.min_rating === rating && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <input 
                          type="radio" 
                          name="rating" 
                          className="hidden"
                          checked={filters.min_rating === rating}
                          onChange={() => handleFilterChange('min_rating', rating)}
                        />
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating} Bintang ke atas</span>
                        </div>
                      </label>
                    ))}
                    <label className="flex items-center gap-3 cursor-pointer group pt-1">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        !filters.min_rating 
                          ? 'bg-gray-200 dark:bg-gray-700 border-transparent' 
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'
                      }`}>
                        {!filters.min_rating && (
                          <svg className="w-3 h-3 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input 
                        type="radio" 
                        name="rating" 
                        className="hidden"
                        checked={!filters.min_rating}
                        onChange={() => handleFilterChange('min_rating', undefined)}
                      />
                      <span className="text-sm font-medium text-gray-500">Semua Rating</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full h-12 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white rounded-xl font-bold transition-all shadow-md mt-4"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 mt-8 lg:mt-0">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Hasil Pencarian</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                  {!isLoading && !error && `Menampilkan ${totalCount} kos pilihan`}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm animate-pulse h-[380px] flex flex-col">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full" />
                    <div className="p-5 space-y-4 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="flex gap-2 pt-2">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-red-100 dark:border-red-900/30 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center rotate-12">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Gagal Memuat Data</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                  Terjadi masalah koneksi saat mengambil data dari server. Silakan coba beberapa saat lagi.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  Muat Ulang
                </button>
              </div>
            ) : kosData.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Search className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Tidak Ada Hasil</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                  Kami tidak menemukan kos yang cocok dengan kriteria filtermu. Coba kurangi filter untuk melihat lebih banyak opsi.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Hapus Semua Filter
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {kosData.map((kos: Kos) => (
                    <ResultCard
                      key={kos.id}
                      id={kos.id}
                      category={kos.kos_type}
                      location={kos.location?.district || kos.address}
                      nameKos={kos.name}
                      facility={kos.facilities?.map(f => f.name) || []}
                      price={kos.price}
                      slotRoom={kos.available_rooms}
                      rating={kos.rating}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => (filters.page || 1) > 1 && handleFilterChange('page', (filters.page || 1) - 1)}
                      disabled={(filters.page || 1) === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => page === 1 || page === totalPages || Math.abs(page - (filters.page || 1)) <= 1)
                        .map((page, i, arr) => {
                          if (i > 0 && arr[i - 1] !== page - 1) {
                            return (
                              <div key={`ellipsis-${page}`} className="flex items-end px-1 text-gray-400">
                                ...
                              </div>
                            );
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => handleFilterChange('page', page)}
                              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                                (filters.page || 1) === page
                                  ? 'bg-[#011E55] text-white shadow-md scale-110'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                    </div>
                    
                    <button
                      onClick={() => (filters.page || 1) < totalPages && handleFilterChange('page', (filters.page || 1) + 1)}
                      disabled={(filters.page || 1) === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-[#011E55] rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Menyiapkan halaman...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
