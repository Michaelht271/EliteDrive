package com.car.backend.modules.auth.services;


import com.car.backend.modules.auth.entities.User;
import com.car.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;

import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import org.springframework.stereotype.Component;
@Component
@RequiredArgsConstructor
public class CustomOidcUserService extends OidcUserService {
	private final UserService userService;
	
	@Override
	public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
		OidcUser oidcUser = super.loadUser(userRequest);
		
		String email    = oidcUser.getAttribute("email");
		String googleId = oidcUser.getAttribute("sub");
		String name     = oidcUser.getAttribute("name");
		String username = email != null
				? email.split("@")[0]
				: "google_" + googleId;
		
		// ✅ Bỏ isEmailExists check — processOAuth2User tự handle cả 2 case
		User user = userService.processOAuth2User(username, email, googleId, name);
		
		// ✅ Trả về UserPrincipal để Auditing và Security thống nhất
		return UserPrincipal.builder()
		                    .userId(user.getUserId())
		                    .username(user.getUsername())
		                    .authorities(user.getAuthorities())
		                    .attributes(oidcUser.getAttributes())
		                    .idToken(oidcUser.getIdToken())
		                    .userInfo(oidcUser.getUserInfo())
		                    .build();
	}
}