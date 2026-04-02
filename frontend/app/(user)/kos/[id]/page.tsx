'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Kos, Review, Facility } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import { useChatStore } from '@/lib/chat-store';
import { Heart, Star, MapPin, MessageCircle, CheckCircle, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function KosDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const { isAuthenticated, logout } = useAuthStore();
  const { openChat } = useChatStore();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                  {kos.images?.[currentImageIndex] ? (
                    <img 
                      src={kos.images[currentImageIndex].url} 
                      alt={kos.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Tidak ada gambar
                    </div>
                  )}
                </div>
                
                {kos.images && kos.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : kos.images.length - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev < kos.images.length - 1 ? prev + 1 : 0)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {kos.images.map((_: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1.5 bg-[#011E55] text-white text-sm font-medium rounded-lg">
                    {kos.kos_type === 'putra' ? 'Putra' : kos.kos_type === 'putri' ? 'Putri' : 'Campur'}
                  </span>
                  {kos.available_rooms <= 3 && (
                    <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg animate-pulse">
                      {kos.available_rooms} kamar tersisa!
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{kos.name}</h1>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{kos.address}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{kos.rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-gray-400">({kos.review_count || 0} ulasan)</span>
                      </div>
                    </div>
                  </div>
                  
                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        favoriteMutation.mutate();
                        setIsFavorited(!isFavorited);
                      }}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        isFavorited 
                          ? 'border-red-500 bg-red-50 text-red-500' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Fasilitas</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {kos.facilities?.map((facility: Facility) => (
                  <div key={facility.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-xl font-bold mb-4">Lokasi</h2>
              <div ref={mapRef} className="h-64 rounded-lg" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Ulasan ({kos.review_count || 0})
                </h2>
                {isAuthenticated && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="text-[#011E55] dark:text-blue-400 font-medium text-sm hover:underline"
                  >
                    Tulis Ulasan
                  </button>
                )}
              </div>

              {showReviewForm && (
                <div className="mb-6 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`w-6 h-6 ${star <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-colors`} 
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Bagikan pengalamanmu tentang kost ini..."
                    className="w-full mb-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#011E55] dark:text-white"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => reviewMutation.mutate(newReview)}
                      disabled={reviewMutation.isPending || !newReview.comment.trim()}
                      className="bg-[#011E55] text-white px-5 py-2.5 rounded-xl font-medium disabled:opacity-50 hover:bg-[#0a2d6e] transition-colors"
                    >
                      {reviewMutation.isPending ? 'Mengirim...' : 'Kirim Ulasan'}
                    </button>
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {reviews?.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada ulasan. Jadilah yang pertama!</p>
                  </div>
                )}
                {reviews?.map((review: Review) => (
                  <div key={review.id} className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#011E55] rounded-full flex items-center justify-center text-white font-semibold">
                        {(review.user?.name || 'A')[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {review.user?.name || 'Anonim'}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                          {new Date(review.created_at).toLocaleDateString('id-ID', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-4">
              <div className="text-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Harga per bulan</p>
                <p className="text-3xl font-bold text-[#011E55] dark:text-white mt-1">
                  Rp {kos.price?.toLocaleString('id-ID') || 0}
                  <span className="text-base font-normal text-gray-400">/bulan</span>
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Tipe Kost</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{kos.kos_type}</span>
                </div>
                {kos.area && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Luas Kamar</span>
                    <span className="font-medium text-gray-900 dark:text-white">{kos.area} m²</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Kapasitas</span>
                  <span className="font-medium text-gray-900 dark:text-white">{kos.capacity} orang/kamar</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Kamar Tersedia</span>
                  <span className={`font-medium ${kos.available_rooms <= 3 ? 'text-red-500' : 'text-green-500'}`}>
                    {kos.available_rooms} kamar
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => openChat(kos.id, kos.name)}
                  className="w-full bg-gradient-to-r from-[#011E55] to-[#0a2d6e] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#011E55]/25 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat Pemilik
                </button>
                <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  <Share2 className="w-5 h-5" />
                  Bagikan
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
                  💡 Langsung chat pemilik untuk tanya jadwal visit atau negotiate harga!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
