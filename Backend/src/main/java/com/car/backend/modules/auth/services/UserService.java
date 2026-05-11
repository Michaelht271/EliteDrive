package com.car.backend.modules.auth.services;

import com.car.backend.exception.custom.auth.CredentialsExpiredException;
import com.car.backend.exception.custom.auth.UserDisabledException;
import com.car.backend.exception.custom.auth.UserExpiredException;
import com.car.backend.exception.custom.auth.UserLockedException;
import com.car.backend.modules.auth.dtos.UserMapper;
import com.car.backend.modules.auth.dtos.request.UserRegistrationRequest;
import com.car.backend.modules.auth.dtos.response.UserRegistrationResponse;
import com.car.backend.modules.auth.entities.User;
import com.car.backend.modules.auth.enums.Role;
import com.car.backend.modules.auth.repository.UserRepository;

import com.car.backend.modules.auth.services.interfaces.UserInformationService;
import com.car.backend.security.UserPrincipal;
import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.security.auth.login.AccountNotFoundException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService  implements UserDetailsService {
	private final EmailServices emailServices;
	private final UserInformationService userInformationService;
	Random random = new Random();
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	
	private final UserMapper userMapper;
	private static final int MAX_FAILED_ATTEMPTS = 5;

	// ============ OTP & PASSWORD MANAGEMENT ============

	/**
	 * Xác thực OTP để kích hoạt tài khoản
	 */
	@Transactional
	public void verifyOtp(String email, int otpCode) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

		if (user.getOtpCode() != otpCode) {
			throw new IllegalArgumentException("Invalid OTP code");
		}

		user.setEnabled(true);
		user.setOtpCode(0); // Clear OTP sau khi dùng
		userRepository.save(user);
		log.info("User {} verified successfully", email);
	}

	/**
	 * Quên mật khẩu - Gửi Link đặt lại mật khẩu qua email
	 */
	@Transactional
	public void forgotPassword(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

		String token = UUID.randomUUID().toString();
		user.setResetPasswordToken(token);
		user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30)); // 30 phút hết hạn
		userRepository.save(user);

		// Gửi mail chứa link đặt lại mật khẩu
		emailServices.sendForgotPasswordEmail(email, token);
	}

	/**
	 * Reset mật khẩu bằng Token
	 */
	@Transactional
	public void resetPassword(String token, String newPassword) {
		User user = userRepository.findByResetPasswordToken(token)
				.orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));

		if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
			throw new IllegalArgumentException("Reset token has expired");
		}

		user.setPassword(passwordEncoder.encode(newPassword));
		user.setResetPasswordToken(null);
		user.setResetTokenExpiry(null);
		userRepository.save(user);
		log.info("Password reset successfully for user: {}", user.getUsername());
	}

	/**
	 * Đổi mật khẩu cho người dùng hiện tại
	 */
	@Transactional
	public void changePassword(Long userId, String oldPassword, String newPassword) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
			throw new IllegalArgumentException("Incorrect old password");
		}

		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
		log.info("Password changed successfully for user: {}", user.getUsername());
	}
	
	
	// ============ REGISTRATION ============
	
	/**
	 * Đăng ký tài khoản mới
	 *
	 * @param request UserRegistrationRequest cần tạo
	 * @return User đã tạo
	 * @throws IllegalArgumentException nếu data không hợp lệ
	 */
	/**
	 * Đăng ký tài khoản mới từ OAuth2 (Google/Facebook)
	 * Tự động kích hoạt tài khoản vì đã được Provider xác thực email
	 */
	@Transactional
	public User processOAuth2User(String username, String email, String googleId, String fullName) {
		log.info("Processing OAuth2 user: email={}", email);
		
		return userRepository.findByEmail(email)
		                     .map(existingUser -> {
			                     log.info("Existing user found: {}. Updating.", email);
			                     existingUser.setEnabled(true);
			                     if (existingUser.getGoogleId() == null) {
				                     existingUser.setGoogleId(googleId);
			                     }
			                     return userRepository.save(existingUser);
		                     })
		                     .orElseGet(() -> {
			                     log.info("New OAuth2 user: {}", username);
			                     String finalUsername = resolveUsername(username);
			                     
			                     User newUser = User.builder()
			                                        .username(finalUsername)
			                                        .email(email)
			                                        .googleId(googleId)
			                                        .password("")
			                                        .isEnabled(true)
			                                        .userNonExpired(true)
			                                        .userNonLocked(true)
			                                        .credentialsNonExpired(true)
			                                        .failedLoginAttempts(0)
			                                        .roles(new HashSet<>(List.of(Role.CUSTOMER)))
			                                        .build();
			                     
			                     User savedUser = userRepository.save(newUser);
			                     
			                     // Tạo thông tin ban đầu với FullName từ OAuth2
			                     UserRegistrationRequest dummyRequest = new UserRegistrationRequest();
			                     dummyRequest.setFullName(fullName != null ? fullName : username);
			                     userInformationService.createInitialInformation(savedUser, dummyRequest);
			                     
			                     return savedUser;
		                     });
	}
	
	private String resolveUsername(String base) {
		String candidate = base;
		int count = 1;
		while (isUsernameExists(candidate)) {
			candidate = base + count++;
		}
		return candidate;
	}

	@Transactional
	public UserRegistrationResponse registerByAdmin(UserRegistrationRequest request) {
		log.info("Admin creating user: {} with role: {}", request.getUsername(), request.getRole());
		
		if (isUsernameExists(request.getUsername())) {
			throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
		}
		if (isEmailExists(request.getEmail())) {
			throw new IllegalArgumentException("Email đã đã được sử dụng");
		}
		
		User user = userMapper.toEntity(request);
		String rawPassword = request.getPassword(); // Lưu mật khẩu gốc để gửi mail
		user.setPassword(passwordEncoder.encode(rawPassword));
		user.setEnabled(true);
		user.setFailedLoginAttempts(0);
		
		// Gán Role linh hoạt
		Set<Role> assignedRoles = new HashSet<>();
		if (request.getRole() != null) {
			try {
				assignedRoles.add(Role.valueOf(request.getRole().toUpperCase()));
			} catch (Exception e) {
				assignedRoles.add(Role.CUSTOMER);
			}
		} else {
			assignedRoles.add(Role.CUSTOMER);
		}
		user.setRoles(assignedRoles);
		
		User savedUser = userRepository.save(user);
		userInformationService.createInitialInformation(savedUser, request);

		// Gửi Email thông tin tài khoản
		emailServices.sendAccountInfoEmail(savedUser.getEmail(), savedUser.getUsername(), rawPassword);
		
		return userMapper.toUserRegistrationResponse(savedUser);
	}
	
	@Transactional
	public UserRegistrationResponse register(UserRegistrationRequest request) {
		log.info("Creating user: {}", request.getUsername());
		// 1. Validate password matching
		if (!request.isPasswordMatching()) {
			throw new IllegalArgumentException("Password and confirm password do not match");
		}
		
		// 2. Check UserName da ton tai chua
		if (isUsernameExists(request.getUsername())) {
			throw new IllegalArgumentException("Username already exists");
		}
		
		// 3. Check Email da ton tai chua
		if (isEmailExists(request.getEmail())) {
			throw new IllegalArgumentException("Email already exists");
		}
		
		User user = userMapper.toEntity(request);
		
		// Ensure password is taken from the incoming request (mapper intentionally may not set it)
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setEnabled(false);
		user.setFailedLoginAttempts(0);
		
		int otp = random.nextInt(1_000_000);
		user.setOtpCode(otp);
		
		// 6. Save User first
		User savedUser = userRepository.save(user);
		log.info("User created successfully: {}", savedUser.getUserId());
		
		// 7. Create UserInformation via Service (Factory inside)
		userInformationService.createInitialInformation(savedUser, request);
		
		emailServices.sendVerificationEmail(savedUser.getEmail(), String.valueOf(otp));
		
		return  userMapper.toUserRegistrationResponse(savedUser);
	}
	

	
	/**
	 * Kiểm tra trạng thái user trước khi login
	 */
	private void checkUserStatus(User user) {
		// Check if user is enabled
		if (!user.isEnabled()) {
			log.warn("Login failed: User disabled - {}", user.getUsername());
			throw new UserDisabledException("User is disabled");
		}
		
		// Check if user is locked
		if (!user.isUserNonLocked()) {
			log.warn("Login failed: User locked - {}", user.getUsername());
			throw new UserLockedException("User is locked due to multiple failed login attempts");
		}
		
		// Check if user expired
		if (!user.isUserNonExpired()) {
			log.warn("Login failed: User expired - {}", user.getUsername());
			throw new UserExpiredException("User has expired");
		}
		
		// Check if credentials expired
		if (!user.isCredentialsNonExpired()) {
			log.warn("Login failed: Credentials expired - {}", user.getUsername());
			throw new CredentialsExpiredException("Password has expired. Please reset your password");
		}
	}



	// ============ ACCOUNT MANAGEMENT ============
	
	/**
	 * Unlock user bị khóa
	 *
	 * @param userId ID của user
	 */
	@Transactional
	public void unlockUser(Long userId) throws AccountNotFoundException {
		User user = userRepository.findById(userId)
						   .orElseThrow(() -> new AccountNotFoundException("User not found s"));
		
		user.unlockUser();
		log.info("User unlocked: {}", user.getUsername());
	}
	
	/**
	 * Enable user
	 *
	 * @param userId ID của user
	 */
	@Transactional
	public void enableUser(Long userId) throws AccountNotFoundException {
		User user = userRepository.findById(userId)
						   .orElseThrow(() -> new AccountNotFoundException("User not found"));
		
		user.enable();
		log.info("User enabled: {}", user.getUsername());
	}
	
	/**
	 * Disable user
	 *
	 * @param userId ID của user
	 */
	@Transactional
	public void disableUser(Long userId) throws AccountNotFoundException {
		User user = userRepository.findById(userId)
						   .orElseThrow(() -> new AccountNotFoundException("User not found"));
		
		user.disable();
		log.info("User disabled: {}", user.getUsername());
	}
	
	/**
	 * Lấy user theo username
	 *
	 * @param username Username
	 * @return User
	 */
	@Transactional(readOnly = true)
	public User getUserByUsername(String username) throws AccountNotFoundException {
		return userRepository.findByUsername(username)
						 .orElseThrow(() -> new AccountNotFoundException("User not found: " + username));
	}
	
	public User getUserByEmail(String email) throws AccountNotFoundException {
		return userRepository.findByEmail(email)
						 .orElseThrow(() -> new AccountNotFoundException("User not found: " + email));
	}

	public User loadUserById(Long userId) throws AccountNotFoundException {
		return userRepository.findById(userId)
				.orElseThrow(() -> new AccountNotFoundException("User not found: " + userId));
	}

	@Transactional
	public void deleteById(Long userId) {
		userRepository.deleteById(userId);
		log.info("User with ID {} deleted successfully", userId);
	}
	
	/**
	 * Kiểm tra username có tồn tại không
	 *
	 * @param username Username cần check
	 * @return true nếu tồn tại
	 */
	// @Transactional(readOnly = true)
	public boolean isUsernameExists(String username) {
		return userRepository.existsByUsername(username);
	}
	
	/**
	 * Kiểm tra email có tồn tại không
	 *
	 * @param email Email cần check
	 * @return true nếu tồn tại
	 */
	// @Transactional(readOnly = true)
	public boolean isEmailExists(String email) {
		return userRepository.existsByEmail(email);
	}
	
	
	@Override
	public UserDetails loadUserByUsername(@Nonnull String username) throws UsernameNotFoundException {
		log.info("Loading user: {}", username);
		
		User user = userRepository.findByUsername(username)
		                          .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
		
		// Chỉ check status, KHÔNG check password
		checkUserStatus(user);
		
		return UserPrincipal.builder()
		                    .userId(user.getUserId())
		                    .username(user.getUsername())
		                    .password(user.getPassword())
		                    .authorities(user.getAuthorities())
		                    .build();
	}
}

