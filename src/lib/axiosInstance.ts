import axios, { AxiosInstance } from 'axios';

// ─── Kiểm tra môi trường (Environment guard) ──────────────────────────────────
// Sử dụng biến môi trường của Vite để xác định đang ở chế độ Development hay Production
const isDev = import.meta.env.DEV;

// ─── Hàm tạo Instance (Factory) ───────────────────────────────────────────────
// Giúp tạo ra nhiều instance với cấu hình chung nhưng Base URL khác nhau
function createInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 10_000, // Thời gian chờ tối đa 10 giây
    headers: { 'Content-Type': 'application/json' },
  });

  // Bộ chặn yêu cầu gửi đi (Request interceptor)
  instance.interceptors.request.use(
    config => {
      // Tự động đính kèm Token từ LocalStorage cho mọi yêu cầu
      const token = localStorage.getItem('neonmech_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;

      // ✅ Bảo mật: Chỉ log thông tin khi đang phát triển (isDev)
      // Giúp không bị lộ URL hoặc cấu hình API nhạy cảm khi đã đóng gói (Production)
      if (isDev) {
        console.log(`[API →] ${config.method?.toUpperCase()} ${config.url}`);
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Bộ chặn phản hồi nhận về (Response interceptor)
  instance.interceptors.response.use(
    response => {
      // ✅ Bảo mật: Chỉ log mã trạng thái (status code), không log dữ liệu phản hồi (body)
      // Tránh việc dữ liệu người dùng bị hiển thị tràn lan trên Console trình duyệt
      if (isDev) {
        console.log(`[API ←] ${response.status} ${response.config.url}`);
      }
      return response;
    },
    error => {
      const status = error.response?.status;
      
      // Xử lý khi Token hết hạn hoặc không hợp lệ (401)
      if (status === 401) localStorage.removeItem('neonmech_token');

      // ✅ Bảo mật: Không log thông báo lỗi chi tiết ra Console ở môi trường thực tế
      // Ngăn chặn việc lộ cấu trúc Server hoặc Stack Trace cho người dùng cuối
      if (isDev) {
        console.warn(`[API ✗] status=${status ?? 'lỗi mạng'}`);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

// ─── Xuất các Instance cho từng mục đích sử dụng ──────────────────────────────
// Instance dùng cho các tác vụ liên quan đến tài khoản/đăng nhập
export const authAxios    = createInstance('https://jsonplaceholder.typicode.com');

// Instance dùng cho các tác vụ liên quan đến sản phẩm (Sử dụng API FakeStore)
export const productAxios = createInstance('https://fakestoreapi.com');