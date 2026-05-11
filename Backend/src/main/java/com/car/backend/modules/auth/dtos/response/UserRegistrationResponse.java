package com.car.backend.modules.auth.dtos.response;

import com.car.backend.modules.auth.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO return account information after registration success
 * Do not have a password
 *
 * @author Michael
 * @version 1.0
 * @since 2025
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class UserRegistrationResponse {
	/**
	 * ID of a registered user
	 */
	
	private Long userId;
	
	/**
	 * Username of a registered user
	 */
	
	private String username;
	
	/**
	 * Email of a registered user
	 */
	
	private String email;
	
	/**
	 * Phone number of a registered user
	 */
	
	private String phoneNumber;
	
	/**
	 * Roles of a registered user
	 */
	
	private Set<Role> roles;
	
	/**
	 * Status of a registered user
	 */
	
	private boolean isEnabled;
	
	/**
	 * Create User Time
	 */
	
	private LocalDateTime createdDate;
	/**
	 * Message
	 */
	private String message;
}
