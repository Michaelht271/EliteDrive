package com.car.backend.modules.auth.services;

import com.car.backend.modules.auth.entities.User;
import com.car.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
	private final UserService userService;
	// ✅ Xóa passwordEncoder — không dùng
	
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) {
		OAuth2User oauth2User = super.loadUser(userRequest);
		Map<String, Object> attrs = oauth2User.getAttributes();
		
		String email    = (String) attrs.get("email");
		String googleId = (String) attrs.get("sub");
		String name     = (String) attrs.get("name");
		String username = email != null ? email.split("@")[0] : "google_" + googleId;
		
		User user = userService.processOAuth2User(username, email, googleId, name);
		
		return UserPrincipal.builder()
		                    .userId(user.getUserId())
		                    .username(user.getUsername())
		                    .authorities(user.getAuthorities())
		                    .attributes(attrs)
		                    .build();
	}
}