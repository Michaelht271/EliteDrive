package com.car.backend.config;

import com.car.backend.modules.auth.repository.HttpCookieOAuth2AuthorizationRequestRepository;
import com.car.backend.modules.auth.services.CustomOAuth2UserService;
import com.car.backend.modules.auth.services.CustomOidcUserService;
import com.car.backend.modules.auth.services.OAuth2AuthenticationSuccessHandler;
import com.car.backend.security.jwt.JwtProperties;
import com.car.backend.security.filters.JwtTokenValidationFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.crypto.SecretKey;

import static com.car.backend.common.constants.SecurityConstants.PUBLIC_API;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // QUAN TRỌNG: Kích hoạt @PreAuthorize
@Slf4j
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final JwtProperties jwtProperties;
	private final CustomOAuth2UserService customOAuth2UserService;
	private final CustomOidcUserService customOidcUserService;
	private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
	private final SecretKey secretKey;
	
	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return web -> web.ignoring().requestMatchers(
				"/swagger-ui/**",
				"/v3/api-docs/**",
				"/swagger-ui.html",
				"/favicon.ico",
				"/webjars/**"
		);
	}
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http)  {
		JwtTokenValidationFilter jwtValidationFilter =
				new JwtTokenValidationFilter(secretKey, jwtProperties.getTokenPrefix());
		
		
		return http
				.csrf(AbstractHttpConfigurer::disable)
				.cors(Customizer.withDefaults())
				.sessionManagement(session ->
						                   session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				)
				.authorizeHttpRequests(auth -> auth
						// 1. Yêu cầu xác thực cho các API cá nhân
						.requestMatchers("/api/auth/me", "/api/auth/change-password", "/api/auth/logout").authenticated()
						// 2. Cho phép các API công khai (Login, Register...)
						.requestMatchers(PUBLIC_API).permitAll()
						// 3. Toàn bộ API v1 sẽ được quản lý bởi @PreAuthorize ở từng Controller
						.requestMatchers("/api/v1/**").permitAll() 
						// 4. Các request khác yêu cầu login
						.anyRequest().authenticated()
				)
				.oauth2Login(oauth -> oauth
						.userInfoEndpoint(userInfo -> userInfo
								.userService(customOAuth2UserService)
								.oidcUserService(customOidcUserService)
						)
						.successHandler(oAuth2AuthenticationSuccessHandler)
						.authorizationEndpoint(endpoint -> endpoint
								.authorizationRequestRepository(
										new HttpCookieOAuth2AuthorizationRequestRepository()
								)
						)
				)
				.addFilterBefore(jwtValidationFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}
}
