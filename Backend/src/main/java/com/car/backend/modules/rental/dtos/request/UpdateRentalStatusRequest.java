package com.car.backend.modules.rental.dtos.request;

import com.car.backend.modules.rental.enums.RentalStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateRentalStatusRequest {
	@NotNull(message = "Trạng thái không được để trống")
	private RentalStatus status;
	
	@Size(max = 500)
	private String cancelReason;
}
