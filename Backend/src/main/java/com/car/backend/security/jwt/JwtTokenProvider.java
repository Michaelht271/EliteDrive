package com.car.backend.security.jwt;


import com.car.backend.modules.auth.entities.User;
import com.car.backend.security.UserPrincipal;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.LocalDate;
import java.util.Date;

/**
 * JWT token Provider - Tạo và validate JWT token*
 * Class này tách logic JWT ra khỏi Filter/ Controller
 * dễ dàng tái sử dụng và text
 */

@Component
@Slf4j
public class JwtTokenProvider {
	
	private final SecretKey secretKey;
	private final JwtProperties jwtProperties;
	
	public JwtTokenProvider(SecretKey secretKey, JwtProperties jwtProperties) {
		this.secretKey = secretKey;
		this.jwtProperties = jwtProperties;
	}
	
	/**
	 * Generate JWT token từ Authentication object
	 *
	 * @param authentication Authentication object chứa User Information
	 * @return JWT token string ( Không có Bearer " prefix )
	 */
	public String generateToken(Authentication authentication) {
		try {
			// Extract User ID from principal
			Long userId = null;
			Object principal = authentication.getPrincipal();
			
			if (principal instanceof UserPrincipal userPrincipal) {
				userId = userPrincipal.getUserId();
			} else if (principal instanceof User user) {
				userId = user.getUserId();
			} else if (principal instanceof org.springframework.security.core.userdetails.User springUser) {
				// Nếu là user mặc định của Spring, ta phải query DB để lấy ID
				try {
					userId = User.builder().build().getUserId(); // Placeholder logic
				} catch (Exception ignored) {}
			}
			
			String token = Jwts.builder()
			                   .subject(authentication.getName())
			                   .claim("userId", userId) // <--- Add userId claim
			                   .claim("authorities", authentication.getAuthorities()
			                                                       .stream()
			                                                       .map(GrantedAuthority::getAuthority)
			                                                       .toList())
			                   .issuedAt(new Date())
			                   .expiration(java.sql.Date.valueOf(LocalDate.now().plusDays(jwtProperties.getTokenExpirationAfterDays())))
			                   .signWith(secretKey)
			                   .compact();
			log.info("Create a jwt token successfully with userId: {}", userId);
			return token;
		} catch (Exception e) {
			log.error("Error generating JWT token: {}", e.getMessage());
			return null;
		}
	}
	
	/**
	 * Generate a JWT token with a prefix
	 *
	 * @param authentication Authentication object chứa User Information
	 * @return Full token with a prefix "Bearer"
	 */
	public String generateTokenWithPrefix (Authentication authentication ) {
		String token = generateToken(authentication);
		log.info("Create a jwt token with prefix " + jwtProperties.getTokenPrefix() + " successfully");
		return jwtProperties.getTokenPrefix() +" "+ token;
	}
	
	/**
	 * Validate JWT token
	 *
	 * @param token JWT token string
	 * @return true nếu token hợp lệ
	 */
	
	public boolean validateToken (String token) {
		try {
			Jwts.parser()
			    .verifyWith(secretKey)
			    .build()
			    .parseSignedClaims(token);
			log.info("JWT validation successfully");
			return true;
		} catch (Exception e) {
			log.error("JWT validation failed: {}", e.getMessage());
		}
		return false;
	}
	
	/**
	 * Get userName từ JWT token
	 *
	 * @param token JWT token string
	 * @return username
	 */
	
	
	public String getUserNameFromToken (String token) {
		try {return Jwts.parser()
				.verifyWith(secretKey)
				.build()
				.parseSignedClaims(token)
		        .getPayload()
		        .getSubject();
		} catch (Exception e) {
			log.error("JWT validation failed: {}", e.getMessage());
			return null;
		}
	}
	
}
