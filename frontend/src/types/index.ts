/**
 * TypeScript Types
 * Copy to: frontend/src/types/index.ts
 */

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'FARMER' | 'CUSTOMER' | 'DELIVERY' | 'ADMIN';
  phone: string;
  is_verified: boolean;
  is_active: boolean;
  preferred_language: 'ta' | 'en';
  profile_pic?: string;
  date_joined: string;
}

export interface FarmerProfile {
  id: number;
  user: number;
  farm_name: string;
  farm_address: string;
  latitude?: number;
  longitude?: number;
  farm_size: number;
  farming_type: 'ORGANIC' | 'CONVENTIONAL' | 'MIXED';
  aadhaar_number: string;
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason?: string;
  created_at: string;
}

export interface CustomerProfile {
  id: number;
  user: number;
  default_address: string;
  phone: string;
  alternate_phone?: string;
  total_orders: number;
  total_spent: number;
}

export interface DeliveryProfile {
  id: number;
  user: number;
  vehicle_type: string;
  vehicle_number: string;
  license_number: string;
  service_area: string;
  is_available: boolean;
  total_deliveries: number;
  rating: number;
  is_verified: boolean;
}

export interface Product {
  id: number;
  farmer: number;
  category: number;
  name_en: string;
  name_ta: string;
  description_en?: string;
  description_ta?: string;
  price_per_unit: number;
  unit: string;
  available_quantity: number;
  min_order_quantity: number;
  is_organic: boolean;
  images: string[];
  harvest_date?: string;
  is_active: boolean;
  preorder_available: boolean;
  preorder_cutoff_hours: number;
  farmer_name: string;
  farmer_farm: string;
  category_name: string;
  average_rating: number;
  review_count: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer: number;
  farmer: number;
  delivery_partner?: number;
  order_type: 'NORMAL' | 'PREORDER';
  status: string;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  delivery_address: string;
  delivery_instructions?: string;
  scheduled_date?: string;
  created_at: string;
  items: OrderItem[];
  customer_name: string;
  farmer_name: string;
  delivery_partner_name?: string;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
}

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  max_quantity: number;
  image?: string;
}