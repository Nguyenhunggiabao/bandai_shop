import { productAxios } from '../lib/axiosInstance';
import { Product } from '../types';

// ─── FakeStore API raw types ───────────────────────────────────────────────────
interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;           // USD
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, string> = {
  "men's clothing":    'Gundam',
  "women's clothing":  'Evangelion',
  'electronics':       'Transformers',
  'jewelery':          'Marvel',
};

const SERIES_MAP: Record<string, string> = {
  "men's clothing":    'Master Grade',
  "women's clothing":  'Perfect Grade',
  'electronics':       'Masterpiece',
  'jewelery':          'Hot Toys',
};

const BRAND_MAP: Record<string, string> = {
  "men's clothing":    'Bandai',
  "women's clothing":  'Kotobukiya',
  'electronics':       'Takara Tomy',
  'jewelery':          'Hot Toys',
};

const SCALE_MAP: Record<string, string> = {
  "men's clothing":    '1/100',
  "women's clothing":  '1/60',
  'electronics':       '1/20',
  'jewelery':          '1/6',
};

const MATERIAL_MAP: Record<string, string> = {
  "men's clothing":    'ABS / PS Plastic',
  "women's clothing":  'ABS / PVC',
  'electronics':       'Die-cast Metal / ABS',
  'jewelery':          'Diecast / Fabric',
};

const FEATURES_MAP: Record<string, string[]> = {
  "men's clothing":    ['Khung bên trong Full Inner Frame', 'Khớp nối linh hoạt 360°', 'Bộ decal nước chính hãng', 'Đế trưng bày cao cấp'],
  "women's clothing":  ['LED tích hợp mắt', 'Khớp nối tiêu chuẩn PG', 'Phụ kiện đầy đủ', 'Chứng nhận chính hãng'],
  'electronics':       ['Chất liệu Die-cast kim loại', 'Biến hình hoàn chỉnh', 'Chi tiết animation-accurate', 'Hộp đựng cao cấp'],
  'jewelery':          ['LED tích hợp', 'Hơn 30 điểm khớp nối', 'Sơn tay chi tiết', 'Chứng chỉ authentication'],
};

/** USD → VND (tỉ giá demo) */
const toVND = (usd: number) => Math.round(usd * 25_000 / 1000) * 1000;

/** Map FakeStore product → our Product type */
function mapProduct(p: FakeStoreProduct, index: number): Product {
  const cat = p.category;
  const priceVND = toVND(p.price);

  return {
    id:            String(p.id),
    name:          p.title,
    brand:         BRAND_MAP[cat]    ?? 'Bandai',
    price:         priceVND,
    originalPrice: index % 3 === 0 ? Math.round(priceVND * 1.2 / 1000) * 1000 : undefined,
    rating:        Math.round(p.rating.rate * 10) / 10,
    reviewCount:   p.rating.count,
    images:        [p.image],
    category:      CATEGORY_MAP[cat] ?? 'Gundam',
    scale:         SCALE_MAP[cat]    ?? '1/100',
    material:      MATERIAL_MAP[cat] ?? 'ABS / PS Plastic',
    series:        SERIES_MAP[cat]   ?? 'High Grade',
    inStock:       p.rating.count > 50,
    stockCount:    p.rating.count > 50 ? Math.min(p.rating.count, 30) : 0,
    description:   p.description,
    features:      FEATURES_MAP[cat] ?? ['Chất lượng cao', 'Chính hãng'],
    tags:          [CATEGORY_MAP[cat] ?? 'Gundam', SERIES_MAP[cat] ?? 'HG'],
    isNew:         index < 4,
    isBestSeller:  p.rating.rate >= 4.0 && p.rating.count > 100,
  };
}

// ─── Product Service ──────────────────────────────────────────────────────────
export const productService = {
  /** Lấy tất cả sản phẩm */
  getAll: async (): Promise<Product[]> => {
    const res = await productAxios.get<FakeStoreProduct[]>('/products');
    return res.data.map((p, i) => mapProduct(p, i));
  },

  /** Lấy một sản phẩm theo id */
  getById: async (id: string): Promise<Product> => {
    const res = await productAxios.get<FakeStoreProduct>(`/products/${id}`);
    return mapProduct(res.data, 0);
  },

  /** Lấy danh sách categories từ API */
  getCategories: async (): Promise<string[]> => {
    const res = await productAxios.get<string[]>('/products/categories');
    return res.data;
  },

  /** Lấy sản phẩm theo category */
  getByCategory: async (category: string): Promise<Product[]> => {
    const res = await productAxios.get<FakeStoreProduct[]>(`/products/category/${category}`);
    return res.data.map((p, i) => mapProduct(p, i));
  },
};