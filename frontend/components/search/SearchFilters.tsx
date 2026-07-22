"use client";

import { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, X, Search, Star, MapPin, Tag, ChevronLeft, ChevronRight } from "lucide-react";

export interface SearchFiltersProps {
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onSearch: () => void;
  onClearFilters: () => void;
  isLoading?: boolean;
  totalCount?: number;
  error?: string | null;
  totalPages?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

const KOS_TYPES = ["Semua Tipe", "Putra", "Putri", "Campur"];
const KECAMATANS = [
  "Semua Kecamatan", "Andir", "Antapani", "Arcamanik", "Astana Anyar", "Babakan Ciparay",
  "Bandung Kidul", "Bandung Kulon", "Bandung Wetan", "Batununggal", "Bojongloa Kaler",
  "Bojongloa Kidul", "Buah Batu", "Cibeunying Kaler", "Cibeunying Kidul", "Cibiru",
  "Cicendo", "Cidadap", "Cinambo", "Coblong", "Gedebage", "Kiaracondong", "Lengkong",
  "Mandalajati", "Panyileukan", "Rancasari", "Regol", "Sukajadi", "Sukasari", "Sumur Bandung",
  "Ujung Berung"
];

const RATINGS = [5, 4, 3, 2, 1];

const priceRanges = [
  { label: "Semua Harga", min: undefined, max: undefined },
  { label: "< 1.000.000", min: 0, max: 1000000 },
  { label: "1.000.000 - 2.000.000", min: 1000000, max: 2000000 },
  { label: "2.000.000 - 3.000.000", min: 2000000, max: 3000000 },
  { label: "3.000.000 - 5.000.000", min: 3000000, max: 5000000 },
  { label: "> 5.000.000", min: 5000000, max: undefined },
];

const facilities = [
  "WiFi", "AC", "Kamar Mandi Dalam", "Kasur", "Meja Belajar", "Lemari",
  "Kulkas", "TV", "Water Heater", "Dapur", "Mesin Cuci", "Parkir Motor",
  "Parkir Mobil", "Laundry", "Security 24 Jam", "CCTV", "Lift", "Gym",
  "Kolam Renang", "Ruang Tamu", "Balkon"
];

export function SearchFilters({
  filters,
  onFilterChange,
  onSearch,
  onClearFilters,
  isLoading,
  totalCount,
  error,
  totalPages,
  currentPage,
  onPageChange
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    type: true,
    location: true,
    price: true,
    rating: true,
    facilities: false,
  });

  const handleFilterChange = useCallback((key: string, value: any) => {
    onFilterChange(key, value);
  }, [onFilterChange]);

  const handlePriceSelect = useCallback((min: number | undefined, max: number | undefined) => {
    onFilterChange('price_min', min);
    onFilterChange('price_max', max);
  }, [onFilterChange]);

  const handleFacilityToggle = useCallback((facility: string) => {
    const current = filters.facilities || [];
    const updated = current.includes(facility)
      ? current.filter((f: string) => f !== facility)
      : [...current, facility];
    handleFilterChange('facilities', updated);
  }, [filters.facilities, handleFilterChange]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const hasActiveFilters = filters.search || filters.type || filters.kecamatan ||
    filters.price_min || filters.price_max || filters.min_rating ||
    (filters.facilities && filters.facilities.length > 0);

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-red-100 dark:border-red-900/30 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center rotate-12">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
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
    );
  }

  return (
    <div className="lg:w-80 flex-shrink-0">
      <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-6 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Filter Pencarian</h3>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Hapus Semua
            </button>
          )}
        </div>

        {totalCount && !isLoading && !error && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Ditemukan <span className="font-extrabold">{totalCount}</span> kos
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Tipe Kos */}
          <FilterSection
            title="Tipe Kos"
            icon={<Tag className="w-5 h-5" />}
            expanded={expandedSections.type}
            onToggle={() => toggleSection('type')}
          >
            <div className="space-y-2">
              {KOS_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    className="w-4 h-4 text-[#011E55] border-gray-300 focus:ring-[#011E55] focus:ring-2"
                    checked={filters.type === (type === "Semua Tipe" ? undefined : type)}
                    onChange={() => handleFilterChange('type', type === "Semua Tipe" ? undefined : type)}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#011E55] transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Lokasi */}
          <FilterSection
            title="Lokasi"
            icon={<MapPin className="w-5 h-5" />}
            expanded={expandedSections.location}
            onToggle={() => toggleSection('location')}
          >
            <div className="relative">
              <select
                value={filters.kecamatan || "Semua Kecamatan"}
                onChange={(e) => handleFilterChange('kecamatan', e.target.value === "Semua Kecamatan" ? undefined : e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#011E55] focus:border-transparent appearance-none cursor-pointer"
              >
                {KECAMATANS.map((kecamatan) => (
                  <option key={kecamatan} value={kecamatan}>{kecamatan}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </FilterSection>

          {/* Harga */}
          <FilterSection
            title="Harga Bulanan"
            icon={<Search className="w-5 h-5" />}
            expanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="price"
                    className="w-4 h-4 text-[#011E55] border-gray-300 focus:ring-[#011E55] focus:ring-2"
                    checked={filters.price_min === range.min && filters.price_max === range.max}
                    onChange={() => handlePriceSelect(range.min, range.max)}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#011E55] transition-colors">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection
            title="Rating Minimum"
            icon={<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
            expanded={expandedSections.rating}
            onToggle={() => toggleSection('rating')}
          >
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  className="w-4 h-4 text-[#011E55] border-gray-300 focus:ring-[#011E55] focus:ring-2"
                  checked={!filters.min_rating}
                  onChange={() => handleFilterChange('min_rating', undefined)}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#011E55] transition-colors flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gray-300 dark:fill-gray-600 text-gray-300 dark:text-gray-600" />
                  Semua Rating
                </span>
              </label>
              {RATINGS.map((rating) => (
                <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="rating"
                    className="w-4 h-4 text-[#011E55] border-gray-300 focus:ring-[#011E55] focus:ring-2"
                    checked={filters.min_rating === rating}
                    onChange={() => handleFilterChange('min_rating', rating)}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#011E55] transition-colors flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{rating} Bintang ke atas</span>
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Fasilitas */}
          <FilterSection
            title="Fasilitas"
            icon={<Star className="w-5 h-5" />}
            expanded={expandedSections.facilities}
            onToggle={() => toggleSection('facilities')}
          >
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {facilities.map((facility) => (
                <label key={facility} className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#011E55] border-gray-300 rounded focus:ring-[#011E55] focus:ring-2"
                    checked={filters.facilities?.includes(facility) || false}
                    onChange={() => handleFacilityToggle(facility)}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#011E55] transition-colors">
                    {facility}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onSearch}
            disabled={isLoading}
            className="w-full h-12 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Mencari..." : "Terapkan Filter"}
          </button>
        </div>

        {totalPages && totalPages > 1 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={currentPage || 1}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSection({ title, icon, children, expanded, onToggle }: any) {
  return (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">{icon}</span>
          <h4 className="font-bold text-gray-900 dark:text-white text-base">{title}</h4>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {expanded && <div className="mt-4 animate-slide-down">{children}</div>}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: any) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex gap-1">
        {pages.map((page, i) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
              currentPage === page
                ? 'bg-[#011E55] text-white shadow-md scale-110'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}