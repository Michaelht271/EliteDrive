package com.car.backend.exception.custom.auth;

// UserExpiredException.java
public class UserExpiredException extends RuntimeException {
	public UserExpiredException(String message) {
		super(message);
	}
}