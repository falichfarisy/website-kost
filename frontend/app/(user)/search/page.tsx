'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Kos, KosFilters } from '@/lib/types';
import ResultCard from '@/app/components/ResultCard';
import Link from 'next/link';
import { Search, MapPin, Home, Filter, Star } from 'lucide-react';

const MOCK_KOS_DATA: Kos[] = [
  {
    id: 1,
    name: 'Kost Melati Premium',
    address: 'Jl. Melati No. 123, Yogyakarta',
    kos_type: 'putra',
    price: 1500000,
    price_type: 'bulan',
    area: '25m²',
    capacity: 1,
    available_rooms: 5,
    latitude: -7.797068,
    longitude: 110.361528,
    location: { district: 'Kotabaru' },
    facilities: [
      { id: 1, name: 'WiFi', category: 'internet' },
      { id: 2, name: 'AC', category: 'ac' },
      { id: 3, name: 'Kamar Mandi Dalam', category: 'kamar_mandi' },
    ],
    images: [],
    rating: 4.5,
    reviews_count: 23,
  },
  {
    id: 2,
    name: 'Kost Orchid Indah',
    address: 'Jl. Orchid No. 45, Yogyakarta',
    kos_type: 'putri',
    price: 1200000,
    price_type: 'bulan',
    area: '20m²',
    capacity: 1,
    available_rooms: 8,
    latitude: -7.782168,
    longitude: 110.352628,
    location: { district: 'Banguntapan' },
    facilities: [
      { id: 1, name: 'WiFi', category: 'internet' },
      { id: 2, name: 'Kamar Mandi Dalam', category: 'kamar_mandi' },
      { id: 3, name: 'Parkir Motor', category: 'parkir' },
    ],
    images: [],
    rating: 4.2,
    reviews_count: 15,
  },
  {
    id: 3,
    name: 'Kost Senja Utama',
    address: 'Jl. Senja No. 78, Yogyakarta',
    kos_type: 'campur',
    price: 900000,
    price_type: 'bulan',
    area: '18m²',
    capacity: 1,
    available_rooms: 12,
    latitude: -7.812068,
    longitude: 110.371528,
    location: { district: 'Sleman' },
    facilities: [
      { id: 1, name: 'WiFi', category: 'internet' },
      { id: 2, name: 'Dapur', category: 'dapur' },
    ],
    images: [],
    rating: 4.0,
    reviews_count: 8,
  },
  {
    id: 4,
    name: 'Kost Emerald Exclusive',
    address: 'Jl. Emerald No. 9, Yogyakarta',
    kos_type: 'putra',
    price: 2000000,
    price_type: 'bulan',
    area: '30m²',
    capacity: 2,
    available_rooms: 3,
    latitude: -7.775068,
    longitude: 110.365528,
    location: { district: 'Condongcatur' },
    facilities: [
      { id: 1, name: 'WiFi', category: 'internet' },
      { id: 2, name: 'AC', category: 'ac' },
      { id: 3, name: 'Kamar Mandi Dalam', category: 'kamar_mandi' },
      { id: 4, name: 'Kulkas', category: 'elektronik' },
      { id: 5, name: 'TV', category: 'elektronik' },
    ],
    images: [],
    rating: 4.8,
    reviews_count: 42,
  },
  {
    id: 5,
    name: 'Kost Sakura Residence',
    address: 'Jl. Sakura No. 33, Yogyakarta',
    kos_type: 'putri',
    price: 1800000,
    price_type: 'bulan',
    area: '28m²',
    capacity: 1,
    available_rooms: 6,
    latitude: -7.785068,
    longitude: 110.345528,
    location: { district: 'Gedong' },
    facilities: [
      { id: 1, name: 'WiFi', category: 'internet' },
      { id: 2, name: 'AC', category: 'ac' },
      { id: 3, name: 'Kamar Mandi Dalam', category: 'kamar_mandi' },
      { id: 4, name: 'Mesin Cuci', category: 'dapur' },
    ],
    images: [],
    rating: 4.6,
    reviews_count: 31,
  },
  {
    id: 6,
    name: 'Kost Victory Modern',
    address: 'Jl. Victory No. 12, Yogyakarta',
    kos_type: 'putra',
    price: 1100000,
    price_type: 'bulan',
    area: '22m²',
    capacity: 1,
    available_rooms: 10,
    latitude: -7.790068,
    longitude: 110.355528,
    location: { district: 'Wirobrajan' },
    facilities: [
      { id: 1, name: 'WiFi', category: 'internet' },
      { id: 2, name: 'Kamar Mandi Dalam', category: 'kamar_mandi' },
      { id: 3, name: 'Parkir Motor', category: 'parkir' },
    ],
    images: [],
    rating: 4.1,
    reviews_count: 19,
  },
  {
    id: 7,
    name: 'Kost Harmony Village',
    address: 'Jl. Harmony No. 56, Yogyakarta',
    kos_type: 'campur',
    price: 750000,
    price_type: 'bulan',
    area: '16m²',
    capacity: 1,
    available_rooms: 15,
    latitude: -7.805068,
    longitude: 110.375528,
    location: { district: 'Tirunaggal' },
    facilities: [
      { id: 1, name: 'WiFi', category: 'internet' },
      { id: 2, name: 'Dapur', category: 'dapur' },
      { id: 3, name: 'Parkir Motor', category: 'parkir' },
    ],
    images: [],
    rating: 3.8,
    reviews_count: 12,
  },
  {
    id: 8,
    name: 'Kost Blue Pearl',
    address: 'Jl. Blue Pearl No. 88, Yogyakarta',
    kos_type: 'putri',
    price: 1600000,
    price_type: 'bulan',
    area: '26m²',
    capacity: 1,
    available_rooms: 4,
    latitude: -7.778068,
    longitude: 110.360528,
    location: { district: 'Ngaglik' },
    facilities: [
      { id: 1, name: 'WiFi', category: 'internet' },
      { id: 2, name: 'AC', category: 'ac' },
      { id: 3, name: 'Kamar Mandi Dalam', category: 'kamar_mandi' },
      { id: 4, name: 'Security', category: 'keamanan' },
    ],
    images: [],
    rating: 4.4,
    reviews_count: 27,
  },
];

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
    retry: false,
  });

  const kosData = data?.data || MOCK_KOS_DATA;
  const totalCount = data?.meta?.total || MOCK_KOS_DATA.length;
  const isUsingMock = !data?.data;

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
              id="search"
              type="text"
              placeholder="Cari nama kos atau lokasi…"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 text-gray-800 rounded-lg"
              aria-label="Cari berdasarkan nama kos atau lokasi"
            />
            
            <select
              id="type"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-4 py-2 text-gray-800 rounded-lg"
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
              className="w-32 px-4 py-2 text-gray-800 rounded-lg"
              aria-label="Filter harga minimum"
            />

            <input
              id="max_price"
              type="number"
              placeholder="Max Harga"
              value={filters.max_price || ''}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              className="w-32 px-4 py-2 text-gray-800 rounded-lg"
              aria-label="Filter harga maksimum"
            />

            <select
              id="min_rating"
              value={filters.min_rating ? String(filters.min_rating) : ''}
              onChange={(e) => handleFilterChange('min_rating', e.target.value)}
              className="px-4 py-2 text-gray-800 rounded-lg"
              aria-label="Filter berdasarkan rating minimum"
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
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                Ditemukan {totalCount} kos
              </p>
              {isUsingMock && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Data dummy (mode development)
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {kosData.map((kos: Kos) => (
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

            {isUsingMock && (
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Mode Development:</strong> Menampilkan data dummy karena backend tidak tersedia.
                  Untuk production, pastikan backend running di port yang benar.
                </p>
              </div>
            )}

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
