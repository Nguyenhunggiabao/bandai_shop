import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, TrendingUp, Package, Shield, Truck, Star } from 'lucide-react';
import { Product, CartItem } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Footer } from '../components/Footer';
import { mockProducts, categories } from '../data/mockData';

/* Component HomePage: Trang chủ hiển thị danh sách sản phẩm, hỗ trợ tìm kiếm, lọc theo danh mục và sắp xếp. */

interface HomePageProps {
  cart: CartItem[];
  onViewDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function HomePage({ onViewDetail, onAddToCart }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const load = async () => {
      await new Promise(r => setTimeout(r, 600));
      setProducts(mockProducts);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p =>
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const stats = [
    { icon: <Package size={20} />, value: '2,400+', label: 'Sản phẩm' },
    { icon: <Star size={20} />, value: '15,000+', label: 'Đánh giá 5⭐' },
    { icon: <Truck size={20} />, value: 'Miễn phí', label: 'Giao hàng >500k' },
    { icon: <Shield size={20} />, value: '100%', label: 'Chính hãng' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      {/* ── Hero Section ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
      className="cyber-bg">
        {/* Glowing orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '-5%', width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'neon-pulse 5s ease infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '-10%', width: '700px', height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 128, 255, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'neon-pulse 6s ease infinite 1s',
        }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 245, 255, 0.06)',
            border: '1px solid rgba(0, 245, 255, 0.25)',
            borderRadius: '100px',
            padding: '6px 16px',
            marginBottom: '24px',
            animation: 'fade-in-up 0.5s ease',
          }}>
            <TrendingUp size={13} color="#00f5ff" />
            <span style={{ fontSize: '12px', color: '#00f5ff', fontWeight: 600, letterSpacing: '1px' }}>
              #1 SHOP MÔ HÌNH VIỆT NAM 2024
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '20px',
            letterSpacing: '2px',
            animation: 'fade-in-up 0.5s ease 0.1s both',
          }}>
            <span style={{
              color: '#00f5ff',
              textShadow: '0 0 30px rgba(0, 245, 255, 0.5), 0 0 60px rgba(0, 245, 255, 0.2)',
              display: 'block',
            }}>
              NEON MECH
            </span>
            <span style={{
              color: '#e8f4f8',
              fontSize: '0.55em',
              letterSpacing: '4px',
              display: 'block',
              marginTop: '4px',
            }}>
              MÔ HÌNH CAO CẤP
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: '#7ba3b8',
            maxWidth: '560px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
            animation: 'fade-in-up 0.5s ease 0.2s both',
          }}>
            Khám phá bộ sưu tập mô hình cao cấp từ Gundam, Transformers, Marvel và hơn thế nữa.
            Chính hãng 100%, giao hàng toàn quốc.
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: '520px',
            margin: '0 auto',
            animation: 'fade-in-up 0.5s ease 0.3s both',
          }}>
            <div style={{
              position: 'relative',
              border: `1px solid ${searchFocused ? 'rgba(0, 245, 255, 0.5)' : 'rgba(0, 245, 255, 0.25)'}`,
              borderRadius: '100px',
              background: searchFocused ? 'rgba(0, 245, 255, 0.06)' : 'rgba(0, 245, 255, 0.03)',
              transition: 'all 0.3s',
              boxShadow: searchFocused ? '0 0 30px rgba(0, 245, 255, 0.15)' : 'none',
            }}>
              <Search
                size={18}
                style={{
                  position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                  color: searchFocused ? '#00f5ff' : '#3d6070', transition: 'color 0.2s',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Tìm kiếm mô hình, thương hiệu..."
                style={{
                  width: '100%', background: 'none', border: 'none',
                  color: '#e8f4f8', fontSize: '15px',
                  padding: '16px 60px 16px 52px',
                  borderRadius: '100px', outline: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(0, 245, 255, 0.1)', border: '1px solid rgba(0, 245, 255, 0.3)',
                    color: '#00f5ff', borderRadius: '50%', width: '28px', height: '28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '14px',
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          gap: '0',
          marginTop: '60px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          animation: 'fade-in-up 0.5s ease 0.4s both',
          position: 'relative',
          zIndex: 1,
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              padding: '20px 32px',
              borderRight: i < stats.length - 1 ? '1px solid rgba(0, 245, 255, 0.1)' : 'none',
              textAlign: 'center',
            }}>
              <div style={{ color: '#00f5ff', marginBottom: '6px', opacity: 0.7 }}>{stat.icon}</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                color: '#e8f4f8',
                textShadow: '0 0 10px rgba(0, 245, 255, 0.3)',
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: '#7ba3b8', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
          animation: 'float 2s ease infinite',
          opacity: 0.4,
        }}>
          <span style={{ fontSize: '10px', color: '#7ba3b8', letterSpacing: '2px' }}>SCROLL</span>
          <ChevronDown size={16} color="#7ba3b8" />
        </div>
      </section>

      {/* ── Products Section ── */}
      <section style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '80px 24px',
      }}>
        {/* Section header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div>
            <p style={{ fontSize: '12px', color: '#00f5ff', letterSpacing: '3px', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
              BỘ SƯU TẬP
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 700,
              color: '#e8f4f8',
              letterSpacing: '1px',
            }}>
              SẢN PHẨM NỔI BẬT
            </h2>
          </div>

          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <SlidersHorizontal
              size={14}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7ba3b8', pointerEvents: 'none' }}
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                background: 'rgba(4, 15, 30, 0.9)',
                border: '1px solid rgba(0, 245, 255, 0.2)',
                color: '#e8f4f8',
                padding: '10px 16px 10px 34px',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                appearance: 'none',
                paddingRight: '32px',
              }}
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#7ba3b8', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flexShrink: 0,
                background: activeCategory === cat.id
                  ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(0, 128, 255, 0.2))'
                  : 'rgba(4, 15, 30, 0.8)',
                border: activeCategory === cat.id
                  ? '1px solid rgba(0, 245, 255, 0.5)'
                  : '1px solid rgba(0, 245, 255, 0.12)',
                color: activeCategory === cat.id ? '#00f5ff' : '#7ba3b8',
                padding: '10px 18px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: activeCategory === cat.id ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeCategory === cat.id ? '0 0 15px rgba(0, 245, 255, 0.15)' : 'none',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
              {cat.id !== 'all' && (
                <span style={{
                  background: activeCategory === cat.id ? 'rgba(0, 245, 255, 0.2)' : 'rgba(123, 163, 184, 0.1)',
                  borderRadius: '100px',
                  padding: '1px 6px',
                  fontSize: '10px',
                  fontWeight: 700,
                }}>
                  {mockProducts.filter(p => p.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results info */}
        <p style={{ fontSize: '13px', color: '#7ba3b8', marginBottom: '24px' }}>
          Hiển thị <span style={{ color: '#00f5ff', fontWeight: 600 }}>{filtered.length}</span> sản phẩm
          {searchQuery && <> cho "<span style={{ color: '#e8f4f8' }}>{searchQuery}</span>"</>}
        </p>

        {/* Product Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                aspectRatio: '3/4',
                animation: 'neon-pulse 1.5s ease infinite',
              }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#7ba3b8' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '16px' }}>Không tìm thấy sản phẩm phù hợp</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              style={{
                background: 'none', border: '1px solid rgba(0, 245, 255, 0.3)',
                color: '#00f5ff', padding: '10px 20px', borderRadius: '8px',
                cursor: 'pointer', marginTop: '16px', fontFamily: 'var(--font-body)',
                fontSize: '13px',
              }}
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={onViewDetail}
                onAddToCart={onAddToCart}
                animationDelay={i * 80}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}