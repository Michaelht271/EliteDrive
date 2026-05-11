package com.car.backend.modules.auth.dtos.response;

import lombok.*;

/**
 * DTO cho JWT response
 * Trả về token và các thông tin liên quan
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class JwtResponse {
	
	private String token;
	@Builder.Default
	private String type = "Bearer";
	private String username;
	private String message;
	
}
