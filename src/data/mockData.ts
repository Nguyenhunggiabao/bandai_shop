import { Product, PaymentMethod } from '../types';

// ─── DANH SÁCH SẢN PHẨM MẪU (Mock Products) ───────────────────────────────────
// Chứa thông tin chi tiết về các mô hình Mech/Gundam để hiển thị trên Store
export const mockProducts: Product[] = [
  {
    id: 'p001',
    name: 'RX-78-2 Gundam Master Grade Ver. 3.0',
    brand: 'Bandai',
    price: 1_250_000,           // Giá hiện tại
    originalPrice: 1_500_000,   // Giá gốc để tính toán % giảm giá
    rating: 4.9,                // Điểm đánh giá trung bình
    reviewCount: 328,           // Số lượng lượt đánh giá
    images: [
      'https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=600&q=80',
      'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80',
    ],
    category: 'Gundam',
    scale: '1/100',             // Tỷ lệ mô hình
    material: 'ABS / PS Plastic',
    series: 'Master Grade',     // Dòng sản phẩm (MG, HG, RG...)
    inStock: true,              // Trạng thái còn hàng hay không
    stockCount: 12,             // Số lượng tồn kho thực tế
    description:
      'Phiên bản Master Grade Ver. 3.0 của chiếc Gundam huyền thoại RX-78-2 với chi tiết cực kỳ tinh xảo, khung bên trong đầy đủ, khớp nối linh hoạt và hệ thống màu sắc sống động. Đây là mô hình không thể thiếu trong bộ sưu tập của mọi fan Gundam.',
    features: [                 // Các tính năng nổi bật của sản phẩm
      'Khung bên trong Full Inner Frame',
      'Khớp nối linh hoạt 360°',
      'Panel Line sẵn có',
      'Bộ decal nước chính hãng',
      'Vũ khí đầy đủ: Beam Rifle, Shield, Beam Saber',
      'Đế trưng bày cao cấp',
    ],
    tags: ['Gundam', 'MG', 'UC', 'Bestseller'],
    isNew: false,               // Đánh dấu sản phẩm mới về
    isBestSeller: true,         // Đánh dấu sản phẩm bán chạy
  },
  {
    id: 'p002',
    name: 'Evangelion Unit-01 Perfect Grade',
    brand: 'Kotobukiya',
    price: 3_800_000,
    originalPrice: 4_200_000,
    rating: 4.8,
    reviewCount: 145,
    images: [
      'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=600&q=80',
      'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80',
    ],
    category: 'Evangelion',
    scale: '1/60',
    material: 'ABS / PVC',
    series: 'Perfect Grade',
    inStock: true,
    stockCount: 5,
    description:
      'Mô hình Evangelion Unit-01 tỉ lệ 1/60 Perfect Grade với màu tím đặc trưng và các chi tiết sơn tay cực kỳ tỉ mỉ. Bao gồm các phụ kiện đầy đủ và đế trưng bày ấn tượng.',
    features: [
      'Tỉ lệ 1/60 khổng lồ',
      'Màu tím sơn tay nổi bật',
      'LED tích hợp mắt EVA',
      'Khớp nối tiêu chuẩn PG',
      'Phụ kiện đầy đủ gồm Progressive Knife, Spear của Longinus',
      'Chứng nhận chính hãng',
    ],
    tags: ['Eva', 'PG', 'NERV', 'Limited'],
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 'p003',
    name: 'Optimus Prime G1 Masterpiece MP-44',
    brand: 'Takara Tomy',
    price: 5_500_000,
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=80',
    ],
    category: 'Transformers',
    scale: '1/20',
    material: 'Die-cast Metal / ABS',
    series: 'Masterpiece',
    inStock: true,
    stockCount: 3,
    description:
      'Optimus Prime phiên bản Masterpiece MP-44 - đỉnh cao của dòng sản phẩm Transformers. Chất liệu Die-cast metal cao cấp, khả năng biến hình hoàn hảo giữa robot và xe đầu kéo.',
    features: [
      'Chất liệu Die-cast kim loại',
      'Biến hình hoàn chỉnh Robot ↔ Xe tải',
      'Chi tiết G1 animation-accurate',
      'Cửa sổ buồng lái trong suốt',
      'Ion Blaster & Energon Axe',
      'Hộp đựng cao cấp',
    ],
    tags: ['Transformers', 'MP', 'G1', 'Diecast'],
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 'p004',
    name: 'Iron Man Mark LXXXV Hot Toys 1/6',
    brand: 'Hot Toys',
    price: 8_900_000,
    originalPrice: 9_500_000,
    rating: 5.0,
    reviewCount: 412,
    images: [
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&q=80',
      'https://images.unsplash.com/photo-1618779346761-5a83af5f4e6c?w=600&q=80',
    ],
    category: 'Marvel',
    scale: '1/6',
    material: 'Diecast / Fabric',
    series: 'Movie Masterpiece',
    inStock: false, // Hết hàng
    stockCount: 0,
    description:
      'Mô hình Hot Toys Iron Man Mark LXXXV - bộ giáp cuối cùng trong Avengers: Endgame. Chi tiết sơn tay cực kỳ tinh xảo, LED tích hợp và hơn 30 điểm khớp nối linh hoạt.',
    features: [
      'LED tích hợp mắt và ngực',
      'Hơn 30 điểm khớp nối',
      'Sơn tay chi tiết từng chi tiết',
      'Bàn tay thay thế nhiều kiểu',
      'Hiệu ứng ánh sáng Infinity Stones',
      'Chứng chỉ authentication',
    ],
    tags: ['Marvel', 'Hot Toys', 'Endgame', 'Diecast'],
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 'p005',
    name: 'Strike Freedom Gundam HG 1/144',
    brand: 'Bandai',
    price: 420_000,
    rating: 4.5,
    reviewCount: 567,
    images: [
      'https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=600&q=80',
    ],
    category: 'Gundam',
    scale: '1/144',
    material: 'PS Plastic',
    series: 'High Grade',
    inStock: true,
    stockCount: 45,
    description:
      'Strike Freedom Gundam HG - lựa chọn hoàn hảo cho người mới bắt đầu với màu trắng-vàng đặc trưng và thiết kế DRAGOON ấn tượng.',
    features: [
      'Dễ lắp ráp cho người mới',
      'Màu snap-fit không cần sơn',
      'DRAGOON system thay thế được',
      'Beam Rifle & Shield đầy đủ',
    ],
    tags: ['Gundam', 'HG', 'SEED', 'Beginner'],
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 'p006',
    name: 'Mechagodzilla Neon City Edition',
    brand: 'NECA',
    price: 2_100_000,
    originalPrice: 2_400_000,
    rating: 4.6,
    reviewCount: 203,
    images: [
      'https://images.unsplash.com/photo-1599421498111-58b8cf979a74?w=600&q=80',
    ],
    category: 'Kaiju',
    scale: '1/50',
    material: 'ABS / PVC',
    series: 'Ultimate Series',
    inStock: true,
    stockCount: 8,
    description:
      'Mechagodzilla phiên bản Neon City với hiệu ứng ánh sáng neon xanh rực rỡ. Phiên bản giới hạn 2024 với lớp sơn metallic đặc biệt.',
    features: [
      'LED neon xanh tích hợp',
      'Lớp sơn metallic đặc biệt',
      'Khớp nối 20 điểm',
      'Phiên bản giới hạn 5000 cái',
    ],
    tags: ['Godzilla', 'Kaiju', 'Neon', 'Limited'],
    isNew: true,
    isBestSeller: false,
  },
];

// ─── PHƯƠNG THỨC THANH TOÁN (Mock Payment Methods) ─────────────────────────────
export const paymentMethods: PaymentMethod[] = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '🏠' },
  { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { id: 'momo', label: 'Ví MoMo', icon: '💜' },
  { id: 'vnpay', label: 'VNPay QR', icon: '🔵' },
  { id: 'zalopay', label: 'ZaloPay', icon: '🔷' },
];

// ─── DANH MỤC SẢN PHẨM (Mock Categories) ──────────────────────────────────────
export const categories = [
  { id: 'all', label: 'Tất cả', icon: '🎯' },
  { id: 'Gundam', label: 'Gundam', icon: '🤖' },
  { id: 'Transformers', label: 'Transformers', icon: '🚗' },
  { id: 'Marvel', label: 'Marvel', icon: '⚡' },
  { id: 'Evangelion', label: 'Evangelion', icon: '🟣' },
  { id: 'Kaiju', label: 'Kaiju', icon: '🦎' },
];

// ─── GIẢ LẬP GỌI API (Mock API functions) ─────────────────────────────────────
// Mô phỏng độ trễ của mạng bằng setTimeout và Promise
export const api = {
  // Hàm xử lý đăng nhập
  login: async (email: string, _password: string): Promise<{ success: boolean; user?: { id: string; name: string; email: string } }> => {
    await new Promise(r => setTimeout(r, 1200)); // Giả lập độ trễ 1.2 giây
    if (email && _password) {
      return {
        success: true,
        user: { id: 'u001', name: 'Nguyễn Văn Mech', email },
      };
    }
    return { success: false };
  },

  // Lấy danh sách toàn bộ sản phẩm
  getProducts: async (): Promise<Product[]> => {
    await new Promise(r => setTimeout(r, 600)); // Giả lập độ trễ 0.6 giây
    return mockProducts;
  },

  // Lấy thông tin chi tiết của một sản phẩm qua ID
  getProduct: async (id: string): Promise<Product | null> => {
    await new Promise(r => setTimeout(r, 400));
    return mockProducts.find(p => p.id === id) ?? null;
  },

  // Hàm xử lý đặt hàng
  placeOrder: async (orderData: unknown): Promise<{ success: boolean; orderId: string }> => {
    await new Promise(r => setTimeout(r, 1500)); // Giả lập thời gian xử lý đơn hàng
    console.log('Order placed:', orderData);
    return { success: true, orderId: `ORD-${Date.now()}` }; // Trả về ID đơn hàng kèm timestamp
  },
};