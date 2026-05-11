package com.car.backend.modules.car.dtos.request;

import com.car.backend.modules.car.enums.CarStatus;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CarFilterRequest {
	
	private String    keyword;   // search theo carName hoặc model
	private String    brand;
	private CarStatus status;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate startDate;
	
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate endDate;
	@Min(value = 0, message = "Giá không được âm")
	private BigDecimal minPrice;
	
	@Min(value = 0, message = "Giá không được âm")
	private BigDecimal maxPrice;

	private Integer seats;
	}