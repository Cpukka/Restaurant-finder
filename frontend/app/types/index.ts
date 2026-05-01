export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'vendor' | 'user';
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    restaurant_id: number;
    category_id: number;
  };
}

export interface Review {
  id: number;
  user_id: number;
  restaurant_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Restaurant {
  id: number;
  user_id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  image: string | null;
  created_at: string;
  updated_at: string;
  owner?: User;
  categories?: Category[];
  reviews?: Review[];
  average_rating?: number;
  reviews_count?: number;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Filters {
  page?: number;
  search?: string;
  city?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  per_page?: number;
}