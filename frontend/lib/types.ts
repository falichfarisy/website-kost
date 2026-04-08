export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin' | 'owner';
}

export interface Kos {
  id: number;
  name: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  kos_type: 'putra' | 'putri' | 'campur';
  price: number;
  price_type: string;
  area?: number | string;
  capacity: number;
  available_rooms: number;
  rating: number;
  review_count?: number;
  reviews_count?: number;
  source?: 'manual' | 'scraped';
  location_id?: number;
  location?: Location;
  facilities?: Facility[];
  images?: KosImage[];
}

export interface Facility {
  id: number;
  name: string;
  icon?: string;
  category?: string;
}

export interface Location {
  id?: number;
  province?: string;
  city?: string;
  district: string;
  subdistrict?: string;
}

export interface KosImage {
  id: number;
  kos_id: number;
  url: string;
  is_primary: boolean;
}

export interface Location {
  id?: number;
  province?: string;
  city?: string;
  district: string;
  subdistrict?: string;
}

export interface Review {
  id: number;
  kos_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  user?: User;
}

export interface KosFilters {
  page?: number;
  limit?: number;
  min_price?: number;
  max_price?: number;
  type?: string;
  facility?: string;
  min_rating?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired' | 'completed';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

export interface Booking {
  id: number;
  kos_id: number;
  tenant_name: string;
  tenant_email: string;
  tenant_phone: string;
  tenant_notes?: string;
  check_in_date: string;
  duration_months: number;
  status: BookingStatus;
  rejection_reason?: string;
  monthly_price: number;
  total_price: number;
  deposit_amount: number;
  payment_status: PaymentStatus;
  expires_at: string;
  created_at: string;
  kos?: Kos;
}

export interface CreateBookingRequest {
  kos_id: number;
  tenant_name: string;
  tenant_email: string;
  tenant_phone: string;
  tenant_notes?: string;
  check_in_date: string;
  duration_months: number;
  monthly_price: number;
}

export interface Notification {
  id: number;
  user_id: number;
  type: 'booking_request' | 'booking_approved' | 'booking_rejected' | 'booking_cancelled' | 'booking_expired' | 'reminder';
  title: string;
  message: string;
  booking_id?: number;
  kos_id?: number;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  kos?: Kos;
  booking?: Booking;
}
