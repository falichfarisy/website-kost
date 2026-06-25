'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Kos } from '@/lib/types';
import ResultCard from '@/app/components/ResultCard';
import { Heart, Search } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Kos[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (kosId: number) => {
    setRemoving(kosId);
    try {
      await api.delete(`/favorites/${kosId}`);
      setFavorites(prev => prev.filter(k => k.id !== kosId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-[#011E55] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            Favorit Saya
          </h1>
          <p className="mt-2 text-white/80">Kost yang telah kamu simpan</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#011E55]"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Favorit</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Kamu belum menyimpan kost apapun. Yuk, cari kost favoritmu sekarang!
            </p>
            <Link 
              href="/search"
              className="inline-block bg-[#011E55] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0a2d6e] transition-all hover:shadow-lg"
            >
              Cari Kost Sekarang
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 font-medium">{favorites.length} kost favorit</p>
              <Link href="/search" className="text-[#011E55] font-medium hover:underline">
                + Tambah lagi
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((kos) => (
                <div key={kos.id} className="relative group">
                  <Link href={`/kos/${kos.id}`}>
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFavorite(kos.id);
                    }}
                    disabled={removing === kos.id}
                    className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-md hover:bg-red-50 transition-all disabled:opacity-50"
                    title="Hapus dari favorit"
                  >
                    {removing === kos.id ? (
                      <div className="animate-spin w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full"></div>
                    ) : (
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
