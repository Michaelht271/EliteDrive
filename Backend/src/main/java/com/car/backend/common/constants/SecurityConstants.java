package com.car.backend.common.constants;

import java.util.List;

public record SecurityConstants() {
	public static final List<String> URL_ORIGIN = List.of("http://localhost:5173");
	public static final List<String> URL_METHOD = List.of("GET", "POST", "PUT", "DELETE", "OPTIONS");
	public static final List<String> ALLOW_HEADER = List.of(
			"Authorization",
			"Accept",
			"X-Requested-With",
			"Content-Type",
			"Access-Control-Request-Method",
			"Access-Control-Request-Headers"
	);
	public static final List<String> EXPOSED_HEADER =List.of(
			"Access-Control-Allow-Origin",
			"Access-Control-Allow-Credentials"
	);
	
	public static final String TOKEN_PREFIX = "Bearer ";
	public static final Long MAX_AGE = 3600L;
	
	
	
	public static final String[] PUBLIC_API = {
			"/api/auth/**",
			"/api/v1/cars/**",
			"/api/news",
			"/car/**",
			"/login/**",
			"/oauth2/**",
			"/swagger-ui/**",
			"/swagger-ui.html",
			"/v3/api-docs/**",
			"/swagger-resources/**",
			"/webjars/**",
			"/favicon.ico",
			"/error"
	};
}
