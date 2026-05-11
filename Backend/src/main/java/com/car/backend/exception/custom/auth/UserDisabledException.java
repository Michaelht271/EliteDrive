package com.car.backend.exception.custom.auth;

// UserDisabledException.java
public class UserDisabledException extends RuntimeException {
	public UserDisabledException(String message) {
		super(message);
	}
}