package com.car.backend.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "application.jwt")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JwtProperties {
	private String secretKey;
	private String tokenPrefix;
	private Integer tokenExpirationAfterDays;
	
}
