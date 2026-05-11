package com.car.backend.exception.custom.auth;

// UserLockedException.java
public class UserLockedException extends RuntimeException {
	public UserLockedException(String message) {
		super(message);
	}
}
