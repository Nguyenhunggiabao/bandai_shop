// ─── Product Types ───────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  scale: string;
  material: string;
  series: string;
  inStock: boolean;
  stockCount: number;
  description: string;
  features: string[];
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── User Types ───────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// ─── Order Types ──────────────────────────────────────────────────────────────
export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes?: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingInfo;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered';
  createdAt: Date;
}

// ─── Page Types ───────────────────────────────────────────────────────────────
export type Page = 'login' | 'home' | 'product-detail' | 'checkout' | 'order-success';

export interface AppState {
  currentPage: Page;
  selectedProduct: Product | null;
  cart: CartItem[];
  user: User | null;
  isLoggedIn: boolean;
}