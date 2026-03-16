import { useState, FormEvent } from 'react';
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Wifi } from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/authService';

/* Component LoginPage: Trang đăng nhập cho phép người dùng nhập email và mật khẩu để xác thực tài khoản. */

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateHome: () => void;
}

// Định nghĩa các trạng thái của một yêu cầu API
type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export function LoginPage({ onLoginSuccess, onNavigateHome }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<ApiStatus>('idle'); // Trạng thái hiện tại của form
  const [errorMsg, setErrorMsg] = useState('');           // Thông báo lỗi từ server
  const [apiLog, setApiLog] = useState<string[]>([]);      // Mảng lưu vết các bước xử lý API
  const [activeInput, setActiveInput] = useState<string | null>(null); // Theo dõi input đang focus

  // Hàm ghi lại nhật ký hoạt động (giới hạn 5 dòng cuối cùng)
  const addLog = (msg: string) =>
    setApiLog(prev => [...prev.slice(-4), msg]);

  // Xử lý sự kiện Submit Form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');   // Bắt đầu trạng thái loading
    setErrorMsg('');        // Reset lỗi cũ
    setApiLog([]);          // Làm sạch log terminal

    addLog('⏳ Chuẩn bị gửi request...');

    try {
      // Giả lập log lời gọi API thực tế
      addLog('GET https://jsonplaceholder.typicode.com/users');
      const result = await authService.login({ email, password });

      if (result.success && result.user) {
        // Trường hợp đăng nhập thành công
        addLog(`Response 200 OK — ${result.user.name}`);
        addLog(`Token: ${result.token?.slice(0, 20)}...`);
        setStatus('success');
        
        // Đợi một chút để người dùng kịp thấy hiệu ứng thành công trước khi chuyển trang
        setTimeout(() => onLoginSuccess(result.user!), 800);
      } else {
        // Trường hợp validation thất bại (sai email/mật khẩu)
        addLog(`Validation failed: ${result.message}`);
        setStatus('error');
        setErrorMsg(result.message ?? 'Đăng nhập thất bại.');
      }
    } catch (err: unknown) {
      // Trường hợp lỗi mạng hoặc server crash
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
      addLog(`Network error: ${msg}`);
      setStatus('error');
      setErrorMsg('Không thể kết nối đến server. Kiểm tra lại mạng.');
    }
  };

  // Danh sách email mẫu để người dùng dễ dàng test (vì đang dùng API giả lập)
  const demoEmails = [
    'Sincere@april.biz',
    'Shanna@melissa.tv',
    'Nathan@yesenia.net',
  ];

  // Hàm xử lý style động cho các Input (Focus/Blur)
  const inputStyle = (name: string) => ({
    width: '100%',
    background: activeInput === name ? 'rgba(0, 245, 255, 0.04)' : 'rgba(0, 245, 255, 0.02)',
    border: `1px solid ${
      activeInput === name ? 'rgba(0, 245, 255, 0.5)' : 'rgba(0, 245, 255, 0.15)'
    }`,
    borderRadius: '10px',
    color: '#e8f4f8',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.2s',
    boxShadow: activeInput === name ? '0 0 20px rgba(0, 245, 255, 0.08)' : 'none',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-void)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="cyber-bg"
    >
      {/* Các vòng tròn ánh sáng (Glow) trang trí nền */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', animation: 'neon-pulse 4s ease infinite',
      }} />

      <div style={{ width: '100%', maxWidth: '460px', animation: 'fade-in-up 0.6s ease' }}>
        
        {/* Khu vực Logo & Tiêu đề */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <button
            onClick={onNavigateHome}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
          >
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #00f5ff, #0080ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(0,245,255,0.4), 0 0 60px rgba(0,245,255,0.15)',
              animation: 'float 3s ease infinite',
            }}>
              <Zap size={30} color="#010810" strokeWidth={2.5} />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700,
              color: '#00f5ff', textShadow: '0 0 15px rgba(0,245,255,0.6)', letterSpacing: '3px',
            }}>
              NEON<span style={{ color: '#00ff88' }}>MECH</span>
            </span>
          </button>
        </div>

        {/* Thẻ Card chứa Form đăng nhập */}
        <div style={{
          background: 'rgba(4,15,30,0.9)',
          border: '1px solid rgba(0,245,255,0.2)',
          borderRadius: '20px', padding: '36px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,245,255,0.05)',
          position: 'relative', overflow: 'hidden',
        }}>
          
          {/* Thanh hiển thị trạng thái API */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 12px', borderRadius: '8px', marginBottom: '24px',
            background: 'rgba(0,245,255,0.03)',
            border: '1px solid rgba(0,245,255,0.1)',
          }}>
            <Wifi size={13} color="#00f5ff" />
            <span style={{ fontSize: '11px', color: '#7ba3b8', flex: 1 }}>
              API: <span style={{ color: '#00f5ff' }}>JSONPlaceholder</span>
            </span>
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
              background: 'rgba(0,255,136,0.1)', color: '#00ff88',
              border: '1px solid rgba(0,255,136,0.25)',
            }}> LIVE </span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Input Email */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#7ba3b8', fontWeight: 600, marginBottom: '7px' }}>
                ĐỊA CHỈ EMAIL
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: activeInput === 'email' ? '#00f5ff' : '#3d6070' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setActiveInput('email')}
                  onBlur={() => setActiveInput(null)}
                  placeholder="your@email.com"
                  style={{ ...inputStyle('email'), padding: '13px 14px 13px 42px' }}
                />
              </div>
            </div>

            {/* Input Mật khẩu */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#7ba3b8', fontWeight: 600, marginBottom: '7px' }}>
                MẬT KHẨU
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: activeInput === 'password' ? '#00f5ff' : '#3d6070' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setActiveInput('password')}
                  onBlur={() => setActiveInput(null)}
                  style={{ ...inputStyle('password'), padding: '13px 44px 13px 42px' }}
                />
                {/* Nút Ẩn/Hiện mật khẩu */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#3d6070', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Hiển thị lỗi hoặc thông báo thành công */}
            {status === 'error' && (
              <div style={{ background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.3)', borderRadius: '8px', padding: '11px 14px', color: '#ff6b00', fontSize: '13px' }}>
                <AlertCircle size={15} /> {errorMsg}
              </div>
            )}
            {status === 'success' && (
              <div style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '8px', padding: '11px 14px', color: '#00ff88', fontSize: '13px' }}>
                <CheckCircle size={15} /> Đăng nhập thành công!
              </div>
            )}

            {/* Terminal hiển thị Log API - Giúp debug hoặc tạo phong cách hacker */}
            {apiLog.length > 0 && (
              <div style={{ background: 'rgba(1,8,16,0.95)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: '8px', padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px' }}>
                <div style={{ color: '#3d6070', marginBottom: '6px', fontSize: '10px' }}>▸ AXIOS LOG</div>
                {apiLog.map((log, i) => (
                  <div key={i} style={{ color: log.includes('200') || log.includes('Token') ? '#00ff88' : log.includes('error') ? '#ff6b00' : '#7ba3b8' }}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* Nút Submit chính */}
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              style={{
                width: '100%', padding: '14px',
                background: status === 'loading' || status === 'success' ? 'rgba(0,245,255,0.1)' : 'linear-gradient(135deg, #00f5ff, #0080ff)',
                borderRadius: '10px', color: status === 'loading' || status === 'success' ? '#00f5ff' : '#010810',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {status === 'loading' ? 'ĐANG XÁC THỰC...' : status === 'success' ? 'THÀNH CÔNG!' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          {/* Hướng dẫn cho người dùng thử nghiệm (Demo Hint) */}
          <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: '10px' }}>
            <p style={{ fontSize: '11px', color: '#7ba3b8', marginBottom: '8px', fontWeight: 600 }}>📧 CLICK ĐỂ DÙNG TÀI KHOẢN MẪU:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {demoEmails.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => { setEmail(em); setPassword('demo123'); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'monospace', fontSize: '12px', color: '#00f5ff' }}
                >
                  → {em}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}