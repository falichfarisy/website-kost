"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface Kos {
  id: number;
  name: string;
  kos_type: string;
  address: string;
  location?: { district: string };
  facilities?: { name: string }[];
  price: number;
  available_rooms: number;
  rating?: number;
}

interface ResultCardProps {
  kos: Kos;
}

export function ResultCard({ kos }: ResultCardProps) {
  const upperLocation = (kos.location?.district || kos.address).toUpperCase();
  const priceNominal = "Rp" + kos.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const facilityNames = kos.facilities?.map(f => f.name) || [];

  const categoryColors: Record<string, string> = {
    putra: "bg-blue-100 text-blue-700",
    putri: "bg-pink-100 text-pink-700",
    campuran: "bg-purple-100 text-purple-700",
  };

  const categoryLabels: Record<string, string> = {
    putra: "Putra",
    putri: "Putri",
    campuran: "Campur",
  };

  return (
    <Link href={`/kos/${kos.id}`} className="block group h-full">
      <div className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 group-hover:-translate-y-2 h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-[#011E55] to-[#0a2d6e] overflow-hidden">
          <Image
            src="/sample-bedroom.svg"
            alt={kos.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
          <div className="absolute top-4 left-4">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${categoryColors[kos.kos_type]}`}>
              {categoryLabels[kos.kos_type] || kos.kos_type}
            </span>
          </div>
          {kos.available_rooms <= 3 && kos.available_rooms > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
              Tersisa {kos.available_rooms}
            </div>
          )}
        </div>
       
        <div className="p-5 space-y-4 flex-1 flex flex-col">
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-bold mb-1 truncate tracking-wider">{upperLocation}</p>
            <h3 className="text-lg font-extrabold text-gray-900 line-clamp-2 group-hover:text-[#011E55] transition-colors leading-tight">
              {kos.name}
            </h3>
          </div>
         
          <div className="flex flex-wrap gap-1.5">
            {facilityNames.slice(0, 3).map((fas, index) => (
              <span key={index} className="text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg font-medium">
                {fas}
              </span>
            ))}
            {facilityNames.length > 3 && (
              <span className="text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg font-medium">
                +{facilityNames.length - 3}
              </span>
            )}
          </div>
         
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div>
              <span className="text-xl font-extrabold text-[#011E55]">{priceNominal}</span>
              <span className="text-xs text-gray-500 font-medium ml-1">/bln</span>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1.5 rounded-xl">
              <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20" aria-label="Rating">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.359a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-sm text-gray-900">{(kos.rating || 0).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface SearchResultsProps {
  kosData: Kos[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function SearchResults({
  kosData,
  isLoading,
  error,
  totalCount,
  totalPages,
  currentPage,
  onPageChange
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div data-testid="skeleton-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    );
  }

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

  if (kosData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700 p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Tidak Ada Hasil</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
          Kami tidak menemukan kos yang cocok dengan kriteria filtermu. Coba kurangi filter untuk melihat lebih banyak opsi.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {kosData.map((kos) => (
          <ResultCard key={kos.id} kos={kos} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
         
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
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
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      currentPage === page
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
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}