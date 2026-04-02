export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
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
  area?: number;
  capacity: number;
  available_rooms: number;
  rating: number;
  review_count: number;
  source: 'manual' | 'scraped';
  location_id?: number;
  location?: Location;
  facilities?: Facility[];
  images?: KosImage[];
}

export interface Facility {
  id: number;
  name: string;
  icon?: string;
}

export interface KosImage {
  id: number;
  kos_id: number;
  url: string;
  is_primary: boolean;
}

export interface Location {
  id: number;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
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
