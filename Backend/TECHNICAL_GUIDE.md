# HƯỚNG DẪN KỸ THUẬT VÀ GIẢI THÍCH CƠ CHẾ (TECHNICAL GUIDE)

Tài liệu này giải thích các cơ chế cốt lõi được áp dụng trong dự án Backend, giúp đội ngũ phát triển hiểu rõ cách thức hoạt động và duy trì tiêu chuẩn code.

---

## 1. ANNOTATION @TRANSACTIONAL

### 1.1. Khái niệm
`@Transactional` là công cụ quản lý giao dịch tự động của Spring. Nó đảm bảo các thao tác với Cơ sở dữ liệu tuân thủ tính chất **ACID** (Atomicity, Consistency, Isolation, Durability).

### 1.2. Cách thức hoạt động
*   **All or Nothing:** Nếu một phương thức có `@Transactional` thực hiện 5 câu lệnh SQL, chỉ cần 1 câu lệnh thất bại, toàn bộ 5 câu lệnh sẽ bị hủy bỏ (**Rollback**). Nếu tất cả thành công, dữ liệu mới được lưu vĩnh viễn (**Commit**).
*   **ReadOnly:** `@Transactional(readOnly = true)` được dùng cho các thao tác truy vấn (SELECT) để tối ưu hiệu năng và tránh thay đổi dữ liệu ngoài ý muốn.

### 1.3. Áp dụng trong dự án
*   **RentalService.createRental:** Đảm bảo khi tạo đơn thuê xe, thông tin `Rental` và `RentalDetail` phải được lưu cùng lúc. Nếu lỗi ở bất kỳ bảng nào, hệ thống sẽ xóa sạch dữ liệu liên quan để tránh dữ liệu rác.

---

## 2. MAPSTRUCT - CƠ CHẾ CHUYỂN ĐỔI DỮ LIỆU

### 2.1. Tại sao cần MapStruct?
Trong dự án, chúng ta không trả trực tiếp `Entity` (đối tượng DB) về cho Client vì lý do bảo mật và hiệu năng. Thay vào đó, chúng ta dùng `DTO` (Data Transfer Object). MapStruct giúp chuyển đổi qua lại giữa Entity và DTO một cách tự động.

### 2.2. Ưu điểm
*   **Hiệu năng cao:** Sinh mã Java thuần khi biên dịch (Compile-time), không dùng Reflection lúc chạy (Runtime).
*   **Sạch sẽ:** Loại bỏ hàng trăm dòng code `set/get` thủ công trong Service.

### 2.3. Cách sử dụng
*   Định nghĩa Interface với `@Mapper(componentModel = "spring")`.
*   Sử dụng `@Mapping` để ánh xạ các trường có tên khác nhau.
*   MapStruct tự động tạo ra lớp Implementation trong thư mục `target/generated-sources`.

---

## 3. XỬ LÝ NGÀY THÁNG TRONG MAPSTRUCT

### 3.1. Tự động chuyển đổi
MapStruct hỗ trợ mặc định cho các kiểu dữ liệu của Java 8 Time API (`LocalDate`, `LocalDateTime`). Nếu hai bên cùng kiểu dữ liệu, việc chuyển đổi là tức thì.

### 3.2. Định dạng chuỗi (Formatting)
Để chuyển từ kiểu ngày tháng sang một chuỗi String định dạng theo yêu cầu Frontend:
```java
@Mapping(source = "startDate", target = "startDateStr", dateFormat = "dd/MM/yyyy")
```

### 3.3. Logic tùy chỉnh (Custom Logic)
*   **Default Methods:** Viết trực tiếp logic tính toán (ví dụ: tính số ngày thuê) ngay trong Mapper Interface.
*   **Utility Classes:** Kết hợp với các lớp dùng chung như `DateUtils` thông qua thuộc tính `uses = {DateUtils.class}` trong `@Mapper`.

---

## 5. SQL & DATABASE OPTIMIZATION

### 5.1. SQL Order of Execution
1. FROM/JOIN -> 2. WHERE -> 3. GROUP BY -> 4. HAVING -> 5. SELECT -> 6. DISTINCT -> 7. ORDER BY -> 8. LIMIT.

### 5.2. Indexing Strategy
*   **B-Tree:** Cấu trúc dữ liệu giúp tìm kiếm $O(\log n)$ và hỗ trợ duyệt khoảng cực tốt.
*   **Composite Index & Leftmost Prefix:** Quy tắc quan trọng nhất khi dùng Index đa cột. Index `(A, B)` sẽ không hoạt động nếu query chỉ dùng `B`.
*   **Explain Plan:** Công cụ bắt buộc để kiểm tra hiệu năng câu query trước khi đẩy lên Production.

### 5.3. Keyset Pagination vs Offset
Tránh dùng `OFFSET` lớn cho dữ liệu triệu bản ghi. Thay vào đó hãy dùng `WHERE id > last_seen_id` để giữ hiệu năng ổn định $O(1)$ thay vì $O(n)$.

### 5.4. Hệ thống phân tán (Scaling)
*   **Master-Slave:** Phân tách luồng Đọc/Ghi để tăng khả năng chịu tải.
*   **Redis Cache:** Giảm tải cho DB bằng cách lưu các dữ liệu nóng (Hot data) trên RAM.

---

## 6. HIGH-PERFORMANCE COMPUTING
*   **Spring Webflux:** Tận dụng mô hình Event-loop (Non-blocking I/O) để xử lý concurrency lớn, phù hợp cho các dịch vụ Streaming hoặc Real-time.
*   **Redis Pub/Sub:** Ứng dụng trong việc xây dựng hệ thống thông báo hoặc Chat thời gian thực.
