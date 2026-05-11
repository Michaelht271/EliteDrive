package com.car.backend.modules.rental.dtos.request;

import com.car.backend.common.anotations.ValidDateRange;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@ValidDateRange(startDateField = "startDate", endDateField = "endDate", message = "Ngày kết thúc không thể trước ngày bắt đầu")
public class CreateRentalRequest {
	@NotNull(message = "Xe không được để trống")
	private Long carId;
	
	@NotNull(message = "Ngày bắt đầu không được để trống")
	@FutureOrPresent(message = "Ngày bắt đầu phải sau hôm nay")
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate startDate;
	
	@NotNull(message = "Ngày kết thúc không được để trống")
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate endDate;
	
	private String notes;
}
