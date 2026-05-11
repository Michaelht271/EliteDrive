package com.car.backend.modules.auth.controller;

import com.car.backend.common.anotations.CurrentUserId;
import com.car.backend.exception.custom.ErrorResponse;

import com.car.backend.modules.auth.dtos.request.*;
import com.car.backend.modules.auth.dtos.response.JwtResponse;
import com.car.backend.modules.auth.dtos.response.UserRegistrationResponse;
import com.car.backend.modules.auth.services.UserService;
import com.car.backend.security.jwt.JwtTokenProvider;
import com.car.backend.modules.auth.entities.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller - REST API endpoints cho authentication*
 * Thay thế JwtUsernameAndPasswordAuthenticationFilter
 * Xử lý các authentication requests thông qua REST endpoints
 */
@RestController
@RequestMapping("/api/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {
	private final AuthenticationManager authenticationManager;
	private final JwtTokenProvider jwtTokenProvider;
	private final UserService userService;

	// ============ OTP & PASSWORD MANAGEMENT ENDPOINTS ============

	@PostMapping("/verify-otp")
	public ResponseEntity<Map<String, String>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
		userService.verifyOtp(request.getEmail(), request.getOtpCode());
		return ResponseEntity.ok(Map.of("message", "Account activated successfully"));
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
		userService.forgotPassword(request.getEmail());
		return ResponseEntity.ok(Map.of("message", "OTP sent to your email for password reset"));
	}

	@PostMapping("/reset-password")
	public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		userService.resetPassword(request.getToken(), request.getNewPassword());
		return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
	}

	@PostMapping("/change-password")
	public ResponseEntity<Map<String, String>> changePassword(
			@CurrentUserId Long userId,
			@Valid @RequestBody ChangePasswordRequest request) {
		userService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
		return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
	}
	
	/**
	 * Login endpoint*
	 * POST /api/auth/login
	 * Body{ " username: "Join", "password": "password" }
	 *
	 * @param loginRequest Login credentials
	 *
	 * @return JWT token nếu thành công, error nếu thât bại
	 */
	
	@PostMapping("/login")
	public ResponseEntity<Object> login(@Valid @RequestBody LoginRequest loginRequest) {
		try {
			log.info("Login request received for username: {}", loginRequest.getUsername());
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
			);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			String token = jwtTokenProvider.generateTokenWithPrefix(authentication);
			
			// Lấy username chuẩn từ đối tượng đã xác thực
			String authenticatedUsername = authentication.getName();
			
			return ResponseEntity.ok(JwtResponse.builder()
					.token(token)
					.username(authenticatedUsername)
					.build());
		} catch (Exception e) {
			log.error("Login failed for username: {}", loginRequest.getUsername());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
					ErrorResponse.builder()
							.error("AUTHENTICATION_FAILED")
							.message("Invalid username or password")
							.status(HttpStatus.UNAUTHORIZED.value()).build());
		}
	}
	
	@GetMapping("/csrf")
	public ResponseEntity<Map<String, String>> getCsrfToken(CsrfToken csrfToken) {
		return ResponseEntity.ok(Map.of(
					"token", csrfToken.getToken(),
						"headerName", csrfToken.getHeaderName()
		));
	}

	/**
	 * Get current user info
	 * GET /api/auth/me
	 * Header: Authorization: Bearer <token>
	 *
	 * @param authentication Tự động inject bởi Spring Security
	 * @return User info
	 */
	@GetMapping("/me")
	public ResponseEntity<Object> getCurrentUser(Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ErrorResponse.builder().error("UNAUTHORIZED").message("User not authenticated").status(HttpStatus.UNAUTHORIZED.value()).build());
		}
		
		// Lấy đầy đủ thông tin từ Database thay vì chỉ lấy từ Token
		try {
			User user = userService.getUserByUsername(authentication.getName());
			Map<String, Object> userInfo = new HashMap<>();
			userInfo.put("username", user.getUsername());
			
			// Xử lý null-safe cho UserInformation
			if (user.getUserInformation() != null) {
				userInfo.put("fullName", user.getUserInformation().getFullName());
				userInfo.put("avatarUrl", user.getUserInformation().getAvatarUrl());
			} else {
				userInfo.put("fullName", user.getUsername());
				userInfo.put("avatarUrl", null);
			}
			
			userInfo.put("authorities", authentication.getAuthorities());
			return ResponseEntity.ok(userInfo);
		} catch (Exception e) {
			log.error("Error in getCurrentUser: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error retrieving user profile"));
		}
	}
	@PostMapping("/logout")
	public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = (authentication != null) ? authentication.getName() : "Anonymous";
		
		SecurityContextHolder.clearContext();
		log.info("User logged out: {}", username);
		
		return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
	}
	@PostMapping ("/register")
	public ResponseEntity<Object> registerUser(@Valid @RequestBody UserRegistrationRequest registerRequest) {
		try {
			log.info("Register request received for username: {}", registerRequest.getUsername());
			UserRegistrationResponse registerUser = userService.register(registerRequest);
			return ResponseEntity.ok(registerUser);
		} catch(Exception e){
			// Log full stacktrace and return the exception message in response to aid debugging
			log.error("Register failed for username: {}", registerRequest.getUsername(), e);
			String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown error";
			return ResponseEntity.status(HttpStatus.CONFLICT).body( Map.of("message", "Register failed", "error", errorMessage));
		}
	}
	/**
	 * Endpoint phục vụ test khi chưa có FE.
	 * Nhận token từ query param và trả về JSON.
	 */
	@GetMapping("/success")
	public ResponseEntity<Map<String, String>> loginSuccess(@RequestParam("token") String token) {
		return ResponseEntity.ok(Map.of(
				"message", "Login Google thành công!",
				"token", token
		));
	}
	
	
}
