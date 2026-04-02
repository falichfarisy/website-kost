'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Kos, Review, Facility } from '@/lib/types';
import { useAuthStore } from '@/lib/store';

export default function KosDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const { isAuthenticated, logout } = useAuthStore();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const { data: kos, isLoading: kosLoading } = useQuery({
    queryKey: ['kos', params.id],
    queryFn: () => api.get(`/kos/${params.id}`).then(res => res.data.data),
    enabled: !!params.id,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', params.id],
    queryFn: () => api.get(`/kos/${params.id}/reviews`).then(res => res.data.data),
    enabled: !!params.id,
  });

  const favoriteMutation = useMutation({
    mutationFn: () => api.post(`/favorites/${params.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kos', params.id] });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (data: { rating: number; comment: string }) => 
      api.post(`/reviews/${params.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', params.id] });
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '' });
    },
  });

  useEffect(() => {
    if (!kos?.latitude || !kos?.longitude || !mapRef.current || mapInstanceRef.current) return;

    const initMap = () => {
      if (!window.google || !window.google.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google && window.google.maps) {
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current!, {
              center: { lat: kos.latitude, lng: kos.longitude },
              zoom: 15,
            });
            new window.google.maps.Marker({
              position: { lat: kos.latitude, lng: kos.longitude },
              map: mapInstanceRef.current,
              title: kos.name,
            });
          }
        };
        document.head.appendChild(script);
      } else {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current!, {
          center: { lat: kos.latitude, lng: kos.longitude },
          zoom: 15,
        });
        new window.google.maps.Marker({
          position: { lat: kos.latitude, lng: kos.longitude },
          map: mapInstanceRef.current,
          title: kos.name,
        });
      }
    };

    initMap();
  }, [kos?.latitude, kos?.longitude]);

  if (kosLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!kos) {
    return <div className="min-h-screen flex items-center justify-center">Kos tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {kos.images?.[0] ? (
                  <img src={kos.images[0].url} alt={kos.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Tidak ada gambar
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-3 py-1 border border-gray-300 rounded-xl text-sm">
                    {kos.kos_type === 'putra' ? 'Kost Putra' : kos.kos_type === 'putri' ? 'Kost Putri' : 'Kost Campur'}
                  </span>
                  <h1 className="text-2xl font-bold mt-2">{kos.name}</h1>
                  <p className="text-gray-600 mt-1">{kos.address}</p>
                </div>
                
                {isAuthenticated && (
                  <button
                    onClick={() => favoriteMutation.mutate()}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                  >
                    ❤️ Favorit
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-xl font-bold mb-4">Fasilitas</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {kos.facilities?.map((facility: Facility) => (
                  <div key={facility.id} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-xl font-bold mb-4">Lokasi</h2>
              <div ref={mapRef} className="h-64 rounded-lg" />
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Ulasan ({kos.review_count})</h2>
                {isAuthenticated && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="text-[#011E55] font-medium"
                  >
                    Tulis Ulasan
                  </button>
                )}
              </div>

              {showReviewForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full mb-2 px-3 py-2 border rounded-lg"
                  >
                    <option value="5">5 Bintang</option>
                    <option value="4">4 Bintang</option>
                    <option value="3">3 Bintang</option>
                    <option value="2">2 Bintang</option>
                    <option value="1">1 Bintang</option>
                  </select>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tulis ulasan..."
                    className="w-full mb-2 px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => reviewMutation.mutate(newReview)}
                      disabled={reviewMutation.isPending}
                      className="bg-[#011E55] text-white px-4 py-2 rounded-lg"
                    >
                      {reviewMutation.isPending ? 'Mengirim...' : 'Kirim'}
                    </button>
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {reviews?.map((review: Review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user?.name || 'Anonim'}</span>
                      <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{review.comment}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(review.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-4 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Informasi</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Harga</span>
                  <span className="font-bold text-xl">Rp {kos.price.toLocaleString('id-ID')}/bulan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipe</span>
                  <span>{kos.kos_type}</span>
                </div>
                {kos.area && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Luas</span>
                    <span>{kos.area} m²</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Kapasitas</span>
                  <span>{kos.capacity} orang/kamar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kamar Tersedia</span>
                  <span className={kos.available_rooms <= 3 ? 'text-red-500 font-medium' : ''}>
                    {kos.available_rooms} kamar
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="text-yellow-500">★ {kos.rating.toFixed(1)} ({kos.review_count} ulasan)</span>
                </div>
              </div>
              
              <button className="w-full bg-[#011E55] text-white py-3 rounded-lg mt-4 hover:bg-[#0a2d6e]">
                Hubungi Penyedia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
