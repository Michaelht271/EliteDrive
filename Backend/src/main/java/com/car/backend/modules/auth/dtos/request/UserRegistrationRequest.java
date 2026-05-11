package com.car.backend.modules.auth.dtos.request;

import com.car.backend.modules.auth.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * DTO để nhận thông tin đăng ký tài khoản từ client
 * Chứa các validation rules để đảm bảo dữ liệu hợp lệ
 *
 * @author Michael
 * @version 1.1
 * @since 2025
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class UserRegistrationRequest {
	/**
	 * Tên đăng nhập
	 * Độ dài: 5-50 ký tự
	 * Chỉ chứa chữ cái, số dấu gạch dưới và dấu chấm
	 *
	 */
	@NotBlank(message = "Username is not blank")
	@Size(min = 5, max = 50, message = "Username must be between 5 and 50 characters")
	@Pattern(
			regexp = "[a-zA-Z0-9._]+$",
			message = "Username must be have Character, number and _"
	)
	private String username;
	
	/**
	 * Password:
	 * -Min length: 8 character
	 * It must be having: 1 Uppercase, 1 lowercase, 1 number and 1 special character.
	 */
	@NotBlank(message = "Password is not blank")
	@Size(min = 8, message = "Password must be at least 8 characters")
	@Pattern(
			regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
			message = "Password phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
	)
	private String password;
	/**
	 * Xác nhận mật khẩu
	 * - Phải trùng với password
	 */
	@NotBlank(message = "Confirm password không được để trống")
	private String confirmPassword;
	
	/**
	 * Email:
	 * It is a valid email format
	 * No more than 100 character
	 *
	 */
	@NotBlank(message = "Email is not blank")
	@Size(max = 100, message = "Email must be less than 100 characters")
	@Email(message = "Email is not valid")
	private String email;

	@NotBlank(message = "Full name is not blank")
	private String fullName;

	private String address;

	private String identifyId;

	/**
	 * Số điện thoại (optional)
	 * - Định dạng: 10-15 số
	 */
	@Pattern(
			regexp = "^\\d{10,15}$",
			message = "Số điện thoại phải có 10-15 chữ số"
	)
	private String phoneNumber;
	
	private String role; // Thêm trường này cho Admin gán role (ADMIN, STAFF, CUSTOMER)

	private Set<Role> roles;
	
	/**
	 * Check password and confirmPassword are matched
	 *
	 * @return true if 2 passwords are same
	 */
	
	public boolean isPasswordMatching() {
		return password != null && password.equals(confirmPassword);
	}
}
