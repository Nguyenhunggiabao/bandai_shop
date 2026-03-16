import { useState } from 'react';
import { ArrowLeft, Star, ShoppingCart, ShoppingBag, Shield, Truck, RotateCcw, Check, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { Product, CartItem } from '../types';
import { Footer } from '../components/Footer';

/* Component ProductDetailPage: Trang chi tiết sản phẩm hiển thị thông tin, hình ảnh, đánh giá và cho phép thêm vào giỏ hàng hoặc mua ngay. */

interface ProductDetailPageProps {
  product: Product;
  cart: CartItem[];
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export function ProductDetailPage({ product, onBack, onAddToCart, onBuyNow }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const mockReviews = [
    { name: 'Minh Tuấn', rating: 5, date: '15/11/2024', text: 'Sản phẩm đẹp hơn tưởng tượng rất nhiều! Chi tiết cực kỳ tỉ mỉ, đóng gói cẩn thận. Shop giao hàng nhanh, sẽ mua thêm.' },
    { name: 'Hải Long', rating: 5, date: '02/11/2024', text: 'Mô hình chính hãng, khớp nối mượt mà. Lắp ráp rất thú vị, con trai mình cực kỳ thích. Highly recommended!' },
    { name: 'Phương Anh', rating: 4, date: '28/10/2024', text: 'Sản phẩm tốt, đúng như mô tả. Chỉ tiếc là hết decal nước đi kèm nhưng shop đã hỗ trợ gửi bù ngay.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '70px' }}>
      {/* ── Breadcrumb ── */}
      <div style={{
        maxWidth: '1400px', margin: '0 auto', padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(0, 245, 255, 0.06)',
            border: '1px solid rgba(0, 245, 255, 0.2)',
            color: '#00f5ff', padding: '8px 14px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', gap: '6px',
            cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            transition: 'all 0.2s', fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0, 245, 255, 0.12)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0, 245, 255, 0.06)')}
        >
          <ArrowLeft size={15} /> Quay lại
        </button>
        <span style={{ color: '#3d6070', fontSize: '13px' }}>/ {product.category} / {product.name}</span>
      </div>

      {/* ── Main Content ── */}
      <div style={{
        maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: '60px',
        alignItems: 'start',
      }}>
        {/* ── Left: Images ── */}
        <div style={{ animation: 'fade-in-up 0.5s ease' }}>
          {/* Main image */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-glow)',
            aspectRatio: '1/1',
            marginBottom: '16px',
            boxShadow: '0 0 40px rgba(0, 245, 255, 0.05)',
          }}>
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            />
            {/* Scan overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 60%, rgba(0, 245, 255, 0.04) 100%)',
              pointerEvents: 'none',
            }} />

            {/* Prev/Next */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                  style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(0, 245, 255, 0.3)',
                    color: '#00f5ff', borderRadius: '50%', width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(0, 245, 255, 0.3)',
                    color: '#00f5ff', borderRadius: '50%', width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Badges */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
              {product.isNew && (
                <span style={{
                  background: 'linear-gradient(135deg, #00f5ff, #0080ff)', color: '#010810',
                  fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px',
                  fontFamily: 'var(--font-display)', letterSpacing: '1px',
                  boxShadow: '0 0 15px rgba(0, 245, 255, 0.5)',
                }}>NEW</span>
              )}
              {discountPercent > 0 && (
                <span style={{
                  background: 'rgba(0, 255, 136, 0.15)', border: '1px solid rgba(0, 255, 136, 0.4)',
                  color: '#00ff88', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px',
                }}>-{discountPercent}%</span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                style={{
                  width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden',
                  border: selectedImage === i ? '2px solid #00f5ff' : '2px solid var(--border-subtle)',
                  cursor: 'pointer', padding: 0,
                  boxShadow: selectedImage === i ? '0 0 15px rgba(0, 245, 255, 0.3)' : 'none',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Info ── */}
        <div style={{ animation: 'fade-in-up 0.5s ease 0.1s both', paddingTop: '8px' }}>
          {/* Category + badges */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '11px', color: '#00f5ff', background: 'rgba(0, 245, 255, 0.08)',
              border: '1px solid rgba(0, 245, 255, 0.25)', padding: '3px 10px', borderRadius: '6px',
              fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
            }}>
              {product.category}
            </span>
            <span style={{
              fontSize: '11px', color: '#7ba3b8', background: 'rgba(123, 163, 184, 0.06)',
              border: '1px solid rgba(123, 163, 184, 0.15)', padding: '3px 10px', borderRadius: '6px',
            }}>
              {product.series}
            </span>
            {product.isBestSeller && (
              <span style={{
                fontSize: '11px', color: '#fff', background: 'linear-gradient(135deg, #ff6b00, #ff4500)',
                padding: '3px 10px', borderRadius: '6px', fontWeight: 700,
              }}>
                🔥 BESTSELLER
              </span>
            )}
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(18px, 2.5vw, 26px)',
            fontWeight: 700,
            color: '#e8f4f8',
            lineHeight: 1.3,
            marginBottom: '8px',
            letterSpacing: '0.5px',
          }}>
            {product.name}
          </h1>

          {/* Brand & Scale */}
          <p style={{ color: '#7ba3b8', fontSize: '14px', marginBottom: '16px' }}>
            <span style={{ color: '#3d6070' }}>Thương hiệu: </span>
            <span style={{ color: '#00f5ff', fontWeight: 600 }}>{product.brand}</span>
            <span style={{ color: '#3d6070' }}> · Tỉ lệ: </span>
            <span style={{ fontWeight: 600 }}>{product.scale}</span>
            <span style={{ color: '#3d6070' }}> · Vật liệu: </span>
            <span>{product.material}</span>
          </p>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16}
                  fill={i < Math.floor(product.rating) ? '#ffb800' : 'none'}
                  color={i < Math.floor(product.rating) ? '#ffb800' : '#3d6070'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span style={{ color: '#ffb800', fontWeight: 700 }}>{product.rating}</span>
            <span style={{ color: '#3d6070', fontSize: '13px' }}>({product.reviewCount} đánh giá)</span>
          </div>

          {/* Price */}
          <div style={{
            padding: '20px', borderRadius: '12px',
            background: 'rgba(0, 255, 136, 0.04)',
            border: '1px solid rgba(0, 255, 136, 0.15)',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: 700,
                color: '#00ff88',
                textShadow: '0 0 15px rgba(0, 255, 136, 0.4)',
              }}>
                {product.price.toLocaleString('vi-VN')}₫
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '18px', color: '#3d6070', textDecoration: 'line-through' }}>
                  {product.originalPrice.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <p style={{ fontSize: '13px', color: '#00ff88', marginTop: '4px', opacity: 0.8 }}>
                Tiết kiệm {((product.originalPrice ?? 0) - product.price).toLocaleString('vi-VN')}₫ ({discountPercent}% OFF)
              </p>
            )}
          </div>

          {/* Stock */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '24px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: product.inStock ? '#00ff88' : '#ff4444',
              boxShadow: product.inStock ? '0 0 8px rgba(0, 255, 136, 0.6)' : '0 0 8px rgba(255, 68, 68, 0.6)',
              animation: product.inStock ? 'neon-pulse 2s ease infinite' : 'none',
            }} />
            <span style={{ fontSize: '13px', color: product.inStock ? '#00ff88' : '#ff4444', fontWeight: 600 }}>
              {product.inStock ? `Còn hàng (${product.stockCount} sản phẩm)` : 'Hết hàng'}
            </span>
          </div>

          {/* Quantity */}
          {product.inStock && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '13px', color: '#7ba3b8', fontWeight: 600 }}>Số lượng:</span>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: '1px solid rgba(0, 245, 255, 0.2)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}>
                {[-1, null, +1].map((delta, i) => (
                  delta === null ? (
                    <span key="val" style={{
                      padding: '10px 24px',
                      fontFamily: 'var(--font-display)',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#e8f4f8',
                      background: 'rgba(0, 245, 255, 0.03)',
                      borderLeft: '1px solid rgba(0, 245, 255, 0.1)',
                      borderRight: '1px solid rgba(0, 245, 255, 0.1)',
                      minWidth: '60px',
                      textAlign: 'center',
                    }}>
                      {quantity}
                    </span>
                  ) : (
                    <button
                      key={i}
                      onClick={() => setQuantity(Math.max(1, Math.min(product.stockCount, quantity + delta)))}
                      style={{
                        background: 'none', border: 'none', color: '#00f5ff',
                        padding: '10px 16px', cursor: 'pointer', fontSize: '18px',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0, 245, 255, 0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      {delta === -1 ? '−' : '+'}
                    </button>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => product.inStock && onAddToCart(product)}
              disabled={!product.inStock}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(0, 245, 255, 0.08)',
                border: '1px solid rgba(0, 245, 255, 0.35)',
                color: '#00f5ff',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body)',
                opacity: product.inStock ? 1 : 0.4,
              }}
              onMouseEnter={e => { if (product.inStock) e.currentTarget.style.background = 'rgba(0, 245, 255, 0.15)'; }}
              onMouseLeave={e => { if (product.inStock) e.currentTarget.style.background = 'rgba(0, 245, 255, 0.08)'; }}
            >
              <ShoppingCart size={16} /> Thêm vào giỏ
            </button>
            <button
              onClick={() => product.inStock && onBuyNow(product)}
              disabled={!product.inStock}
              style={{
                flex: 1,
                padding: '14px',
                background: product.inStock ? 'linear-gradient(135deg, #00f5ff, #0080ff)' : 'rgba(61, 96, 112, 0.2)',
                border: 'none',
                color: product.inStock ? '#010810' : '#3d6070',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body)',
                boxShadow: product.inStock ? '0 0 25px rgba(0, 245, 255, 0.3)' : 'none',
              }}
              onMouseEnter={e => { if (product.inStock) e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 245, 255, 0.5)'; }}
              onMouseLeave={e => { if (product.inStock) e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 245, 255, 0.3)'; }}
            >
              <ShoppingBag size={16} /> Mua ngay
            </button>
          </div>

          {/* Guarantees */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}>
            {[
              { icon: <Shield size={15} />, text: 'Chính hãng 100%' },
              { icon: <Truck size={15} />, text: 'Miễn phí giao hàng' },
              { icon: <RotateCcw size={15} />, text: 'Đổi trả 30 ngày' },
              { icon: <Package size={15} />, text: 'Đóng gói cẩn thận' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(0, 245, 255, 0.03)',
                border: '1px solid rgba(0, 245, 255, 0.1)',
                borderRadius: '8px', padding: '10px 12px',
                color: '#7ba3b8', fontSize: '12px', fontWeight: 500,
              }}>
                <span style={{ color: '#00f5ff' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs Section ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Tab Buttons */}
        <div style={{
          display: 'flex', gap: '0',
          borderBottom: '1px solid rgba(0, 245, 255, 0.1)',
          marginBottom: '32px',
        }}>
          {([
            { id: 'description', label: 'Mô tả sản phẩm' },
            { id: 'specs', label: 'Thông số kỹ thuật' },
            { id: 'reviews', label: `Đánh giá (${product.reviewCount})` },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none', border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #00f5ff' : '2px solid transparent',
                color: activeTab === tab.id ? '#00f5ff' : '#7ba3b8',
                padding: '14px 24px',
                fontSize: '14px', fontWeight: activeTab === tab.id ? 700 : 400,
                cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: 'var(--font-body)',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'description' && (
          <div style={{ maxWidth: '800px', animation: 'fade-in-up 0.3s ease' }}>
            <p style={{ color: '#7ba3b8', fontSize: '15px', lineHeight: 1.8, marginBottom: '28px' }}>
              {product.description}
            </p>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '14px', color: '#00f5ff',
              letterSpacing: '2px', marginBottom: '16px',
            }}>
              ĐẶC ĐIỂM NỔI BẬT
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {product.features.map((feature, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '12px 16px',
                  background: 'rgba(0, 245, 255, 0.03)',
                  border: '1px solid rgba(0, 245, 255, 0.08)',
                  borderRadius: '8px',
                  animation: `fade-in-up 0.3s ease ${i * 60}ms both`,
                }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'rgba(0, 255, 136, 0.1)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '1px',
                  }}>
                    <Check size={11} color="#00ff88" strokeWidth={3} />
                  </div>
                  <span style={{ color: '#e8f4f8', fontSize: '14px', lineHeight: 1.5 }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div style={{ maxWidth: '600px', animation: 'fade-in-up 0.3s ease' }}>
            {[
              ['Thương hiệu', product.brand],
              ['Dòng sản phẩm', product.series],
              ['Danh mục', product.category],
              ['Tỉ lệ', product.scale],
              ['Vật liệu', product.material],
              ['Tình trạng hàng', product.inStock ? `Còn hàng (${product.stockCount})` : 'Hết hàng'],
              ['Đánh giá TB', `${product.rating}/5 (${product.reviewCount} đánh giá)`],
            ].map(([key, val], i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '200px 1fr',
                padding: '14px 16px',
                background: i % 2 === 0 ? 'rgba(0, 245, 255, 0.02)' : 'transparent',
                border: '1px solid rgba(0, 245, 255, 0.06)',
                borderTop: i === 0 ? '1px solid rgba(0, 245, 255, 0.06)' : 'none',
                animation: `fade-in-up 0.3s ease ${i * 50}ms both`,
              }}>
                <span style={{ color: '#7ba3b8', fontSize: '13px', fontWeight: 600 }}>{key}</span>
                <span style={{ color: '#e8f4f8', fontSize: '13px' }}>{val}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ maxWidth: '800px', animation: 'fade-in-up 0.3s ease' }}>
            {/* Rating Summary */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '32px',
              padding: '24px', borderRadius: '12px',
              background: 'rgba(0, 245, 255, 0.03)',
              border: '1px solid rgba(0, 245, 255, 0.1)',
              marginBottom: '32px',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 700,
                  color: '#ffb800', lineHeight: 1,
                }}>
                  {product.rating}
                </div>
                <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', margin: '6px 0' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="#ffb800" color="#ffb800" />
                  ))}
                </div>
                <div style={{ fontSize: '12px', color: '#7ba3b8' }}>{product.reviewCount} đánh giá</div>
              </div>
            </div>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mockReviews.map((review, i) => (
                <div key={i} style={{
                  padding: '20px',
                  background: 'rgba(4, 15, 30, 0.8)',
                  border: '1px solid rgba(0, 245, 255, 0.08)',
                  borderRadius: '12px',
                  animation: `fade-in-up 0.3s ease ${i * 80}ms both`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00f5ff, #0080ff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: 700, color: '#010810',
                      }}>
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#e8f4f8', fontSize: '14px' }}>{review.name}</div>
                        <div style={{ fontSize: '11px', color: '#3d6070' }}>{review.date}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} size={13} fill="#ffb800" color="#ffb800" />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: '#7ba3b8', fontSize: '14px', lineHeight: 1.7 }}>{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}