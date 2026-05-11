package com.car.backend.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import static com.car.backend.common.constants.SecurityConstants.*;

@Configuration
public class CorsConfig {
	

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		
		// 1. Allowed Origins
		corsConfiguration.setAllowedOrigins(URL_ORIGIN);
		
		// 2. Allowed Methods
		corsConfiguration.setAllowedMethods(URL_METHOD );
		
		// 3. Allowed Headers - include Authorization and other required headers
		corsConfiguration.setAllowedHeaders(ALLOW_HEADER);
		
		// 4. Exposed Headers
		corsConfiguration.setExposedHeaders(EXPOSED_HEADER);
		
		// 5. Credentials
		corsConfiguration.setAllowCredentials(true);
		
		// 6. Cache
		corsConfiguration.setMaxAge(MAX_AGE);
		
		UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
		urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
		
	return	urlBasedCorsConfigurationSource	;
	}
}