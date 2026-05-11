package com.car.backend.security.filters;

import com.car.backend.security.UserPrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

/**
 * JWT Token Validation Filter - Xác thực JWT token cho các request tiếp theo
 *
 * <p>Class này là một Spring Security filter dùng để xác thực JWT token trong các HTTP request.
 * Nó được thực thi một lần cho mỗi request (OncePerRequestFilter).
 *
 * <p><b>Chức năng chính:</b>
 * <ul>
 *   <li>Lấy JWT token từ Authorization header của request</li>
 *   <li>Parse và xác thực tính hợp lệ của token (signature, expiration)</li>
 *   <li>Trích xuất thông tin user (username, authorities) từ token</li>
 *   <li>Thiết lập Authentication vào SecurityContext để sử dụng trong phần còn lại của request</li>
 * </ul>
 *
 * <p><b>Request Flow:</b>
 * <pre>
 * Request → Authorization Header → Extract Token → Parse JWT Claims →
 * Set Authentication in SecurityContext → Continue Filter Chain
 * </pre>
 *
 * <p><b>Error Handling:</b>
 * <ul>
 *   <li>JWT không hợp lệ hoặc hết hạn: 401 Unauthorized</li>
 *   <li>Lỗi bất ngờ: 500 Internal Server Error</li>
 * </ul>
 *
 * @author Michael
 * @version 1.0
 */
@Slf4j
public class JwtTokenValidationFilter extends OncePerRequestFilter {
	
	private final SecretKey secretKey;
	private final String tokenPrefix;
	
	/**
	 * Constructor khởi tạo filter với secret key và token prefix.
	 *
	 * @param secretKey Secret key dùng để xác thực JWT signature
	 * @param tokenPrefix Tiền tố của token (thường là "Bearer ") để nhận diện JWT token
	 */
	public JwtTokenValidationFilter(SecretKey secretKey, String tokenPrefix) {
		this.secretKey = secretKey;
		this.tokenPrefix = tokenPrefix;
	}
	
	/**
	 * Thực hiện filter logic để xác thực JWT token.
	 *
	 * <p><b>Các bước xử lý:</b>
	 * <ol>
	 *   <li>Lấy Authorization header từ request</li>
	 *   <li>Kiểm tra header có tồn tại và bắt đầu bằng token prefix (Bearer)</li>
	 *   <li>Extract token từ header bằng cách xóa prefix</li>
	 *   <li>Parse JWT token và xác thực signature bằng secret key</li>
	 *   <li>Lấy username (subject) và authorities từ JWT claims</li>
	 *   <li>Tạo UsernamePasswordAuthenticationToken từ thông tin trích xuất</li>
	 *   <li>Thiết lập authentication vào SecurityContextHolder</li>
	 *   <li>Tiếp tục filter chain</li>
	 * </ol>
	 *
	 * @param request HTTP request từ client
	 * @param response HTTP response gửi lại client
	 * @param filterChain Spring Security filter chain
	 * @throws IOException Nếu có lỗi I/O khi ghi response
	 */
	@Override
	protected void doFilterInternal(@Nonnull HttpServletRequest request, @Nonnull HttpServletResponse response,
	                                @Nonnull FilterChain filterChain) throws IOException {
		try {
			String authorizationHeader = request.getHeader("Authorization");
			
			if (authorizationHeader == null || !authorizationHeader.startsWith(tokenPrefix)) {
				filterChain.doFilter(request, response);
				return;
			}
			
			String token = authorizationHeader.replace(tokenPrefix, "").trim();
			Claims claims = Jwts.parser()
			                    .verifyWith(secretKey)
			                    .build()
			                    .parseSignedClaims(token)
			                    .getPayload();
			
			String username = claims.getSubject();
			Long userId = claims.get("userId", Long.class); // <--- Extract userId from claims
			Object authoritiesObj = claims.get("authorities");
			
			List<SimpleGrantedAuthority> grantedAuthorities;
			if (authoritiesObj instanceof List<?> authList) {
				grantedAuthorities = authList.stream()
				                             .map(Object::toString)
				                             .map(SimpleGrantedAuthority::new)
				                             .toList();
			} else {
				grantedAuthorities = List.of();
			}
			
			log.debug("User: {}, ID: {}, Authorities: {}", username, userId, grantedAuthorities);
			
			// Use UserPrincipal instead of String username
			UserPrincipal principal = new UserPrincipal(userId, username, grantedAuthorities);
			
			Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, grantedAuthorities);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			
			filterChain.doFilter(request, response);
			
		} catch (JwtException e) {
			log.error("JWT validation failed: {}", e.getMessage());
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"error\":\"Invalid or expired token\"}");
		} catch (Exception e) {
			log.error("Unexpected error in JWT filter: {}", e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.setContentType("application/json");
			response.getWriter().write("{\"error\":\"Internal server error\"}");
		}
	}
}