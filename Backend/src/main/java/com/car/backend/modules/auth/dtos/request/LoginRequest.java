package com.car.backend.modules.auth.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor


public class LoginRequest {
	
	@NotBlank(message = "Username is not empty")
	@Size(min =3, max = 50, message = "Username must be from 3 to 50 character")
	private String username;
	
	@NotBlank(message = "Password is not empty")
	@Pattern(
			regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\p{Alnum}]).{8,}$",
			message = "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character."
	)
	private String password;
	
	
}
