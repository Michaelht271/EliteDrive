package com.car.backend.modules.auth.entities;

import com.car.backend.base.BaseEntity;
import com.car.backend.modules.auth.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity đại diện cho tài khoản người dùng trong hệ thống
 * Implement UserDetails để tích hợp với Spring Security
 *
 * @author Michael
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "Users", uniqueConstraints = {
		@UniqueConstraint(name = "UK_users_username", columnNames = {"Username"}),
		@UniqueConstraint(name = "UK_users_email", columnNames = {"Email"})
}, indexes = {
		@Index(name = "idx_username", columnList = "Username"),
		@Index(name = "idx_email", columnList = "Email")
})

@RequiredArgsConstructor
@Getter
@Setter
@Builder
@ToString(exclude = {"password"})
@AllArgsConstructor
public class User extends BaseEntity implements UserDetails {
	/**
	 * ID t&#x1EF1; &#x111;&#x1ED9;ng t&#x103;ng c&#x1EE7;a t&agrave;i kho&#x1EA3;n ng&#x1B0;&#x1EDD;i d&ugrave;ng
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "UserId")
	private Long userId;
	
	/**
	 * Tên đăng nhập của tài khoản người dùng - duy nhất
	 * Độ dài 5-50 ký tự
	 */
	@Column(name = "Username", nullable = false, length = 50)
	private String username;
	
	/**
	 * Mật khẩu đã được mã hóa (BCrypt)
	 * Không bao giờ lưu plain text password
	 */
	@Column(name = "Password", nullable = false)
	private String password;
	
	/**
	 * Email - duy nhất trong hệ thống
	 * Dùng cho việc khôi phục mật khẩu, đăng ký tài khoản và xử lý thông tin liên quan
	 */
	@Column(name = "Email", nullable = false, length = 100)
	private String email;
	
	/**
	 * Danh sách vai trò của tài khoản
	 * Lưu dạng Enum Set, tự động convert sang String trong DB
	 */
	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(
			name = "UserRoles",
			joinColumns = @JoinColumn(name = "UserId")
	)
	@Enumerated(EnumType.STRING)
	@Column(name = "Role")
	@Builder.Default
	private Set<Role> roles = new HashSet<>();
	
	/**
	 * Số điện thoại
	 */
	@Column(name = "PhoneNumber", length = 15)
	private String phoneNumber;
	
	/**
	 * Token xac thuc tai khoan
	 */
	@Column(name = "OtpCode")
	private int otpCode;
	/**
	 * Trạng thái kích hoạt tài khoản
	 * true = Tài khoản đang hoạt động
	 * false = Tài khoản bị vô hiệu hóa
	 */
	@Column(name = "IsEnabled", nullable = false)
	@Builder.Default
	private boolean isEnabled = true;
	
	/**
	 * Trạng thái tài khoản chưa hết hạn
	 * Dùng cho các tài khoản có thời hạn sử dụng
	 */
	@Column(name = "UserNonExpired", nullable = false)
	@Builder.Default
	private boolean userNonExpired = true;
	
	/**
	 * Trạng thái tài khoản chưa bị khóa
	 * false = Tài khoản bị khóa (do vi phạm chính sách, bảo mật, v.v.)
	 */
	@Column(name = "UserNonLocked", nullable = false)
	@Builder.Default
	private boolean userNonLocked = true;
	
	/**
	 * Trạng thái mật khẩu chưa hết hạn
	 * Dùng khi yêu cầu người dùng đổi mật khẩu định kỳ
	 */
	@Column(name = "CredentialsNonExpired", nullable = false)
	@Builder.Default
	private boolean credentialsNonExpired = true;
	
	/**
	 * Thời điểm đăng nhập lần cuối
	 * Cần update thủ công thông qua method updateLastLoginDate()
	 */
	@Column(name = "LastLoginDate")
	private LocalDateTime lastLoginDate;
	
	/**
	 * Số lần đăng nhập thất bại liên tiếp
	 * Dùng để khóa tài khoản khi có nhiều lần thử sai
	 */
	@Column(name = "FailedLoginAttempts", nullable = false)
	@Builder.Default
	private Integer failedLoginAttempts = 0;
	
	
	
	/**
	 * Token để reset mật khẩu
	 * Được generate khi user yêu cầu quên mật khẩu
	 */
	@Column(name = "ResetPasswordToken")
	private String resetPasswordToken;
	
	/**
	 * Thời điểm hết hạn của reset password token
	 * Thường là 15-30 phút sau khi generate
	 */
	@Column(name = "ResetTokenExpiry")
	private LocalDateTime resetTokenExpiry;
	
	
	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private UserInformation userInformation;
	
	private String googleId;
	
	
	// ============ Implement UserDetails Methods ============
	
	/**
	 * Trả về danh sách quyền của người dùng
	 * Convert từ Set<Role> sang Collection<GrantedAuthority>
	 * Thêm prefix "ROLE_" theo convention của Spring Security
	 *
	 * @return Collection các quyền của user
	 */
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// Null check
		if (roles == null || roles.isEmpty()) {
			return Set.of(); // Empty set
		}
		
		// Create result set
		Set<GrantedAuthority> authorities = new HashSet<>();
		
		// Loop through each role
		roles.forEach(role -> {
			// 1. Add role itself with ROLE_ prefix
			authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));
			
			// 2. Add all permissions of this role
			if (role.getPermission() != null) {
				role.getPermission().forEach(permission ->
						                              authorities.add(new SimpleGrantedAuthority(permission.getPermission()))
				);
			}
		});
		
		return authorities;
	}
	
	
	/**
	 * Trả về password đã mã hóa
	 *
	 * @return encrypted password
	 */
	@Override
	public String getPassword() {
		return this.password;
	}
	
	/**
	 * Trả về username dùng để đăng nhập
	 *
	 * @return username
	 */
	@Override
	public String getUsername() {
		return this.username;
	}
	
	/**
	 * Kiểm tra tài khoản có hết hạn không
	 *
	 * @return true nếu tài khoản chưa hết hạn
	 */
	public boolean isUserNonExpired() {
		return this.userNonExpired;
	}
	
	/**
	 * Kiểm tra tài khoản có đang bị khóa không
	 *
	 * @return true nếu tài khoản không bị khóa
	 */
	
	public boolean isUserNonLocked() {
		return this.userNonLocked;
	}
	
	/**
	 * Kiểm tra mật khẩu có hết hạn không
	 *
	 * @return true nếu mật khẩu chưa hết hạn
	 */
	@Override
	public boolean isCredentialsNonExpired() {
		return this.credentialsNonExpired;
	}
	
	/**
	 * Kiểm tra tài khoản có được kích hoạt không
	 *
	 * @return true nếu tài khoản đang hoạt động
	 */
	@Override
	public boolean isEnabled() {
		return this.isEnabled;
	}
	
	// ============ Business Methods ============
	
	/**
	 * Tăng số lần đăng nhập thất bại
	 */
	public void incrementFailedLoginAttempts() {
		this.failedLoginAttempts++;
	}
	
	/**
	 * Reset số lần đăng nhập thất bại về 0
	 */
	public void resetFailedLoginAttempts() {
		this.failedLoginAttempts = 0;
	}
	
	/**
	 * Cập nhật thời điểm đăng nhập cuối
	 * Gọi method này sau khi user đăng nhập thành công
	 */
	public void updateLastLoginDate() {
		this.lastLoginDate = LocalDateTime.now();
	}
	
	/**
	 * Khóa tài khoản
	 * Dùng khi phát hiện hoạt động đáng ngờ hoặc vi phạm
	 */
	public void lockUser() {
		this.userNonLocked = false;
	}
	
	/**
	 * Mở khóa tài khoản và reset số lần đăng nhập thất bại
	 */
	public void unlockUser() {
		this.userNonLocked = true;
		this.failedLoginAttempts = 0;
	}
	
	/**
	 * Vô hiệu hóa tài khoản
	 * Tài khoản sẽ không thể đăng nhập
	 */
	public void disable() {
		this.isEnabled = false;
	}
	
	/**
	 * Kích hoạt tài khoản
	 * Cho phép tài khoản đăng nhập trở lại
	 */
	public void enable() {
		this.isEnabled = true;
	}
	
	/**
	 * Kiểm tra user có role cụ thể không
	 *
	 * @param role vai trò cần kiểm tra
	 * @return true nếu user có role này
	 */
	public boolean hasRole(Role role) {
		return this.roles != null && this.roles.contains(role);
	}
	
	/**
	 * Thêm role cho user
	 * Tự động khởi tạo Set nếu chưa có
	 *
	 * @param role vai trò cần thêm
	 */
	public void addRole(Role role) {
		if (this.roles == null) {
			this.roles = new HashSet<>();
		}
		this.roles.add(role);
	}
	
	/**
	 * Xóa role khỏi user
	 *
	 * @param role vai trò cần xóa
	 */
	public void removeRole(Role role) {
		if (this.roles != null) {
			this.roles.remove(role);
		}
	}
	
	/**
	 * Kiểm tra reset password token có hợp lệ không
	 * Token hợp lệ khi: tồn tại và chưa hết hạn
	 *
	 * @return true nếu token còn hợp lệ
	 */
	public boolean isResetTokenValid() {
		return this.resetPasswordToken != null
				&& this.resetTokenExpiry != null
				&& this.resetTokenExpiry.isAfter(LocalDateTime.now());
	}
	
	/**
	 * Xóa reset password token sau khi đã sử dụng
	 * Gọi sau khi đổi mật khẩu thành công
	 */
	public void clearResetToken() {
		this.resetPasswordToken = null;
		this.resetTokenExpiry = null;
	}
	
	@Override
	public Long getID() {
		return this.userId;
	}
	
	/**
	 * Kiểm tra hai User object có bằng nhau không
	 * So sánh dựa trên userId (unique identifier)
	 *
	 * @param o object cần so sánh
	 * @return true nếu userId bằng nhau
	 */
	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		User user = (User) o;
		return userId != null && userId.equals(user.userId);
	}
	
	/**
	 * Trả về hash code của User dựa trên userId
	 * Luôn consistent với equals() method
	 *
	 * @return hash code của User
	 */
	@Override
	public int hashCode() {
		return userId != null ? userId.hashCode() : 0;
	}
}