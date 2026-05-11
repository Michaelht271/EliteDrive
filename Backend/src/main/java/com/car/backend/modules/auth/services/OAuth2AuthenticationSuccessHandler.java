package com.car.backend.modules.auth.services;

import com.car.backend.modules.auth.entities.User;
import com.car.backend.security.UserPrincipal;
import com.car.backend.security.jwt.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
	
	private final JwtTokenProvider jwtTokenProvider;
	private final UserService userService;

	@org.springframework.beans.factory.annotation.Value("${app.auth.redirect-uri}")
	private String redirectUri;
	
	@SneakyThrows
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
		OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
		String email = oAuth2User.getAttribute("email");
		String name = oAuth2User.getAttribute("name");
		String googleId = oAuth2User.getAttribute("sub");

		log.info("Google login success for email: {}", email);
		
		// 1. Process user in DB
		User user = userService.processOAuth2User(name != null ? name : email, email, googleId, "");
		
		// 2. Create UserPrincipal for consistency
		UserPrincipal principal = UserPrincipal.builder()
				.userId(user.getUserId())
				.username(user.getUsername())
				.password("")
				.authorities(user.getAuthorities())
				.build();
		
		// 3. Generate JWT (raw token, no prefix)
		Authentication jwtAuth = new UsernamePasswordAuthenticationToken(principal, null, user.getAuthorities());
		String token = jwtTokenProvider.generateToken(jwtAuth); 

		// 4. Redirect to Frontend
		String target = redirectUri + "?token=" + token;
		log.info("Redirecting to frontend: {}", target);
		response.sendRedirect(target);
	}
}
