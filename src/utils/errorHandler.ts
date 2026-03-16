import axios from 'axios';

const GENERIC_ERROR = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
const NETWORK_ERROR = 'Không thể kết nối. Kiểm tra lại đường truyền mạng.';
const AUTH_ERROR    = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
const SERVER_ERROR  = 'Hệ thống đang bận. Vui lòng thử lại sau ít phút.';

/**
 * Chuyển đổi lỗi kỹ thuật → thông báo an toàn hiển thị cho người dùng.
 * Không lộ: URL endpoint, HTTP status, server message, stack trace.
 */
export function toUserMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return GENERIC_ERROR;

  const status = error.response?.status;

  if (!error.response)                      return NETWORK_ERROR;
  if (status === 401 || status === 403)     return AUTH_ERROR;
  if (status !== undefined && status >= 500) return SERVER_ERROR;
  if (status === 404)  return 'Không tìm thấy dữ liệu yêu cầu.';
  if (status === 429)  return 'Quá nhiều yêu cầu. Vui lòng chờ một lúc.';

  return GENERIC_ERROR;
}

/**
 * Log lỗi nội bộ — chỉ dev.
 * Production: thay bằng Sentry.captureException(error).
 */
export function logError(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}