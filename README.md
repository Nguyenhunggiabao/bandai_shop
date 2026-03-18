## Tổng quan

**4 lỗ hổng Information Leakage** — lớp lỗi bảo mật cho phép thông tin kỹ thuật nội bộ bị lộ ra ngoài, giúp kẻ tấn công thu thập thông tin về hệ thống mà không cần bất kỳ đặc quyền nào.

## Chi tiết lỗ hổng & cách khắc phục

---

### Lỗ hổng #1 — Console log chạy trên production

**File:** `src/lib/axiosInstance.ts`
**Mức độ:** 🔴 Nghiêm trọng

#### Mô tả

Toàn bộ `console.log` / `console.error` trong axios interceptor chạy ở **mọi môi trường**, bao gồm production. Bất kỳ ai mở DevTools → Console trên trình duyệt đều thấy:

- URL đầy đủ của từng API endpoint (`baseURL + path`)
- HTTP method và status code của mỗi request
- Nội dung `error.message` từ server khi request thất bại

Đây là nguồn thông tin quý giá cho kẻ tấn công: biết được endpoint nào tồn tại, server đang trả lỗi gì, và kiến trúc API ra sao.

#### Trước khi sửa

```ts
// ❌ Chạy cả trên production
console.log(`[API →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
console.log(`[API ←] ${response.status} ${response.config.url}`);
console.error(`[API ✗] ${status ?? 'network'}: ${error.message}`);
```

#### Sau khi sửa

```ts
// ✅ Chỉ chạy trong development
const isDev = import.meta.env.DEV;

if (isDev) console.log(`[API →] ${config.method?.toUpperCase()} ${config.url}`);
if (isDev) console.log(`[API ←] ${response.status} ${response.config.url}`);
if (isDev) console.warn(`[API ✗] status=${status ?? 'network'}`);
```

**Lý do chọn giải pháp này:** Vite tự động loại bỏ các block `if (false)` khỏi production build thông qua tree-shaking — nghĩa là `import.meta.env.DEV` sẽ được thay bằng `false` khi build, và toàn bộ đoạn `console.*` sẽ bị xóa hoàn toàn khỏi bundle.

---

### Lỗ hổng #2 — Raw `error.message` hiển thị trực tiếp ra UI

**File:** `src/pages/HomePage.tsx`
**Mức độ:** 🔴 Nghiêm trọng

#### Mô tả

Khi `productService.getAll()` ném lỗi, `error.message` từ Axios được lấy trực tiếp và đưa vào state để render lên màn hình người dùng. Axios có thể trả về các message như:

- `"Request failed with status code 500"`
- `"Network Error"`
- `"timeout of 10000ms exceeded"`
- Thậm chí nội dung lỗi từ server nếu API trả về error body

Những thông tin này tiết lộ cấu trúc hệ thống, giúp kẻ tấn công biết server đang lỗi gì và ở đâu.

#### Trước khi sửa

```ts
// ❌ Lộ kỹ thuật ra UI
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
  setErrorMsg(msg);  // msg có thể là "Request failed with status code 500"
  setFetchState('error');
}
```

#### Sau khi sửa

```ts
// ✅ Log chi tiết nội bộ, hiện thông báo chung ra UI
} catch (err: unknown) {
  logError('HomePage.loadProducts', err);
  setErrorMsg(toUserMessage(err));  // Luôn trả về thông báo thân thiện
  setFetchState('error');
}
```

---

### Lỗ hổng #3 — Log terminal lộ thông tin kỹ thuật ra giao diện người dùng

**File:** `src/pages/LoginPage.tsx`
**Mức độ:** 🟡 Trung bình → Nghiêm trọng

#### Mô tả

Trang Login có tính năng "Axios Log Terminal" — một widget debug hiển thị trực tiếp trên giao diện để developer theo dõi quá trình đăng nhập. Tuy nhiên, widget này cũng hiển thị cho **tất cả người dùng cuối**:

**Vấn đề** — Lộ chi tiết validation logic:
```
❌ Validation failed: Mật khẩu phải có ít nhất 6 ký tự.
```
Người dùng (hoặc kẻ tấn công) biết chính xác rule validation nào đang được áp dụng.

**Vấn đề** — Lộ raw error message từ network:
```
🔴 Network error: Request failed with status code 401
```
Tiết lộ HTTP status code thực từ server.

#### Trước khi sửa

```ts
// ❌ Lộ validation rule
addLog(`❌ Validation failed: ${result.message}`);

// ❌ Lộ raw error.message ra terminal trên UI
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
  addLog(`🔴 Network error: ${msg}`);
  setErrorMsg('Không thể kết nối đến server. Kiểm tra lại mạng.');
}
```

#### Sau khi sửa

```ts
// ✅ Thông báo chung, không lộ logic
addLog('❌ Xác thực thất bại');

// ✅ Log chi tiết vào console dev, terminal chỉ hiện thông báo chung
} catch (err: unknown) {
  logError('LoginPage.handleSubmit', err);
  addLog('🔴 Lỗi kết nối');
  setErrorMsg(toUserMessage(err));
}
```

---

### Lỗ hổng #4 — Tên third-party service lộ trên giao diện

**File:** `src/pages/HomePage.tsx`
**Mức độ:** 🟡 Trung bình

#### Mô tả

Badge trạng thái API hiển thị tên `fakestoreapi.com` trực tiếp trên giao diện người dùng. Dù đây là môi trường demo, thói quen này rất nguy hiểm trên production vì:

- Lộ tên nhà cung cấp dữ liệu bên thứ ba
- Kẻ tấn công có thể nhắm vào FakeStore API để làm gián đoạn dịch vụ
- Có thể bị dùng để giả mạo response (nếu kẻ tấn công biết endpoint thực)

#### Trước khi sửa

```tsx
{/* ❌ Lộ tên API bên ngoài */}
<span>fakestoreapi.com · {products.length} sản phẩm</span>
```

#### Sau khi sửa

```tsx
{/* ✅ Chỉ hiện thông tin cần thiết cho người dùng */}
<span>{products.length} sản phẩm</span>
