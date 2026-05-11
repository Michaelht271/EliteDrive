package com.car.backend.modules.auth.repository;

import com.car.backend.modules.auth.utils.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

public class HttpCookieOAuth2AuthorizationRequestRepository implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {
	private static final String COOKIE_NAME = "oauth2_auth_request";
	private static final int COOKIE_EXPIRE_SECOND = 180;
	
	@Override
	public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
		return CookieUtils.getCookie(request, COOKIE_NAME)
		                  .map(cookie -> CookieUtils.deserialize(cookie, OAuth2AuthorizationRequest.class)).orElse(null);
		
	}
	@Override
	public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request, HttpServletResponse response) {
	if(authorizationRequest == null) {
		CookieUtils.deleteCookie(request, response, COOKIE_NAME, null, COOKIE_EXPIRE_SECOND);
		
	} else {
		// Lưu State vào Cookie thay vì Session
		CookieUtils.addCookie(response, COOKIE_NAME, CookieUtils.serialize(authorizationRequest), COOKIE_EXPIRE_SECOND);
		
	}
	}
	@Override
	public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request, HttpServletResponse response) {
		return loadAuthorizationRequest(request);
	}
}
