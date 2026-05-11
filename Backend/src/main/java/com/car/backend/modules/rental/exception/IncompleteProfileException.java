package com.car.backend.modules.rental.exception;

import java.util.List;

// IncompleteProfileException.java — thêm vào exception/custom/business
public class IncompleteProfileException extends RuntimeException {
	
	private final List<String> missingFields;
	
	public IncompleteProfileException(List<String> missingFields) {
		super("Thông tin cá nhân chưa đầy đủ");
		this.missingFields = missingFields;
	}
	
	public List<String> getMissingFields() {
		return missingFields;
	}
}