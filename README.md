# 🚗 Hệ Thống Quản Lý Cho Thuê Xe (Car Rental System)

Chào mừng bạn đến với dự án **Car Rental System** - Một nền tảng hiện đại giúp kết nối khách hàng với dịch vụ cho thuê xe chuyên nghiệp.

---

## 📖 Giới Thiệu
Dự án được xây dựng với kiến trúc Client-Server tách biệt, tập trung vào trải nghiệm người dùng mượt mà và hệ thống quản lý mạnh mẽ cho nhân viên và quản trị viên. Hệ thống cho phép khách hàng tìm kiếm, xem chi tiết và đặt thuê các loại xe khác nhau một cách nhanh chóng.

## 🚀 Công Nghệ Sử Dụng

### **Backend**
- **Ngôn ngữ:** Java 21
- **Framework:** Spring Boot 4.0.2
- **Bảo mật:** Spring Security (JWT & OAuth2 Client)
- **Cơ sở dữ liệu:** SQL Server (MSSQL)
- **ORM:** Spring Data JPA
- **Công cụ hỗ trợ:** Lombok, MapStruct, OpenAPI/Swagger
- **Gửi mail:** Spring Boot Starter Mail

### **Frontend**
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Bootstrap 5, Vanilla CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Routing:** React Router DOM v7

---

## ✨ Tính Năng Chính

### 🛡️ Hệ Thống Tài Khoản
- Đăng ký và đăng nhập (Local & Google OAuth2).
- Xác thực 2 yếu tố (2FA) qua OTP.
- Quản lý hồ sơ cá nhân (Profile).
- Phân quyền người dùng: **Customer**, **Staff**, **Admin**.

### 🚙 Quản Lý Đội Xe (Fleet Management)
- Danh sách xe với các bộ lọc tìm kiếm.
- Xem chi tiết thông số xe, hình ảnh.
- Phân loại xe (Sedan, SUV, Luxury...).

### 📅 Đặt Thuê Xe (Rental Booking)
- Quy trình đặt xe trực tuyến đơn giản.
- Quản lý lịch sử thuê xe của khách hàng.
- Nhân viên quản lý và phê duyệt các yêu cầu thuê xe.

### 📊 Dashboard & Thống Kê
- Dashboard riêng biệt cho từng vai trò.
- Thống kê doanh thu, số lượng xe, trạng thái thuê.

---

## 📁 Cấu Trúc Dự Án

```text
/
├── backend/            # Mã nguồn Spring Boot
│   ├── src/main/java   # Business Logic
│   └── src/resources   # Cấu hình application.yml
├── frontend/           # Mã nguồn React
│   ├── src/components  # Các thành phần giao diện dùng chung
│   ├── src/features    # Các module tính năng (admin, auth, customer, staff...)
│   └── src/data        # Repository và API calls
└── CarRental_SRS.pdf   # Tài liệu đặc tả yêu cầu hệ thống
```

---

## 🛠️ Hướng Dẫn Cài Đặt

### **1. Yêu Cầu Hệ Thống**
- Java JDK 21
- Node.js (v18 trở lên) & npm/yarn
- SQL Server

### **2. Cài Đặt Backend**
1. Truy cập vào thư mục `backend/`.
2. Tạo file `.env` hoặc cấu hình các biến môi trường trong `application.yml` (Database URL, Username, Password).
3. Chạy lệnh để cài đặt dependencies và khởi chạy:
   ```bash
   ./mvnw spring-boot:run
   ```

### **3. Cài Đặt Frontend**
1. Truy cập vào thư mục `frontend/`.
2. Cài đặt các package cần thiết:
   ```bash
   npm install
   ```
3. Khởi chạy ứng dụng ở chế độ phát triển:
   ```bash
   npm run dev
   ```

---

## 📝 Giấy Phép
Dự án này được phát triển cho mục đích học tập và quản lý dịch vụ cho thuê xe.

**Phát triển bởi:** Michael 🚀
