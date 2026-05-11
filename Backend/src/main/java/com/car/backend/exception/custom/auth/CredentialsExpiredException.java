package com.car.backend.exception.custom.auth;

public class CredentialsExpiredException extends RuntimeException {
	public CredentialsExpiredException(String message) {
		super(message);
	}
}