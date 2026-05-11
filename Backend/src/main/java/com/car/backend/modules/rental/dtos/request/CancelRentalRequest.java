package com.car.backend.modules.rental.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CancelRentalRequest {
	@NotBlank(message = "Lý do hủy không được để trống")
	@Size(max = 500)
	private String cancelReason;
}
