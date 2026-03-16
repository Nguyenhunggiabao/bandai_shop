import axiosInstance from '../lib/axiosInstance';
import { User } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// ─── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {
  /**
   * Gọi demo API (JSONPlaceholder /users?email=...)
   * Nếu tìm thấy user với email khớp → đăng nhập thành công
   * Dùng password bất kỳ (demo không validate password phía server)
   */
  login: async ({ email, password }: LoginRequest): Promise<LoginResponse> => {
    // Validate cơ bản phía client trước khi gọi API
    if (!email || !password) {
      return { success: false, message: 'Vui lòng điền đầy đủ thông tin.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: 'Địa chỉ email không hợp lệ.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' };
    }

    // Gọi API demo — JSONPlaceholder /users (public REST API)
    const response = await axiosInstance.get<DemoUser[]>('/users');
    const demoUsers = response.data;

    // Tìm user theo email (demo: match bất kỳ email trong danh sách JSONPlaceholder)
    // Nếu không tìm thấy → vẫn cho phép login với email tự nhập (demo mode)
    const matched = demoUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    const user: User = matched
      ? {
          id: String(matched.id),
          name: matched.name,
          email: matched.email,
        }
      : {
          id: `demo-${Date.now()}`,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          email,
        };

    // Tạo demo token
    const token = btoa(`${user.id}:${Date.now()}`);
    localStorage.setItem('neonmech_token', token);
    localStorage.setItem('neonmech_user', JSON.stringify(user));

    return { success: true, user, token };
  },

  logout: () => {
    localStorage.removeItem('neonmech_token');
    localStorage.removeItem('neonmech_user');
  },

  getStoredUser: (): User | null => {
    try {
      const raw = localStorage.getItem('neonmech_user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },
};

// ─── JSONPlaceholder User type ─────────────────────────────────────────────────
interface DemoUser {
  id: number;
  name: string;
  email: string;
  username: string;
}