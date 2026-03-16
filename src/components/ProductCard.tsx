import { Star, ShoppingCart, Eye, Zap } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  animationDelay?: number;
}

export function ProductCard({ product, onViewDetail, onAddToCart, animationDelay = 0 }: ProductCardProps) {
  // Tính toán phần trăm giảm giá dựa trên giá gốc và giá hiện tại
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div
      // --- Container chính của Card ---
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        animation: `fade-in-up 0.5s ease ${animationDelay}ms both`,
        display: 'flex',
        flexDirection: 'column',
      }}
      // Xử lý sự kiện click vào toàn bộ Card để xem chi tiết
      onClick={() => onViewDetail(product)}
      // Hiệu ứng Hover: Đổi màu viền, nhấc card lên và đổ bóng neon
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(0, 245, 255, 0.35)';
        el.style.transform = 'translateY(-6px)';
        el.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 245, 255, 0.1)';
      }}
      // Trả về trạng thái ban đầu khi chuột rời khỏi Card
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--border-subtle)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* ── Khu vực Hình ảnh ── */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '4/3',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
        }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          // Hiệu ứng Zoom nhẹ ảnh khi hover
          onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.08)')}
          onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
        />

        {/* Lớp phủ hiệu ứng Scan-line (đường quét tivi cũ) phong cách Cyberpunk */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0, 245, 255, 0.05) 100%)',
          pointerEvents: 'none',
        }} />

        {/* --- Các nhãn trạng thái (Badges) --- */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {/* Nhãn hàng mới */}
          {product.isNew && (
            <span style={{
              background: 'linear-gradient(135deg, #00f5ff, #0080ff)',
              color: '#010810',
              fontSize: '10px',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '4px',
              fontFamily: 'var(--font-display)',
              letterSpacing: '1px',
              boxShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
            }}> NEW </span>
          )}
          {/* Nhãn hàng bán chạy */}
          {product.isBestSeller && (
            <span style={{
              background: 'linear-gradient(135deg, #ff6b00, #ff4500)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '4px',
            }}> 🔥 HOT </span>
          )}
          {/* Nhãn giảm giá */}
          {discountPercent > 0 && (
            <span style={{
              background: 'rgba(0, 255, 136, 0.15)',
              border: '1px solid rgba(0, 255, 136, 0.4)',
              color: '#00ff88',
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '4px',
            }}> -{discountPercent}% </span>
          )}
        </div>

        {/* Lớp phủ khi sản phẩm hết hàng */}
        {!product.inStock && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(1, 8, 16, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              color: '#7ba3b8',
              letterSpacing: '2px',
              border: '1px solid rgba(123, 163, 184, 0.4)',
              padding: '8px 16px',
              borderRadius: '6px',
            }}> HẾT HÀNG </span>
          </div>
        )}
      </div>

      {/* ── Khu vực Nội dung ── */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Phân loại & Tỷ lệ mô hình */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{
            fontSize: '10px',
            color: '#00f5ff',
            background: 'rgba(0, 245, 255, 0.08)',
            border: '1px solid rgba(0, 245, 255, 0.2)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}> {product.category} </span>
          <span style={{
            fontSize: '10px',
            color: '#7ba3b8',
            background: 'rgba(123, 163, 184, 0.06)',
            border: '1px solid rgba(123, 163, 184, 0.15)',
            padding: '2px 8px',
            borderRadius: '4px',
          }}> {product.scale} </span>
        </div>

        {/* Tên sản phẩm */}
        <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#e8f4f8',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2, // Giới hạn tên trong 2 dòng
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </h3>

        {/* Thương hiệu & Series */}
        <p style={{ fontSize: '12px', color: '#7ba3b8' }}>
          <span style={{ color: '#3d6070' }}>by </span>
          <span style={{ fontWeight: 600 }}>{product.brand}</span>
          <span style={{ color: '#3d6070' }}> · {product.series}</span>
        </p>

        {/* Đánh giá sao (Rating) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < Math.floor(product.rating) ? '#ffb800' : 'none'}
              color={i < Math.floor(product.rating) ? '#ffb800' : '#3d6070'}
              strokeWidth={1.5}
            />
          ))}
          <span style={{ fontSize: '12px', color: '#7ba3b8', marginLeft: '2px' }}>
            {product.rating} <span style={{ color: '#3d6070' }}>({product.reviewCount})</span>
          </span>
        </div>

        {/* --- Khu vực Giá & Nút Thêm vào giỏ --- */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <div>
            {/* Giá hiện tại */}
            <div style={{
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: '#00ff88',
              textShadow: '0 0 10px rgba(0, 255, 136, 0.4)',
            }}>
              {product.price.toLocaleString('vi-VN')}₫
            </div>
            {/* Giá gốc (nếu có giảm giá) */}
            {product.originalPrice && (
              <div style={{ fontSize: '12px', color: '#3d6070', textDecoration: 'line-through' }}>
                {product.originalPrice.toLocaleString('vi-VN')}₫
              </div>
            )}
          </div>

          {/* Nút Thêm vào giỏ hàng */}
          <button
            onClick={e => {
              e.stopPropagation(); // QUAN TRỌNG: Ngăn chặn sự kiện click lan ra ngoài Card
              if (product.inStock) onAddToCart(product);
            }}
            disabled={!product.inStock}
            style={{
              background: product.inStock
                ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(0, 128, 255, 0.15))'
                : 'rgba(61, 96, 112, 0.1)',
              border: product.inStock
                ? '1px solid rgba(0, 245, 255, 0.4)'
                : '1px solid rgba(61, 96, 112, 0.2)',
              color: product.inStock ? '#00f5ff' : '#3d6070',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: product.inStock ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {product.inStock ? (
              <><ShoppingCart size={13} /> Thêm</>
            ) : (
              <><Zap size={13} /> Hết hàng</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}