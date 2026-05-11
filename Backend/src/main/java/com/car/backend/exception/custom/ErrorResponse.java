package com.car.backend.exception.custom;

import lombok.*;


import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
	
	private String error;
	private String message;
	private int status;
	private LocalDateTime timestamp;
	
}
