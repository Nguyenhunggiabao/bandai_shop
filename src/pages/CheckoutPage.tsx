import { useState, FormEvent } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, MapPin, CreditCard, CheckCircle, Zap, ChevronDown } from 'lucide-react';
import { CartItem, ShippingInfo, Page } from '../types';
import { paymentMethods, api } from '../data/mockData';

/* Component CheckoutPage: Xử lý quy trình thanh toán bao gồm xem giỏ hàng, nhập thông tin giao hàng, chọn phương thức thanh toán và xác nhận đơn hàng. */

interface CheckoutPageProps {
  cart: CartItem[];
  onUpdateCart: (cart: CartItem[]) => void;
  onNavigate: (page: Page) => void;
  onOrderSuccess: (orderId: string) => void;
}

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'success';

export function CheckoutPage({ cart, onUpdateCart, onNavigate, onOrderSuccess }: CheckoutPageProps) {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: '',
  });
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [activeShipInput, setActiveShipInput] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 500_000 ? 0 : 30_000;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shippingFee - discount;

  const updateQuantity = (productId: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[];
    onUpdateCart(updated);
  };

  const removeItem = (productId: string) => {
    onUpdateCart(cart.filter(item => item.product.id !== productId));
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'NEON10') {
      setPromoApplied(true);
    }
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.placeOrder({
        items: cart, shippingInfo, paymentMethod: selectedPayment,
        subtotal, shippingFee, discount, total,
      });
      if (result.success) {
        setOrderId(result.orderId);
        setStep('success');
        onOrderSuccess(result.orderId);
        onUpdateCart([]);
      }
    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'cart', label: 'Giỏ hàng', icon: '🛒' },
    { id: 'shipping', label: 'Giao hàng', icon: '📦' },
    { id: 'payment', label: 'Thanh toán', icon: '💳' },
  ];
  const stepOrder: CheckoutStep[] = ['cart', 'shipping', 'payment'];

  // ── ORDER SUMMARY SIDEBAR ──
  const OrderSummary = () => (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-glow)',
      borderRadius: '16px',
      padding: '24px',
      position: 'sticky',
      top: '90px',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-display)', fontSize: '13px', color: '#00f5ff',
        letterSpacing: '2px', marginBottom: '20px',
      }}>
        ĐƠN HÀNG CỦA BẠN
      </h3>

      {cart.map(item => (
        <div key={item.product.id} style={{
          display: 'flex', gap: '12px', marginBottom: '16px',
          paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden',
            border: '1px solid var(--border-subtle)', flexShrink: 0,
          }}>
            <img src={item.product.images[0]} alt={item.product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', color: '#e8f4f8', fontWeight: 600, lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.product.name}
            </p>
            <p style={{ fontSize: '11px', color: '#7ba3b8', marginTop: '3px' }}>
              {item.product.brand} · x{item.quantity}
            </p>
            <p style={{ fontSize: '13px', color: '#00ff88', fontWeight: 700, marginTop: '4px',
              fontFamily: 'var(--font-display)' }}>
              {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
            </p>
          </div>
        </div>
      ))}

      {/* Promo */}
      {!promoApplied && step !== 'success' && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Mã giảm giá"
            style={{
              flex: 1, background: 'rgba(0, 245, 255, 0.03)',
              border: '1px solid rgba(0, 245, 255, 0.15)', borderRadius: '8px',
              color: '#e8f4f8', padding: '9px 12px', fontSize: '13px',
              outline: 'none', fontFamily: 'var(--font-body)',
            }}
          />
          <button
            onClick={applyPromo}
            style={{
              background: 'rgba(0, 245, 255, 0.1)', border: '1px solid rgba(0, 245, 255, 0.3)',
              color: '#00f5ff', padding: '9px 14px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap',
              fontFamily: 'var(--font-body)',
            }}
          >
            Áp dụng
          </button>
        </div>
      )}
      {promoApplied && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(0, 255, 136, 0.06)', border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: '8px', padding: '8px 12px', marginBottom: '16px',
          fontSize: '12px', color: '#00ff88',
        }}>
          <CheckCircle size={13} /> Mã NEON10 đã áp dụng — Giảm 10%
        </div>
      )}

      {/* Totals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'Tạm tính', value: subtotal },
          { label: 'Phí vận chuyển', value: shippingFee, green: shippingFee === 0 },
          ...(discount > 0 ? [{ label: 'Giảm giá', value: -discount, green: true }] : []),
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#7ba3b8' }}>{row.label}</span>
            <span style={{ color: (row as { green?: boolean }).green ? '#00ff88' : '#e8f4f8', fontWeight: 500 }}>
              {row.value === 0 ? 'Miễn phí' : `${row.value < 0 ? '-' : ''}${Math.abs(row.value).toLocaleString('vi-VN')}₫`}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: '1px solid rgba(0, 245, 255, 0.15)', paddingTop: '14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: '#7ba3b8', letterSpacing: '1px' }}>
          TỔNG CỘNG
        </span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700,
          color: '#00ff88', textShadow: '0 0 10px rgba(0, 255, 136, 0.4)',
        }}>
          {total.toLocaleString('vi-VN')}₫
        </span>
      </div>
    </div>
  );

  // ── STEP: CART ──
  if (step === 'cart') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '90px' }}
        className="cyber-bg">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <button onClick={() => onNavigate('home')} style={{
              background: 'rgba(0, 245, 255, 0.06)', border: '1px solid rgba(0, 245, 255, 0.2)',
              color: '#00f5ff', padding: '8px 14px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '6px',
              cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              fontFamily: 'var(--font-body)',
            }}>
              <ArrowLeft size={15} /> Tiếp tục mua sắm
            </button>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: '24px', color: '#e8f4f8',
                fontWeight: 700, letterSpacing: '1px',
              }}>
                GIỎ HÀNG
              </h1>
              <p style={{ color: '#7ba3b8', fontSize: '13px' }}>{cart.length} sản phẩm</p>
            </div>
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
              <h2 style={{ color: '#7ba3b8', fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '16px' }}>
                GIỎ HÀNG TRỐNG
              </h2>
              <p style={{ color: '#3d6070', marginBottom: '24px' }}>Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
              <button onClick={() => onNavigate('home')} style={{
                background: 'linear-gradient(135deg, #00f5ff, #0080ff)',
                border: 'none', color: '#010810', padding: '12px 28px', borderRadius: '10px',
                cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-body)',
                boxShadow: '0 0 25px rgba(0, 245, 255, 0.3)',
              }}>
                Khám phá sản phẩm
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
              {/* Cart Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.map((item, i) => (
                  <div key={item.product.id} style={{
                    display: 'flex', gap: '20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px', padding: '20px',
                    transition: 'border-color 0.2s',
                    animation: `fade-in-up 0.4s ease ${i * 80}ms both`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}>
                    {/* Image */}
                    <div style={{
                      width: '100px', height: '100px', borderRadius: '10px',
                      overflow: 'hidden', flexShrink: 0,
                      border: '1px solid var(--border-subtle)',
                    }}>
                      <img src={item.product.images[0]} alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <span style={{
                          fontSize: '10px', color: '#00f5ff',
                          background: 'rgba(0, 245, 255, 0.08)',
                          border: '1px solid rgba(0, 245, 255, 0.2)',
                          padding: '2px 8px', borderRadius: '4px', fontWeight: 600,
                        }}>{item.product.category}</span>
                      </div>
                      <h3 style={{
                        fontSize: '15px', fontWeight: 600, color: '#e8f4f8',
                        marginBottom: '4px', lineHeight: 1.3,
                      }}>
                        {item.product.name}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#7ba3b8', marginBottom: '12px' }}>
                        {item.product.brand} · {item.product.scale}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        {/* Quantity */}
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          border: '1px solid rgba(0, 245, 255, 0.2)', borderRadius: '8px', overflow: 'hidden',
                        }}>
                          <button onClick={() => updateQuantity(item.product.id, -1)} style={{
                            background: 'none', border: 'none', color: '#00f5ff',
                            padding: '6px 12px', cursor: 'pointer', fontSize: '16px',
                          }}>
                            <Minus size={13} />
                          </button>
                          <span style={{
                            padding: '6px 16px', fontWeight: 700, color: '#e8f4f8', fontSize: '14px',
                            borderLeft: '1px solid rgba(0, 245, 255, 0.1)',
                            borderRight: '1px solid rgba(0, 245, 255, 0.1)',
                          }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, +1)} style={{
                            background: 'none', border: 'none', color: '#00f5ff',
                            padding: '6px 12px', cursor: 'pointer',
                          }}>
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Price + Delete */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{
                            fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700,
                            color: '#00ff88', textShadow: '0 0 8px rgba(0, 255, 136, 0.3)',
                          }}>
                            {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                          </span>
                          <button onClick={() => removeItem(item.product.id)} style={{
                            background: 'rgba(255, 68, 68, 0.08)',
                            border: '1px solid rgba(255, 68, 68, 0.2)',
                            color: '#ff4444', borderRadius: '6px',
                            padding: '6px 8px', cursor: 'pointer', display: 'flex',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 68, 68, 0.15)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 68, 68, 0.08)')}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary + Next */}
              <div>
                <OrderSummary />
                <button
                  onClick={() => setStep('shipping')}
                  style={{
                    width: '100%', marginTop: '16px',
                    background: 'linear-gradient(135deg, #00f5ff, #0080ff)',
                    border: 'none', color: '#010810',
                    padding: '16px', borderRadius: '10px',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'var(--font-display)', letterSpacing: '1px',
                    boxShadow: '0 0 30px rgba(0, 245, 255, 0.3)',
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 245, 255, 0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 245, 255, 0.3)')}
                >
                  TIẾP TỤC →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── STEP: SHIPPING ──
  if (step === 'shipping') {
    const inputStyle = (name: string) => ({
      width: '100%',
      background: activeShipInput === name ? 'rgba(0, 245, 255, 0.04)' : 'rgba(0, 245, 255, 0.02)',
      border: `1px solid ${activeShipInput === name ? 'rgba(0, 245, 255, 0.5)' : 'rgba(0, 245, 255, 0.15)'}`,
      borderRadius: '10px',
      color: '#e8f4f8',
      padding: '13px 16px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'var(--font-body)',
      transition: 'all 0.2s',
      boxShadow: activeShipInput === name ? '0 0 20px rgba(0, 245, 255, 0.08)' : 'none',
    });
    const labelStyle = {
      display: 'block' as const,
      fontSize: '11px',
      color: '#7ba3b8',
      fontWeight: 600 as const,
      letterSpacing: '0.5px',
      marginBottom: '7px',
    };

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '90px' }}
        className="cyber-bg">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
          {/* Steps indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '40px', justifyContent: 'center' }}>
            {steps.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: stepOrder.indexOf(step) >= i
                      ? 'linear-gradient(135deg, #00f5ff, #0080ff)'
                      : 'rgba(0, 245, 255, 0.06)',
                    border: stepOrder.indexOf(step) >= i
                      ? 'none'
                      : '1px solid rgba(0, 245, 255, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px',
                    boxShadow: stepOrder.indexOf(step) >= i ? '0 0 15px rgba(0, 245, 255, 0.4)' : 'none',
                  }}>
                    {s.icon}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: stepOrder.indexOf(step) >= i ? '#00f5ff' : '#3d6070',
                    fontWeight: stepOrder.indexOf(step) >= i ? 600 : 400,
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    width: '60px', height: '1px',
                    background: stepOrder.indexOf(step) > i ? '#00f5ff' : 'rgba(0, 245, 255, 0.15)',
                    margin: '0 8px', marginBottom: '20px',
                    boxShadow: stepOrder.indexOf(step) > i ? '0 0 6px rgba(0, 245, 255, 0.5)' : 'none',
                    transition: 'all 0.3s',
                  }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glow)',
              borderRadius: '16px', padding: '32px',
              animation: 'fade-in-up 0.4s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                <MapPin size={18} color="#00f5ff" />
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontSize: '16px',
                  color: '#e8f4f8', letterSpacing: '1px',
                }}>
                  THÔNG TIN GIAO HÀNG
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>HỌ VÀ TÊN *</label>
                    <input type="text" value={shippingInfo.fullName}
                      onChange={e => setShippingInfo(p => ({ ...p, fullName: e.target.value }))}
                      onFocus={() => setActiveShipInput('fullName')}
                      onBlur={() => setActiveShipInput(null)}
                      placeholder="Nguyễn Văn A"
                      style={inputStyle('fullName')} />
                  </div>
                  <div>
                    <label style={labelStyle}>SỐ ĐIỆN THOẠI *</label>
                    <input type="tel" value={shippingInfo.phone}
                      onChange={e => setShippingInfo(p => ({ ...p, phone: e.target.value }))}
                      onFocus={() => setActiveShipInput('phone')}
                      onBlur={() => setActiveShipInput(null)}
                      placeholder="0900 000 000"
                      style={inputStyle('phone')} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>EMAIL *</label>
                  <input type="email" value={shippingInfo.email}
                    onChange={e => setShippingInfo(p => ({ ...p, email: e.target.value }))}
                    onFocus={() => setActiveShipInput('email')}
                    onBlur={() => setActiveShipInput(null)}
                    placeholder="your@email.com"
                    style={inputStyle('email')} />
                </div>

                <div>
                  <label style={labelStyle}>ĐỊA CHỈ *</label>
                  <input type="text" value={shippingInfo.address}
                    onChange={e => setShippingInfo(p => ({ ...p, address: e.target.value }))}
                    onFocus={() => setActiveShipInput('address')}
                    onBlur={() => setActiveShipInput(null)}
                    placeholder="Số nhà, tên đường..."
                    style={inputStyle('address')} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  {[
                    { key: 'city', label: 'TỈNH/THÀNH PHỐ', placeholder: 'TP. HCM' },
                    { key: 'district', label: 'QUẬN/HUYỆN', placeholder: 'Quận 1' },
                    { key: 'ward', label: 'PHƯỜNG/XÃ', placeholder: 'Phường Bến Nghé' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={labelStyle}>{field.label} *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          value={shippingInfo[field.key as keyof ShippingInfo]}
                          onChange={e => setShippingInfo(p => ({ ...p, [field.key]: e.target.value }))}
                          onFocus={() => setActiveShipInput(field.key)}
                          onBlur={() => setActiveShipInput(null)}
                          placeholder={field.placeholder}
                          style={inputStyle(field.key)}
                        />
                        <ChevronDown size={13} style={{
                          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                          color: '#3d6070', pointerEvents: 'none',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label style={labelStyle}>GHI CHÚ (TÙY CHỌN)</label>
                  <textarea
                    value={shippingInfo.notes}
                    onChange={e => setShippingInfo(p => ({ ...p, notes: e.target.value }))}
                    onFocus={() => setActiveShipInput('notes')}
                    onBlur={() => setActiveShipInput(null)}
                    placeholder="Ghi chú cho người giao hàng..."
                    rows={3}
                    style={{
                      ...inputStyle('notes'),
                      resize: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button onClick={() => setStep('cart')} style={{
                  flex: 1, padding: '13px',
                  background: 'rgba(0, 245, 255, 0.06)',
                  border: '1px solid rgba(0, 245, 255, 0.2)',
                  color: '#00f5ff', borderRadius: '10px',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                }}>
                  ← Quay lại
                </button>
                <button
                  onClick={() => {
                    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.email || !shippingInfo.address) {
                      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
                      return;
                    }
                    setStep('payment');
                  }}
                  style={{
                    flex: 2, padding: '13px',
                    background: 'linear-gradient(135deg, #00f5ff, #0080ff)',
                    border: 'none', color: '#010810',
                    borderRadius: '10px', cursor: 'pointer',
                    fontSize: '14px', fontWeight: 700,
                    fontFamily: 'var(--font-display)', letterSpacing: '1px',
                    boxShadow: '0 0 25px rgba(0, 245, 255, 0.3)',
                  }}
                >
                  TIẾP THEO →
                </button>
              </div>
            </div>

            <OrderSummary />
          </div>
        </div>
      </div>
    );
  }

  // ── STEP: PAYMENT ──
  if (step === 'payment') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-void)', paddingTop: '90px' }}
        className="cyber-bg">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>
          {/* Steps indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '40px', justifyContent: 'center' }}>
            {steps.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: stepOrder.indexOf(step) >= i ? 'linear-gradient(135deg, #00f5ff, #0080ff)' : 'rgba(0, 245, 255, 0.06)',
                    border: stepOrder.indexOf(step) >= i ? 'none' : '1px solid rgba(0, 245, 255, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px',
                    boxShadow: stepOrder.indexOf(step) >= i ? '0 0 15px rgba(0, 245, 255, 0.4)' : 'none',
                  }}>
                    {s.icon}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: stepOrder.indexOf(step) >= i ? '#00f5ff' : '#3d6070',
                    fontWeight: stepOrder.indexOf(step) >= i ? 600 : 400,
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    width: '60px', height: '1px',
                    background: stepOrder.indexOf(step) > i ? '#00f5ff' : 'rgba(0, 245, 255, 0.15)',
                    margin: '0 8px', marginBottom: '20px',
                    boxShadow: stepOrder.indexOf(step) > i ? '0 0 6px rgba(0, 245, 255, 0.5)' : 'none',
                  }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glow)',
              borderRadius: '16px', padding: '32px',
              animation: 'fade-in-up 0.4s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                <CreditCard size={18} color="#00f5ff" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: '#e8f4f8', letterSpacing: '1px' }}>
                  PHƯƠNG THỨC THANH TOÁN
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '16px 20px',
                      background: selectedPayment === method.id
                        ? 'rgba(0, 245, 255, 0.08)'
                        : 'rgba(0, 245, 255, 0.02)',
                      border: selectedPayment === method.id
                        ? '2px solid rgba(0, 245, 255, 0.5)'
                        : '1px solid rgba(0, 245, 255, 0.12)',
                      borderRadius: '12px', cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      boxShadow: selectedPayment === method.id ? '0 0 20px rgba(0, 245, 255, 0.1)' : 'none',
                    }}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      background: selectedPayment === method.id ? 'rgba(0, 245, 255, 0.15)' : 'rgba(0, 245, 255, 0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', flexShrink: 0,
                    }}>
                      {method.icon}
                    </div>
                    <span style={{
                      fontSize: '14px', fontWeight: selectedPayment === method.id ? 600 : 400,
                      color: selectedPayment === method.id ? '#00f5ff' : '#e8f4f8',
                      flex: 1,
                    }}>
                      {method.label}
                    </span>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      border: selectedPayment === method.id ? '2px solid #00f5ff' : '2px solid #3d6070',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {selectedPayment === method.id && (
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: '#00f5ff',
                          boxShadow: '0 0 6px rgba(0, 245, 255, 0.6)',
                        }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Shipping Info Summary */}
              <div style={{
                marginTop: '24px', padding: '16px',
                background: 'rgba(0, 245, 255, 0.03)',
                border: '1px solid rgba(0, 245, 255, 0.1)',
                borderRadius: '10px',
              }}>
                <p style={{ fontSize: '11px', color: '#7ba3b8', fontWeight: 600, letterSpacing: '1px', marginBottom: '10px' }}>
                  ĐỊA CHỈ GIAO HÀNG
                </p>
                <p style={{ fontSize: '14px', color: '#e8f4f8', fontWeight: 600 }}>{shippingInfo.fullName}</p>
                <p style={{ fontSize: '13px', color: '#7ba3b8' }}>{shippingInfo.phone} · {shippingInfo.email}</p>
                <p style={{ fontSize: '13px', color: '#7ba3b8' }}>
                  {shippingInfo.address}, {shippingInfo.ward}, {shippingInfo.district}, {shippingInfo.city}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button onClick={() => setStep('shipping')} style={{
                  flex: 1, padding: '13px',
                  background: 'rgba(0, 245, 255, 0.06)',
                  border: '1px solid rgba(0, 245, 255, 0.2)',
                  color: '#00f5ff', borderRadius: '10px',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                }}>
                  ← Quay lại
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  style={{
                    flex: 2, padding: '13px',
                    background: loading ? 'rgba(0, 245, 255, 0.1)' : 'linear-gradient(135deg, #00f5ff, #0080ff)',
                    border: loading ? '1px solid rgba(0, 245, 255, 0.3)' : 'none',
                    color: loading ? '#00f5ff' : '#010810',
                    borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px', fontWeight: 700,
                    fontFamily: 'var(--font-display)', letterSpacing: '1px',
                    boxShadow: loading ? 'none' : '0 0 25px rgba(0, 245, 255, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '15px', height: '15px',
                        border: '2px solid rgba(0, 245, 255, 0.3)',
                        borderTopColor: '#00f5ff',
                        borderRadius: '50%',
                        animation: 'glow-rotate 0.8s linear infinite',
                      }} />
                      ĐANG XỬ LÝ...
                    </>
                  ) : (
                    <>ĐẶT HÀNG NGAY</>
                  )}
                </button>
              </div>
            </div>

            <OrderSummary />
          </div>
        </div>
      </div>
    );
  }

  // ── STEP: SUCCESS ──
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-void)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}
    className="cyber-bg">
      <div style={{ textAlign: 'center', maxWidth: '520px', animation: 'fade-in-up 0.6s ease' }}>
        {/* Success icon */}
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.05) 70%)',
          border: '2px solid rgba(0, 255, 136, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 0 40px rgba(0, 255, 136, 0.3)',
          animation: 'float 3s ease infinite',
        }}>
          <CheckCircle size={48} color="#00ff88" strokeWidth={1.5} />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px', fontWeight: 700,
          color: '#00ff88',
          textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
          letterSpacing: '2px', marginBottom: '12px',
        }}>
          ĐẶT HÀNG THÀNH CÔNG!
        </h1>

        <p style={{ color: '#7ba3b8', fontSize: '15px', lineHeight: 1.7, marginBottom: '8px' }}>
          Cảm ơn bạn đã tin tưởng NEONMECH!
        </p>

        <div style={{
          background: 'rgba(0, 245, 255, 0.04)',
          border: '1px solid rgba(0, 245, 255, 0.15)',
          borderRadius: '10px', padding: '16px', margin: '24px 0',
        }}>
          <p style={{ fontSize: '12px', color: '#7ba3b8', marginBottom: '4px' }}>MÃ ĐƠN HÀNG</p>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: '18px',
            color: '#00f5ff', fontWeight: 700, letterSpacing: '2px',
            textShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
          }}>
            {orderId}
          </p>
        </div>

        <p style={{ fontSize: '13px', color: '#7ba3b8', marginBottom: '32px' }}>
          Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 30 phút.<br />
          Email xác nhận đã được gửi đến <span style={{ color: '#00f5ff' }}>{shippingInfo.email}</span>
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              padding: '13px 28px',
              background: 'linear-gradient(135deg, #00f5ff, #0080ff)',
              border: 'none', color: '#010810',
              borderRadius: '10px', cursor: 'pointer',
              fontSize: '14px', fontWeight: 700,
              fontFamily: 'var(--font-display)', letterSpacing: '1px',
              boxShadow: '0 0 25px rgba(0, 245, 255, 0.3)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <Zap size={15} /> TIẾP TỤC MUA SẮM
          </button>
        </div>
      </div>
    </div>
  );
}