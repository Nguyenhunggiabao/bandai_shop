import { useState, FormEvent } from 'react';
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Wifi } from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/authService';
import { toUserMessage, logError } from '../utils/errorHandler';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateHome: () => void;
}

type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export function LoginPage({ onLoginSuccess, onNavigateHome }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<ApiStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [apiLog, setApiLog] = useState<string[]>([]);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const addLog = (msg: string) =>
    setApiLog(prev => [...prev.slice(-4), msg]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    setApiLog([]);

    addLog('⏳ Chuẩn bị gửi request...');

    try {
      addLog('🔵 GET https://jsonplaceholder.typicode.com/users');
      const result = await authService.login({ email, password });

      if (result.success && result.user) {
        addLog(`✅ Response 200 OK — ${result.user.name}`);
        addLog(`🔑 Token: ${result.token?.slice(0, 20)}...`);
        setStatus('success');
        setTimeout(() => onLoginSuccess(result.user!), 800);
      } else {
        addLog('❌ Xác thực thất bại');
        setStatus('error');
        setErrorMsg(result.message ?? 'Email hoặc mật khẩu không đúng.');
      }
    } catch (err: unknown) {
      // ✅ Log chi tiết vào console dev only — không hiện ra UI
      logError('LoginPage.handleSubmit', err);
      addLog('🔴 Lỗi kết nối');
      setStatus('error');
      setErrorMsg(toUserMessage(err));
    }
  };

  const demoEmails = [
    'Sincere@april.biz',
    'Shanna@melissa.tv',
    'Nathan@yesenia.net',
  ];

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
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', animation: 'neon-pulse 4s ease infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,128,255,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '460px', animation: 'fade-in-up 0.6s ease' }}>
        {/* Logo */}
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
          <p style={{ color: '#7ba3b8', fontSize: '13px', marginTop: '8px' }}>
            Đăng nhập để khám phá thế giới mô hình
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(4,15,30,0.9)',
          border: '1px solid rgba(0,245,255,0.2)',
          borderRadius: '20px', padding: '36px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,245,255,0.05)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Top glow line */}
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
            background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)',
          }} />

          {/* API Status Bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 12px', borderRadius: '8px', marginBottom: '24px',
            background: 'rgba(0,245,255,0.03)',
            border: '1px solid rgba(0,245,255,0.1)',
          }}>
            <Wifi size={13} color="#00f5ff" />
            <span style={{ fontSize: '11px', color: '#7ba3b8', flex: 1 }}>
              API: <span style={{ color: '#00f5ff' }}>jsonplaceholder.typicode.com</span>
            </span>
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
              background: 'rgba(0,255,136,0.1)', color: '#00ff88',
              border: '1px solid rgba(0,255,136,0.25)',
            }}>
              LIVE
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700,
            color: '#e8f4f8', marginBottom: '6px', letterSpacing: '1px',
          }}>
            ĐĂNG NHẬP
          </h2>
          <p style={{ fontSize: '13px', color: '#7ba3b8', marginBottom: '24px' }}>
            Nhập thông tin của bạn để tiếp tục.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#7ba3b8',
                fontWeight: 600, letterSpacing: '0.5px', marginBottom: '7px' }}>
                ĐỊA CHỈ EMAIL
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: activeInput === 'email' ? '#00f5ff' : '#3d6070', transition: 'color 0.2s',
                }} />
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

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#7ba3b8',
                fontWeight: 600, letterSpacing: '0.5px', marginBottom: '7px' }}>
                MẬT KHẨU
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: activeInput === 'password' ? '#00f5ff' : '#3d6070', transition: 'color 0.2s',
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setActiveInput('password')}
                  onBlur={() => setActiveInput(null)}
                  placeholder="Tối thiểu 6 ký tự"
                  style={{ ...inputStyle('password'), padding: '13px 44px 13px 42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#3d6070', cursor: 'pointer',
                    padding: '4px', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => ((e.currentTarget).style.color = '#00f5ff')}
                  onMouseLeave={e => ((e.currentTarget).style.color = '#3d6070')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {status === 'error' && (
              <div style={{
                background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.3)',
                borderRadius: '8px', padding: '11px 14px',
                display: 'flex', alignItems: 'center', gap: '8px',
                color: '#ff6b00', fontSize: '13px',
                animation: 'fade-in-up 0.3s ease',
              }}>
                <AlertCircle size={15} />
                {errorMsg}
              </div>
            )}

            {/* Success */}
            {status === 'success' && (
              <div style={{
                background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.3)',
                borderRadius: '8px', padding: '11px 14px',
                display: 'flex', alignItems: 'center', gap: '8px',
                color: '#00ff88', fontSize: '13px',
                animation: 'fade-in-up 0.3s ease',
              }}>
                <CheckCircle size={15} />
                Đăng nhập thành công! Đang chuyển hướng...
              </div>
            )}

            {/* API Log Terminal */}
            {apiLog.length > 0 && (
              <div style={{
                background: 'rgba(1,8,16,0.95)',
                border: '1px solid rgba(0,245,255,0.15)',
                borderRadius: '8px', padding: '12px 14px',
                fontFamily: 'monospace', fontSize: '11px',
                animation: 'fade-in-up 0.3s ease',
              }}>
                <div style={{ color: '#3d6070', marginBottom: '6px', fontSize: '10px', letterSpacing: '1px' }}>
                  ▸ AXIOS LOG
                </div>
                {apiLog.map((log, i) => (
                  <div key={i} style={{
                    color: log.startsWith('✅') || log.startsWith('🔑') ? '#00ff88'
                      : log.startsWith('🔴') || log.startsWith('❌') ? '#ff6b00'
                      : log.startsWith('🔵') ? '#00f5ff'
                      : '#7ba3b8',
                    lineHeight: 1.7,
                    animation: `fade-in-up 0.2s ease ${i * 60}ms both`,
                  }}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              style={{
                width: '100%', padding: '14px',
                background: status === 'loading' || status === 'success'
                  ? 'rgba(0,245,255,0.1)'
                  : 'linear-gradient(135deg, #00f5ff, #0080ff)',
                border: status === 'loading' || status === 'success'
                  ? '1px solid rgba(0,245,255,0.3)' : 'none',
                borderRadius: '10px',
                color: status === 'loading' || status === 'success' ? '#00f5ff' : '#010810',
                fontSize: '14px', fontWeight: 700,
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.3s',
                fontFamily: 'var(--font-display)', letterSpacing: '1px',
                boxShadow: status === 'idle' || status === 'error'
                  ? '0 0 30px rgba(0,245,255,0.3)' : 'none',
                marginTop: '4px',
              }}
            >
              {status === 'loading' ? (
                <>
                  <div style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(0,245,255,0.3)',
                    borderTopColor: '#00f5ff', borderRadius: '50%',
                    animation: 'glow-rotate 0.8s linear infinite',
                  }} />
                  ĐANG XÁC THỰC...
                </>
              ) : status === 'success' ? (
                <><CheckCircle size={16} /> THÀNH CÔNG!</>
              ) : (
                <>ĐĂNG NHẬP <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Demo Hint */}
          <div style={{
            marginTop: '20px', padding: '14px',
            background: 'rgba(0,255,136,0.03)',
            border: '1px solid rgba(0,255,136,0.12)',
            borderRadius: '10px',
          }}>
            <p style={{ fontSize: '11px', color: '#7ba3b8', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px' }}>
              📧 DEMO — EMAIL CÓ SẴN TRONG API:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {demoEmails.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => { setEmail(em); setPassword('demo123'); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '3px 0',
                    textAlign: 'left', fontFamily: 'monospace', fontSize: '12px',
                    color: '#00f5ff', opacity: 0.8, transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => ((e.currentTarget).style.opacity = '1')}
                  onMouseLeave={e => ((e.currentTarget).style.opacity = '0.8')}
                >
                  → {em}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '10px', color: '#3d6070', marginTop: '8px' }}>
              Password: bất kỳ chuỗi ≥ 6 ký tự
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}