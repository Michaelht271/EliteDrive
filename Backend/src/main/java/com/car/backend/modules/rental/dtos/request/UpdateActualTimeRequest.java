package com.car.backend.modules.rental.dtos.request;

import jakarta.validation.constraints.AssertTrue;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

// UpdateActualTimeRequest.java
@Data
public class UpdateActualTimeRequest {
	
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
	private LocalDateTime actualStartDate;   // nullable — chỉ update cái nào có giá trị
	
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
	private LocalDateTime actualEndDate;
	
	@AssertTrue(message = "actualEndDate phải sau actualStartDate")
	private boolean isValidRange() {
		if (actualStartDate == null || actualEndDate == null) return true;
		return actualEndDate.isAfter(actualStartDate);
	}
}