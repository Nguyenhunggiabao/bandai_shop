import axios from 'axios';

// ─── Khởi tạo Instance Axios ──────────────────────────────────────────────────
// Sử dụng JSONPlaceholder làm địa chỉ API giả lập (demo)
const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // Địa chỉ gốc của API
  timeout: 8000,                                   // Thời gian chờ tối đa 8 giây
  headers: {
    'Content-Type': 'application/json',            // Định nghĩa dữ liệu gửi đi là JSON
  },
});

// ─── Bộ chặn Request (Request Interceptor) ───────────────────────────────────
// Chạy trước khi yêu cầu được gửi lên máy chủ
axiosInstance.interceptors.request.use(
  config => {
    // Tự động gắn Token vào Header nếu tồn tại trong LocalStorage
    // Tên key 'neonmech_token' rất phù hợp với phong cách dự án của bạn
    const token = localStorage.getItem('neonmech_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log thông tin request để dễ dàng debug trong quá trình phát triển
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data ?? '');
    
    return config;
  },
  error => {
    // Xử lý lỗi xảy ra trong quá trình gửi request
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// ─── Bộ chặn Response (Response Interceptor) ──────────────────────────────────
// Chạy ngay sau khi nhận được phản hồi từ máy chủ
axiosInstance.interceptors.response.use(
  response => {
    // Log dữ liệu trả về để kiểm tra cấu trúc response
    console.log(`[API] Response ${response.status}:`, response.data);
    return response;
  },
  error => {
    const status = error.response?.status; // Mã trạng thái lỗi (401, 404, 500...)
    const message = error.response?.data?.message ?? error.message;

    // Xử lý riêng cho lỗi 401 (Hết hạn đăng nhập hoặc không có quyền)
    if (status === 401) {
      console.warn('[API] Unauthorized — Xóa token và yêu cầu đăng nhập lại');
      localStorage.removeItem('neonmech_token');
      // Bạn có thể thêm logic chuyển hướng người dùng về trang login ở đây:
      // window.location.href = '/login';
    }

    // Log lỗi chi tiết từ máy chủ hoặc lỗi mạng
    console.error(`[API] Error ${status ?? 'network'}:`, message);
    return Promise.reject(error);
  }
);

export default axiosInstance;