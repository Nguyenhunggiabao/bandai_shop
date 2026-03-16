import { Zap, Github, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-deep)',
      borderTop: '1px solid rgba(0, 245, 255, 0.1)',
      padding: '60px 24px 30px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          
          {/* Cột 1: Thông tin Thương hiệu & Mạng xã hội */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              {/* Logo Icon với hiệu ứng đổ bóng Neon */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #00f5ff, #0080ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 15px rgba(0, 245, 255, 0.4)',
              }}>
                <Zap size={18} color="#010810" strokeWidth={2.5} />
              </div>
              {/* Tên thương hiệu */}
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700,
                color: '#00f5ff', textShadow: '0 0 8px rgba(0, 245, 255, 0.5)',
                letterSpacing: '2px',
              }}>
                NEON<span style={{ color: '#00ff88' }}>MECH</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#7ba3b8', lineHeight: 1.7, marginBottom: '16px' }}>
              Thiên đường mô hình cao cấp dành cho những người đam mê. Chính hãng 100%, giao hàng toàn quốc.
            </p>
            {/* Nút mạng xã hội */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {['FB', 'IG', 'YT'].map(s => (
                <button key={s} style={{
                  background: 'rgba(0, 245, 255, 0.06)',
                  border: '1px solid rgba(0, 245, 255, 0.15)',
                  color: '#7ba3b8',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget).style.color = '#00f5ff';
                  (e.currentTarget).style.borderColor = 'rgba(0, 245, 255, 0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget).style.color = '#7ba3b8';
                  (e.currentTarget).style.borderColor = 'rgba(0, 245, 255, 0.15)';
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Cột 2: Danh mục sản phẩm */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: '#00f5ff', letterSpacing: '2px', marginBottom: '16px' }}>
              DANH MỤC
            </h4>
            {['Gundam', 'Transformers', 'Marvel / DC', 'Evangelion', 'Kaiju Series', 'Limited Edition'].map(item => (
              <div key={item} style={{ marginBottom: '8px' }}>
                <button style={{
                  background: 'none', border: 'none', color: '#7ba3b8',
                  fontSize: '13px', cursor: 'pointer', padding: 0, transition: 'color 0.2s',
                }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#00f5ff')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#7ba3b8')}>
                  → {item}
                </button>
              </div>
            ))}
          </div>

          {/* Cột 3: Chính sách khách hàng */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: '#00f5ff', letterSpacing: '2px', marginBottom: '16px' }}>
              CHÍNH SÁCH
            </h4>
            {['Chính sách đổi trả', 'Bảo hành sản phẩm', 'Phương thức vận chuyển', 'Bảo mật thông tin', 'Điều khoản sử dụng'].map(item => (
              <div key={item} style={{ marginBottom: '8px' }}>
                <button style={{
                  background: 'none', border: 'none', color: '#7ba3b8',
                  fontSize: '13px', cursor: 'pointer', padding: 0, transition: 'color 0.2s',
                }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#00f5ff')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#7ba3b8')}>
                  → {item}
                </button>
              </div>
            ))}
          </div>

          {/* Cột 4: Thông tin liên hệ trực tiếp */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: '#00f5ff', letterSpacing: '2px', marginBottom: '16px' }}>
              LIÊN HỆ
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <MapPin size={14} />, text: '123 Nguyễn Huệ, Q.1, TP.HCM' },
                { icon: <Phone size={14} />, text: '0900 123 456' },
                { icon: <Mail size={14} />, text: 'hello@neonmech.vn' },
                { icon: <Github size={14} />, text: 'github.com/neonmech' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7ba3b8', fontSize: '13px' }}>
                  <span style={{ color: '#00f5ff' }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thanh bản quyền & Thanh toán phía dưới cùng */}
        <div style={{
          borderTop: '1px solid rgba(0, 245, 255, 0.08)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {/* Copyright */}
          <p style={{ fontSize: '12px', color: '#3d6070' }}>
            © 2024 NEONMECH. All rights reserved. | Chính hãng • Uy tín • Tận tâm
          </p>
          
          {/* Các phương thức thanh toán hỗ trợ */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {['VISA', 'MasterCard', 'MoMo', 'VNPay'].map(m => (
              <span key={m} style={{
                fontSize: '10px',
                color: '#3d6070',
                background: 'rgba(61, 96, 112, 0.1)',
                border: '1px solid rgba(61, 96, 112, 0.2)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}