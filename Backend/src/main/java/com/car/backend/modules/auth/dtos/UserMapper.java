package com.car.backend.modules.auth.dtos;


import com.car.backend.modules.auth.dtos.request.UserRegistrationRequest;
import com.car.backend.modules.auth.dtos.response.UserInformationResponse;
import com.car.backend.modules.auth.dtos.response.UserRegistrationResponse;
import com.car.backend.modules.auth.entities.StaffInformation;
import com.car.backend.modules.auth.entities.User;
import com.car.backend.modules.auth.entities.AdminInformation;
import com.car.backend.modules.auth.entities.UserInformation;
import com.car.backend.modules.auth.enums.Role;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Mapper to convert between User and DTO
 *
 * @author Michael
 * @version 1.0
 * @since 2025
 */
@Component
public class UserMapper {
	
	/**
	 * Convert from RegistrationRequest to User Entity
	 * Do not set a password in here - it will encode on Service layers
	 *
	 * @param request DTO from clients
	 * @return User entity (not saved)
	 */
	public User toEntity(UserRegistrationRequest request) {
		return User.builder()
		           .username(request.getUsername())
		           .email(request.getEmail())
		           .phoneNumber(request.getPhoneNumber())
		           .roles(Set.of(Role.CUSTOMER))
		           .isEnabled(true)
		           .userNonExpired(true)
		           .userNonExpired(true)
		           .failedLoginAttempts(0)
		           .build();
	}
	/**
	 * Convert from User Entity to RegistrationResponse
	 *
	 * @param user Entity saved
	 * @return ResponseDTo
	 */
	
	public UserRegistrationResponse toUserRegistrationResponse(User user) {
		return UserRegistrationResponse.builder()
		                                  .userId(user.getUserId())
		                                  .username(user.getUsername())
		                                  .email(user.getEmail())
		                                  .phoneNumber(user.getPhoneNumber())
		                                  .roles(user.getRoles())
		                                  .isEnabled(user.isEnabled())
		                                  .createdDate(user.getCreatedDate())
		                                  .message("Registration User successful ")
		                                  .build();
	}

	/**
	 * Map UserInformation entity to Response DTO
	 */
	public UserInformationResponse toUserInformationResponse(UserInformation info) {
		if (info == null) return null;

		UserInformationResponse.UserInformationResponseBuilder builder = UserInformationResponse.builder()
				.fullName(info.getFullName())
				.address(info.getAddress())
				.avatarUrl(info.getAvatarUrl())
				.dateOfBirth(info.getDateOfBirth())
				.identifyId(info.getIdentifyId())
				.driverLicenceId(info.getDriverLicenceId());

		// Lấy thông tin từ User liên kết
		if (info.getUser() != null) {
			builder.userId(info.getUser().getUserId())
					.username(info.getUser().getUsername())
					.email(info.getUser().getEmail())
					.phoneNumber(info.getUser().getPhoneNumber())
					.roles(info.getUser().getRoles())
					.isEnabled(info.getUser().isEnabled())
					.createdDate(info.getUser().getCreatedDate());
		}

		// Xử lý các trường đặc thù của Subclasses
		if (info instanceof StaffInformation staff) {
			builder.salary(staff.getSalary())
					.shift(staff.getShift())
					.userType("STAFF");
		} else if (info instanceof AdminInformation) {
			builder.userType("ADMIN");
		} else {
			builder.userType("CUSTOMER");
		}

		return builder.build();
	}
}
