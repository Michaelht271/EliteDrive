# BÁO CÁO TỔNG KẾT DỰ ÁN: HỆ THỐNG QUẢN LÝ THUÊ XE (BACKEND)

## 1. TỔNG QUAN DỰ ÁN
Hệ thống là một giải pháp Enterprise Web API hoàn chỉnh, được thiết kế để quản lý quy trình vận hành của một doanh nghiệp cho thuê xe tự lái. Dự án tập trung vào tính bảo mật, độ chính xác của dữ liệu và khả năng mở rộng linh hoạt.

*   **Công nghệ chủ đạo:** Java 21, Spring Boot 4.0.2, SQL Server.
*   **Mục tiêu:** Tự động hóa quy trình đặt xe, quản lý đội xe và đảm bảo tính minh bạch trong kiểm toán dữ liệu.

---

## 2. DANH SÁCH CHỨC NĂNG HỆ THỐNG

### 2.1. Quản lý Người dùng & Bảo mật
*   **Xác thực tập trung:** Sử dụng JWT (JSON Web Token) cho các API Stateless.
*   **Đăng nhập đa phương thức:** Hỗ trợ đăng nhập truyền thống và Social Login (Google OAuth2).
*   **Phân quyền (RBAC):** Hệ thống phân quyền chặt chẽ giữa `ADMIN` (Quản trị), `STAFF` (Nhân viên vận hành) và `CUSTOMER` (Khách hàng).

### 2.2. Quản lý Đội xe (Fleet Management)
*   **Quản lý thông tin:** Lưu trữ chi tiết thông số kỹ thuật, hình ảnh, biển số và giá thuê của từng loại xe.
*   **Xóa mềm (Soft Delete):** Đảm bảo tính toàn vẹn dữ liệu lịch sử bằng cách không xóa vĩnh viễn xe khỏi hệ thống.
*   **Trạng thái sẵn sàng:** Tự động cập nhật trạng thái xe (`AVAILABLE`, `UNAVAILABLE`) dựa trên lịch trình thuê thực tế.

### 2.3. Quy trình Đặt xe & Vận hành (Rental Flow)
*   **Tìm kiếm thông minh:** Bộ lọc đa năng theo thương hiệu, giá cả, số ghế và đặc biệt là lọc theo **thời gian xe còn trống**.
*   **Quản lý đơn thuê:** Quy trình chuyển đổi trạng thái từ lúc đặt (Pending), xác nhận (Confirmed), nhận xe (Renting) cho đến khi hoàn thành (Completed).
*   **Kiểm tra xung đột:** Hệ thống tự động ngăn chặn việc đặt trùng lịch (Double-booking) cho cùng một xe.

---

## 3. CÁC CÔNG NGHỆ VÀ KỸ THUẬT ÁP DỤNG

### 3.1. Kiến trúc và Design Patterns
*   **Package by Module:** Tổ chức code theo module nghiệp vụ giúp dễ dàng bảo trì và mở rộng.
*   **Specification Pattern:** Áp dụng cho các truy vấn tìm kiếm phức tạp, giúp tách biệt logic lọc dữ liệu khỏi Repository.
*   **Data Mapper Pattern:** Sử dụng MapStruct để chuyển đổi giữa Entity và DTO, bảo vệ lớp dữ liệu cốt lõi.
*   **Repository Pattern:** Trừu tượng hóa việc truy cập dữ liệu thông qua Spring Data JPA.

### 3.2. Tư duy Code (Clean Code)
*   **Single Responsibility Principle (SRP):** Mỗi lớp chỉ đảm nhận một nhiệm vụ duy nhất (Validation, Service, Controller).
*   **Custom Validation:** Sử dụng các Annotation tự định nghĩa (ví dụ: `@ValidDateRange`) để kiểm tra logic dữ liệu ngay từ tầng đầu vào.
*   **Global Exception Handling:** Xử lý lỗi tập trung, đảm bảo mọi phản hồi lỗi đều nhất quán về định dạng và mã lỗi (404, 409, 422...).

### 3.3. Tính năng Đặc biệt (Advanced Features)
*   **JPA Auditing:** Tự động ghi nhận thông tin người tạo và thời gian chỉnh sửa cuối cùng cho từng bản ghi thông qua `AuditorAware`.
*   **Unicode Support:** Tối ưu hóa cho SQL Server với kiểu dữ liệu `NVARCHAR`, đảm bảo hiển thị tiếng Việt hoàn hảo.
*   **Unit Testing:** Hệ thống được bảo vệ bởi các bộ kiểm thử tự động (JUnit 5 & Mockito), đảm bảo các logic tính toán giá và kiểm tra lịch luôn chính xác.

---

## 4. ĐÁNH GIÁ TỔNG KẾT
Dự án được xây dựng với tư duy hệ thống chuyên nghiệp, tuân thủ nghiêm ngặt các nguyên lý **SOLID** và các tiêu chuẩn **Clean Code**. Đây không chỉ là một ứng dụng chạy được, mà còn là một hệ thống có khả năng bảo trì cao, an toàn và sẵn sàng cho việc triển khai thực tế trên quy mô lớn.

---
**Người báo cáo:** *Gemini CLI Agent*
**Ngày thực hiện:** *27/04/2026*
