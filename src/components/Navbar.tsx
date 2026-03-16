import { useState } from 'react';
import { ShoppingCart, User, Menu, X, Zap } from 'lucide-react';
import { CartItem, Page, User as UserType } from '../types';

// Định nghĩa kiểu dữ liệu cho các props của Navbar
interface NavbarProps {
  user: UserType | null;        // Thông tin người dùng (null nếu chưa đăng nhập)
  cart: CartItem[];             // Danh sách sản phẩm trong giỏ hàng
  currentPage: Page;            // Trang hiện tại để active link
  onNavigate: (page: Page) => void; // Hàm chuyển trang
  onLogout: () => void;         // Hàm đăng xuất
}

export function Navbar({ user, cart, currentPage, onNavigate, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Tính tổng số lượng sản phẩm trong giỏ hàng để hiển thị badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Danh sách các liên kết điều hướng chính
  const navLinks: { label: string; page: Page }[] = [
    { label: 'Trang chủ', page: 'home' },
  ];

  return (
    <nav style={{
      position: 'fixed', // Giữ thanh menu luôn ở trên cùng khi cuộn trang
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(1, 8, 16, 0.95)', // Nền tối có độ trong suốt
      backdropFilter: 'blur(20px)',       // Hiệu ứng kính mờ (glassmorphism)
      borderBottom: '1px solid rgba(0, 245, 255, 0.15)',
      boxShadow: '0 0 30px rgba(0, 245, 255, 0.05)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* ── Khu vực Logo ── */}
        <button
          onClick={() => onNavigate('home')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Biểu tượng tia sét Neon */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #00f5ff, #0080ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 245, 255, 0.4)',
          }}>
            <Zap size={20} color="#010810" strokeWidth={2.5} />
          </div>
          {/* Tên thương hiệu với hiệu ứng đổ bóng chữ */}
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 700,
            color: '#00f5ff',
            textShadow: '0 0 10px rgba(0, 245, 255, 0.6)',
            letterSpacing: '2px',
          }}>
            NEON<span style={{ color: '#00ff88' }}>MECH</span>
          </span>
        </button>

        {/* ── Menu Điều hướng (Desktop) ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              style={{
                // Highlight link nếu đang ở trang đó
                background: currentPage === link.page
                  ? 'rgba(0, 245, 255, 0.1)'
                  : 'none',
                border: currentPage === link.page
                  ? '1px solid rgba(0, 245, 255, 0.3)'
                  : '1px solid transparent',
                color: currentPage === link.page ? '#00f5ff' : '#7ba3b8',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px',
              }}
              onMouseEnter={e => {
                if (currentPage !== link.page) {
                  (e.target as HTMLButtonElement).style.color = '#00f5ff';
                  (e.target as HTMLButtonElement).style.borderColor = 'rgba(0, 245, 255, 0.2)';
                }
              }}
              onMouseLeave={e => {
                if (currentPage !== link.page) {
                  (e.target as HTMLButtonElement).style.color = '#7ba3b8';
                  (e.target as HTMLButtonElement).style.borderColor = 'transparent';
                }
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* ── Các hành động bên phải (Giỏ hàng & User) ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Nút Giỏ hàng với Badge số lượng */}
          <button
            onClick={() => onNavigate('checkout')}
            style={{
              position: 'relative',
              background: 'rgba(0, 245, 255, 0.06)',
              border: '1px solid rgba(0, 245, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#00f5ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0, 245, 255, 0.12)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 15px rgba(0, 245, 255, 0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0, 245, 255, 0.06)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            <ShoppingCart size={18} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Giỏ hàng</span>
            
            {/* Badge hiển thị tổng số lượng sản phẩm (chỉ hiện khi > 0) */}
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#00ff88', // Màu xanh lá neon đặc trưng
                color: '#010810',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
              }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* Menu người dùng: Hiển thị Profile nếu đã đăng nhập, ngược lại hiện nút Login */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Profile Avatar & Tên */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 245, 255, 0.06)',
                border: '1px solid rgba(0, 245, 255, 0.15)',
                borderRadius: '8px',
                padding: '6px 12px',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f5ff, #0080ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#010810',
                }}>
                  {user.name.charAt(0)} {/* Lấy chữ cái đầu của tên */}
                </div>
                <span style={{ fontSize: '13px', color: '#e8f4f8', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </span>
              </div>
              {/* Nút Đăng xuất */}
              <button
                onClick={onLogout}
                style={{
                  background: 'rgba(255, 107, 0, 0.1)',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                  color: '#ff6b00',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 107, 0, 0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 107, 0, 0.1)')}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            /* Nút Đăng nhập cho khách */
            <button
              onClick={() => onNavigate('login')}
              style={{
                background: 'linear-gradient(135deg, #00f5ff, #0080ff)',
                border: 'none',
                color: '#010810',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 245, 255, 0.5)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.3)')}
            >
              <User size={15} />
              Đăng nhập
            </button>
          )}

          {/* Nút bật/tắt menu trên thiết bị di động (Mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', // Sẽ được điều chỉnh bằng media query trong CSS thực tế
              background: 'none',
              border: '1px solid rgba(0, 245, 255, 0.2)',
              color: '#00f5ff',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}